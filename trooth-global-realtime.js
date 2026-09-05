// Trooth Social Independent — resilient global realtime event bridge
(function(){
  function boot(){
    if(window.__troothGlobalRealtimeBooted)return;window.__troothGlobalRealtimeBooted=true;
    var sb=window.troothSupabase;if(!sb)return;
    var retry=null;
    function signal(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function connect(){
      sb.auth.getUser().then(function(r){
        var u=r.data&&r.data.user;if(!u)return;
        try{if(window.__troothGlobalChannel)sb.removeChannel(window.__troothGlobalChannel)}catch(e){}
        signal('trooth-realtime-status',{status:'CONNECTING'});
        var c=sb.channel('trooth-global-'+u.id)
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+u.id},function(p){signal('trooth-notification-incoming',p.new);signal('trooth-notifications-refresh',p.new)})
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},function(p){signal('trooth-message-incoming',p.new);signal('trooth-messages-refresh',p.new)})
          .on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){signal('trooth-feed-refresh',p)})
          .subscribe(function(status){signal('trooth-realtime-status',{status:status});if(status==='SUBSCRIBED'){signal('trooth-realtime-connected');if(retry){clearTimeout(retry);retry=null}}else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){if(!retry)retry=setTimeout(function(){retry=null;connect()},4000)}});
        window.__troothGlobalChannel=c;
      }).catch(function(){if(!retry)retry=setTimeout(function(){retry=null;connect()},5000)});
    }
    connect();
    window.addEventListener('online',function(){setTimeout(connect,700)});
    document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(connect,500)});
    window.addEventListener('trooth-realtime-reconnect',function(){connect()});
    window.addEventListener('trooth-auth-changed',function(){setTimeout(connect,300)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2200)},{once:true});else setTimeout(boot,2200);
})();
