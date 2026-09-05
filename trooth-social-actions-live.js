// Trooth Social Independent — realtime social actions/counts
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothSocialActionsLiveBooted)return;
    window.troothSocialActionsLiveBooted=true;
    var ch=null,authSub=null,refreshTimer=null,reconnectTimer=null,stopped=false;
    function clearTimers(){clearTimeout(refreshTimer);refreshTimer=null;clearTimeout(reconnectTimer);reconnectTimer=null;}
    function clearChannel(){clearTimers();if(ch){try{sb.removeChannel(ch);}catch(e){}ch=null;}window.troothSocialActionsChannel=null;}
    function refresh(){
      if(stopped)return;
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(function(){
        refreshTimer=null;if(stopped)return;
        ['trooth-social-refresh','trooth-profile-social-refresh'].forEach(function(e){window.dispatchEvent(new CustomEvent(e));});
      },150);
    }
    function subscribe(uid){
      if(stopped||!uid)return;
      clearChannel();
      ch=sb.channel('trooth-social-actions-live-'+uid+'-'+Date.now())
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+uid},refresh)
        .subscribe(function(status){
          if((status==='CHANNEL_ERROR'||status==='TIMED_OUT')&&!stopped){
            clearTimeout(reconnectTimer);
            reconnectTimer=setTimeout(function(){connect();},700);
          }
        });
      window.troothSocialActionsChannel=ch;
    }
    function connect(){
      if(stopped)return;
      sb.auth.getUser().then(function(r){
        if(stopped)return;
        var uid=r.data&&r.data.user&&r.data.user.id;
        if(!uid){clearChannel();return;}
        subscribe(uid);
      }).catch(function(){if(!stopped){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(connect,1000);}});
    }
    function stop(){stopped=true;clearChannel();}
    function resume(){stopped=false;connect();}
    authSub=sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||event==='USER_DELETED'){stop();return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')resume();
    });
    connect();
    window.addEventListener('trooth-social-actions-stop',stop);
    window.addEventListener('trooth-social-actions-start',resume);
    window.addEventListener('beforeunload',function(){
      stop();
      try{if(authSub&&authSub.data&&authSub.data.subscription)authSub.data.subscription.unsubscribe();}catch(e){}
    },{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();