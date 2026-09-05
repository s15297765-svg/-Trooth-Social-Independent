// Trooth Social Independent — global auth/session live bridge
(function(){
  function boot(){
    if(window.__troothAuthSessionLive)return;window.__troothAuthSessionLive=true;
    var sb=window.troothSupabase;if(!sb||!sb.auth)return;
    function refresh(){
      window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-profile-refresh'));
    }
    sb.auth.onAuthStateChange(function(event,session){
      window.__troothSession=session||null;
      window.dispatchEvent(new CustomEvent('trooth-auth-changed',{detail:{event:event,session:session||null}}));
      if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='TOKEN_REFRESHED')setTimeout(refresh,250);
    });
    sb.auth.getSession().then(function(r){window.__troothSession=r.data&&r.data.session||null;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2500)},{once:true});else setTimeout(boot,2500);
})();
