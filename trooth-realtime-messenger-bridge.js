// Trooth — optimized unified realtime messaging + notification bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothUnifiedRealtimeBooted)return;
    window.troothUnifiedRealtimeBooted=true;
    var userId=null,channel=null,timer=null,starting=false;
    function ping(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function clearChannel(){
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothUnifiedRealtimeChannel=null;
    }
    function scheduleRefresh(){
      clearTimeout(timer);
      timer=setTimeout(function(){
        if(!userId)return;
        var d={source:'realtime-bridge',userId:userId};
        ping('trooth-messages-refresh',d);
        ping('trooth-notifications-refresh',d);
        ping('trooth-navigation-refresh',d);
      },180);
    }
    async function getUser(){
      try{var r=await sb.auth.getUser();userId=r.data&&r.data.user?r.data.user.id:null;return userId}catch(e){userId=null;return null}
    }
    async function start(){
      if(starting)return;starting=true;
      try{
        var id=await getUser();
        clearChannel();
        if(!id)return;
        channel=sb.channel('trooth-unified-realtime-'+id)
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+id},function(e){ping('trooth-message-incoming',e.new);scheduleRefresh()})
          .on('postgres_changes',{event:'UPDATE',schema:'public',table:'messages',filter:'receiver_id=eq.'+id},function(e){ping('trooth-message-updated',e.new);scheduleRefresh()})
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+id},function(e){ping('trooth-notification-incoming',e.new);scheduleRefresh()})
          .subscribe(function(status){if(status==='SUBSCRIBED')scheduleRefresh()});
        window.troothUnifiedRealtimeChannel=channel;
      }finally{starting=false}
    }
    start();
    sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||!session){clearTimeout(timer);userId=null;clearChannel();return}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')setTimeout(start,60);
    });
    window.addEventListener('beforeunload',function(){clearTimeout(timer);clearChannel()});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
