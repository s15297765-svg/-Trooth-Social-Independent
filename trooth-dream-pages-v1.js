// Trooth Dream Pages v1 — shared light-green polish + mobile navigation for social pages.
(function(){
  if(window.__troothDreamPagesV1)return;
  window.__troothDreamPagesV1=true;
  var css=document.createElement('link');css.rel='stylesheet';css.href='trooth-dream-pages-v1.css?v=1';document.head.appendChild(css);
  function addNav(){
    if(window.innerWidth>650||document.querySelector('.dream-mobile-nav'))return;
    var n=document.createElement('nav');n.className='dream-mobile-nav';
    n.innerHTML='<a class="active" href="index.html"><b>⌂</b>Home</a><a href="friends.html"><b>👥</b>Friends</a><a href="notifications-messages.html"><b>💬</b>Messages</a><a href="notifications-messages.html"><b>🔔</b>Alerts</a><a href="auth.html"><b>👤</b>Profile</a>';
    document.body.appendChild(n);
  }
  window.addEventListener('load',addNav);window.addEventListener('resize',addNav);
})();
