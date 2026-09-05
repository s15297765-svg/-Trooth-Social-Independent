// Trooth Social Independent — resilient global realtime event bridge
(function(){
  function boot(){
    if(window.__troothGlobalRealtimeBooted)return;window.__troothGlobalRealtimeBooted=true;
    var sb=window.troothSupabase;if(!sb)return;
    var retry=null,connecting=false,online=navigator.onLine!==false,attempt=0;
    function signal(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function clear(){if(retry){clearTimeout(retry);retry=null}if(window.__troothGlobalChannel){try{sb.removeChannel(window.__troothGlobalChannel)}catch(e){}window.__troothGlobalChannel=null}}
    function schedule(){if(!online||retry)return;attempt=Math.min(attempt+1,6);var ms=Math.min(30000,1500*Math.pow(2,attempt-1));signal('trooth-realtime-status',{status:'RETRYING',delay:ms,attempt:attempt});retry=setTimeout(function(){retry=null;connect()},ms)}
    function connect(){
      if(!online||connecting||!sb.auth)return;connecting=true;
      sb.auth.getUser().then(function(r){
        var u=r.data&&r.data.user;if(!u){connecting=false;clear();attempt=0;signal('trooth-realtime-status',{status:'SIGNED_OUT'});return}
        clear();signal('trooth-realtime-status',{status:'CONNECTING'});
        try{
          var c=sb.channel('trooth-global-'+u.id)
            .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+u.id},function(p){signal('trooth-notification-incoming',p.new);signal('trooth-notifications-refresh',p.new)})
            .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},function(p){signal('trooth-message-incoming',p.new);signal('trooth-messages-refresh',p.new)})
            .on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){signal('trooth-feed-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},function(p){signal('trooth-feed-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){signal('trooth-friends-refresh',p);signal('trooth-profile-social-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){signal('trooth-friends-refresh',p);signal('trooth-profile-social-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'profiles'},function(p){signal('trooth-profile-social-refresh',p)})
            .subscribe(function(status){
              connecting=false;signal('trooth-realtime-status',{status:status});
              if(status==='SUBSCRIBED'){attempt=0;signal('trooth-realtime-connected')}
              else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED')schedule();
            });
          window.__troothGlobalChannel=c;
        }catch(e){connecting=false;schedule()}
      }).catch(function(){connecting=false;schedule()});
    }
    connect();
    window.addEventListener('online',function(){online=true;attempt=0;signal('trooth-realtime-status',{status:'RECONNECTING'});clear();setTimeout(connect,400)});
    window.addEventListener('offline',function(){online=false;clear();signal('trooth-realtime-status',{status:'OFFLINE'})});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online){clear();setTimeout(connect,500)}});
    window.addEventListener('trooth-realtime-reconnect',function(){attempt=0;clear();connect()});
    window.addEventListener('trooth-auth-changed',function(){attempt=0;clear();setTimeout(connect,300)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2200)},{once:true});else setTimeout(boot,2200);
})();
