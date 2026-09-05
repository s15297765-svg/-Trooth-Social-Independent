// Trooth Social Independent — global auth/session live bridge
(function(){
  function boot(){
    if(window.__troothAuthSessionLive)return;window.__troothAuthSessionLive=true;
    var sb=window.troothSupabase;if(!sb||!sb.auth)return;
    var timer=null,refreshing=false;
    function refresh(){
      window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-profile-refresh'));
    }
    function syncSession(reason){
      if(refreshing)return;refreshing=true;
      sb.auth.getSession().then(function(r){
        var s=r.data&&r.data.session||null;
        window.__troothSession=s;
        window.dispatchEvent(new CustomEvent('trooth-auth-session-sync',{detail:{reason:reason,session:s}}));
        if(s)window.dispatchEvent(new CustomEvent('trooth-auth-changed',{detail:{event:'SESSION_SYNC',session:s}}));
      }).catch(function(){}).then(function(){refreshing=false});
    }
    sb.auth.onAuthStateChange(function(event,session){
      window.__troothSession=session||null;
      window.dispatchEvent(new CustomEvent('trooth-auth-changed',{detail:{event:event,session:session||null}}));
      if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='TOKEN_REFRESHED')setTimeout(function(){refresh();syncSession(event)},250);
    });
    syncSession('boot');
    window.addEventListener('online',function(){clearTimeout(timer);timer=setTimeout(function(){syncSession('online');refresh()},300)});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){clearTimeout(timer);timer=setTimeout(function(){syncSession('visibility');refresh()},400)}});
    window.addEventListener('pageshow',function(){syncSession('pageshow')});
    setInterval(function(){if(navigator.onLine&&document.visibilityState!=='hidden')syncSession('heartbeat')},120000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2500)},{once:true});else setTimeout(boot,2500);
})();
