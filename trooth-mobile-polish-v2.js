/* Trooth Social Independent — mobile polish v2 */
(function(){
  function boot(){
    if(document.getElementById('trooth-mobile-polish-v2'))return;
    var style=document.createElement('style');style.id='trooth-mobile-polish-v2';style.textContent=`
      @media(max-width:650px){
        body{padding-bottom:64px}.top{position:sticky;top:0}.icons{gap:4px}.circle{width:36px;height:36px;font-size:16px}
        .layout{padding:8px}.menu{scrollbar-width:none;box-shadow:0 2px 10px #245c3a18}.menu::-webkit-scrollbar{display:none}
        .nav{padding:9px 10px}.card{border-radius:14px;margin-bottom:11px}.stories{scroll-snap-type:x mandatory}.story,.story-add{scroll-snap-align:start;min-width:108px;height:154px}
        .postactions{position:sticky;bottom:8px;background:#fff;padding:7px;border-radius:12px;box-shadow:0 3px 14px #245c3a18;z-index:4}.action{font-size:12px;padding:10px 5px}
        .hubgrid,.grid{gap:9px}.hubitem,.tile{padding:12px}.hero{padding:14px}.hero h1{font-size:20px}
        .trooth-bottom-nav{position:fixed;left:8px;right:8px;bottom:8px;height:52px;background:#fff;border:1px solid #d8eee0;border-radius:16px;display:flex;align-items:center;justify-content:space-around;box-shadow:0 5px 22px #245c3a25;z-index:50}
        .trooth-bottom-nav a{font-size:20px;text-align:center;padding:5px 9px}.trooth-bottom-nav small{display:block;font-size:9px;color:#718276}
      }
      @media(min-width:651px){.trooth-bottom-nav{display:none}}
      .trooth-focus{outline:3px solid #74c69d;outline-offset:2px;transition:outline .2s}
    `;document.head.appendChild(style);
    if(window.matchMedia('(max-width:650px)').matches){
      var nav=document.createElement('nav');nav.className='trooth-bottom-nav';nav.innerHTML='<a href="index.html">🏠<small>Home</small></a><a href="friends.html">👥<small>People</small></a><a href="notifications.html">🔔<small>Alerts</small></a><a href="chat.html">💬<small>Chat</small></a><a href="auth.html">👤<small>Profile</small></a>';document.body.appendChild(nav);
    }
    window.addEventListener('trooth-post-deeplink-ready',function(){var p=document.querySelector('.trooth-focus');if(p)p.scrollIntoView({behavior:'smooth',block:'center'});});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
