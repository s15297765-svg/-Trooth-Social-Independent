// Trooth Social Independent — live online presence UI
(function(){
  function boot(){
    if(window.__troothPresenceUI)return;window.__troothPresenceUI=true;
    function getUsers(){return window.__troothOnlineUsers||{}}
    function isOnline(id){
      if(!id)return false;
      var s=getUsers();
      return !!(s[id]||Object.keys(s).some(function(k){var a=s[k]||[];return a.some(function(x){return x&&x.user_id===id})}));
    }
    function paint(){
      var els=document.querySelectorAll('[data-user-id],.online-status,[data-online-user]');
      els.forEach(function(el){
        var id=el.getAttribute('data-user-id')||el.getAttribute('data-online-user');
        if(!id)return;
        var on=isOnline(id);
        if(el.classList.contains('online-status')){
          el.textContent=on?'● Online':'○ Offline';
          el.classList.toggle('trooth-online',on);el.classList.toggle('trooth-offline',!on);
        }else{
          var dot=el.querySelector('.trooth-presence-dot');
          if(!dot){dot=document.createElement('span');dot.className='trooth-presence-dot';el.appendChild(dot)}
          dot.title=on?'Online':'Offline';dot.setAttribute('aria-label',on?'Online':'Offline');
        }
      });
    }
    var style=document.createElement('style');style.textContent='.trooth-presence-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-left:5px;background:#b7c3bb;box-shadow:0 0 0 2px #fff}.trooth-presence-dot.trooth-online{background:#2ecc71}.trooth-online{color:#2e9b5b!important}.trooth-offline{color:#718276!important}';document.head.appendChild(style);
    window.addEventListener('trooth-presence-sync',function(){setTimeout(paint,30)});
    window.addEventListener('trooth-presence-join',paint);window.addEventListener('trooth-presence-leave',paint);
    window.addEventListener('trooth-social-online-refresh',paint);
    window.addEventListener('trooth-friends-refresh',function(){setTimeout(paint,250)});
    setInterval(paint,10000);setTimeout(paint,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
