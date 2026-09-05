// Trooth — optimized unified realtime messaging + notification bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothUnifiedRealtimeBooted)return;
    window.troothUnifiedRealtimeBooted=true;
    var userId=null,channel=null,timer=null,reconnectTimer=null,starting=false,stopped=false,authSub=null;
    function ping(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function clearTimers(){clearTimeout(timer);clearTimeout(reconnectTimer);timer=null;reconnectTimer=null;}
    function clearChannel(){
      clearTimeout(reconnectTimer);reconnectTimer=null;
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothUnifiedRealtimeChannel=null;
    }
    function scheduleRefresh(){
      clearTimeout(timer);
      timer=setTimeout(function(){
        timer=null;
        if(!userId||stopped)return;
        var d={source:'realtime-bridge',userId:userId};
        ping('trooth-messages-refresh',d);
        ping('trooth-notifications-refresh',d);
        ping('trooth-navigation-refresh',d);
      },180);
    }
    function reconnect(){
      if(stopped||!userId)return;
      clearTimeout(reconnectTimer);
      reconnectTimer=setTimeout(function(){reconnectTimer=null;start()},700);
    }
    async function getUser(){
      try{var r=await sb.auth.getUser();userId=r.data&&r.data.user?r.data.user.id:null;return userId}catch(e){userId=null;return null}
    }
    async function start(){
      if(starting||stopped)return;starting=true;
      try{
        var id=await getUser();
        clearChannel();
        if(!id||stopped)return;
        channel=sb.channel('trooth-unified-realtime-'+id+'-'+Date.now())
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+id},function(e){ping('trooth-message-incoming',e.new);scheduleRefresh()})
          .on('postgres_changes',{event:'UPDATE',schema:'public',table:'messages',filter:'receiver_id=eq.'+id},function(e){ping('trooth-message-updated',e.new);scheduleRefresh()})
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+id},function(e){ping('trooth-notification-incoming',e.new);scheduleRefresh()})
          .subscribe(function(status){
            if(status==='SUBSCRIBED')scheduleRefresh();
            else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')reconnect();
          });
        window.troothUnifiedRealtimeChannel=channel;
      }finally{starting=false}
    }
    function cleanup(full){
      clearTimers();clearChannel();
      if(full&&authSub){try{authSub.subscription.unsubscribe()}catch(e){}authSub=null;}
      window.troothUnifiedRealtimeChannel=null;
    }
    start();
    authSub=sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||event==='USER_DELETED'||!session){
        stopped=true;userId=null;cleanup(false);return;
      }
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        stopped=false;clearChannel();setTimeout(start,60);
      }
    });
    window.addEventListener('beforeunload',function(){stopped=true;cleanup(true)},{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
