// Trooth Social Independent — resilient global realtime event bridge
(function(){
  function boot(){
    if(window.__troothGlobalRealtimeBooted)return;window.__troothGlobalRealtimeBooted=true;
    var sb=window.troothSupabase;if(!sb)return;
    var retry=null,connecting=false,online=navigator.onLine!==false;
    function signal(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function clear(){if(retry){clearTimeout(retry);retry=null}if(window.__troothGlobalChannel){try{sb.removeChannel(window.__troothGlobalChannel)}catch(e){}window.__troothGlobalChannel=null}}
    function schedule(ms){if(!online||retry)return;retry=setTimeout(function(){retry=null;connect()},ms||2000)}
    function connect(){
      if(!online||connecting||!sb.auth)return;connecting=true;
      sb.auth.getUser().then(function(r){
        var u=r.data&&r.data.user;if(!u){connecting=false;clear();signal('trooth-realtime-status',{status:'SIGNED_OUT'});return}
        clear();signal('trooth-realtime-status',{status:'CONNECTING'});
        try{
          var c=sb.channel('trooth-global-'+u.id)
            .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+u.id},function(p){signal('trooth-notification-incoming',p.new);signal('trooth-notifications-refresh',p.new)})
            .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},function(p){signal('trooth-message-incoming',p.new);signal('trooth-messages-refresh',p.new)})
            .on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){signal('trooth-feed-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){signal('trooth-friends-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){signal('trooth-friends-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'profiles'},function(p){signal('trooth-profile-social-refresh',p)})
            .subscribe(function(status){connecting=false;signal('trooth-realtime-status',{status:status});if(status==='SUBSCRIBED'){signal('trooth-realtime-connected');}else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){schedule(3000)}});
          window.__troothGlobalChannel=c;
        }catch(e){connecting=false;schedule(4000)}
      }).catch(function(){connecting=false;schedule(5000)});
    }
    connect();
    window.addEventListener('online',function(){online=true;signal('trooth-realtime-status',{status:'RECONNECTING'});clear();setTimeout(connect,500)});
    window.addEventListener('offline',function(){online=false;clear();signal('trooth-realtime-status',{status:'OFFLINE'})});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online)setTimeout(connect,400)});
    window.addEventListener('trooth-realtime-reconnect',function(){clear();connect()});
    window.addEventListener('trooth-auth-changed',function(){clear();setTimeout(connect,300)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2200)},{once:true});else setTimeout(boot,2200);
})();
