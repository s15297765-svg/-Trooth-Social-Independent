/* Trooth Social Independent — optimized Group Admin Live Sync */
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||!sb.channel||window.troothGroupsAdminLiveReady)return;
    var path=(location.pathname||'').split('/').pop();
    if(path!=='group-admin.html')return;
    var id=new URLSearchParams(location.search).get('id');
    if(!id)return;
    window.troothGroupsAdminLiveReady=true;
    var timer=null,reconnectTimer=null,channel=null,authSub=null,stopped=false;
    function clearTimers(){clearTimeout(timer);timer=null;clearTimeout(reconnectTimer);reconnectTimer=null;}
    function cleanup(){
      clearTimers();
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothGroupsAdminLiveChannel=null;
    }
    function refresh(){
      if(stopped)return;
      clearTimeout(timer);
      timer=setTimeout(function(){
        timer=null;if(stopped)return;
        window.dispatchEvent(new CustomEvent('trooth-group-admin-refresh',{detail:{groupId:id,source:'group-admin-live'}}));
        if(typeof window.loadGroupAdmin==='function')window.loadGroupAdmin();
        else if(typeof window.load==='function')window.load();
      },220);
    }
    function subscribe(){
      if(stopped)return;
      cleanup();
      channel=sb.channel('trooth-group-admin-live-'+id+'-'+Date.now())
        .on('postgres_changes',{event:'*',schema:'public',table:'groups',filter:'id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'group_announcements',filter:'group_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'group_join_requests',filter:'group_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'group_members',filter:'group_id=eq.'+id},refresh)
        .subscribe(function(status){
          if(status==='SUBSCRIBED')refresh();
          if((status==='CHANNEL_ERROR'||status==='TIMED_OUT')&&!stopped){
            clearTimeout(reconnectTimer);reconnectTimer=setTimeout(subscribe,700);
          }
        });
      window.troothGroupsAdminLiveChannel=channel;
    }
    function connect(){
      if(stopped)return;
      sb.auth.getUser().then(function(r){
        if(stopped)return;
        if(r.data&&r.data.user)subscribe();else cleanup();
      }).catch(function(){
        if(!stopped){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(connect,1000);}
      });
    }
    function stop(){stopped=true;cleanup();}
    function resume(){stopped=false;connect();}
    authSub=sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||event==='USER_DELETED'||!session){stop();return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')resume();
    });
    connect();
    window.addEventListener('beforeunload',function(){
      stop();
      try{if(authSub&&authSub.data&&authSub.data.subscription)authSub.data.subscription.unsubscribe();}catch(e){}
    },{once:true});
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
