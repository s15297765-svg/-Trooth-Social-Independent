// Trooth Social Independent — mobile bottom navigation
(function(){
  function boot(){
    if(document.getElementById('trooth-mobile-nav')) return;
    var style=document.createElement('style');
    style.textContent='.trooth-mobile-nav{display:none}@media(max-width:650px){.trooth-mobile-nav{position:fixed;left:8px;right:8px;bottom:8px;z-index:9998;background:#fff;border:1px solid #d8e9de;border-radius:18px;box-shadow:0 8px 28px #245c3a2b;padding:7px;grid-template-columns:repeat(5,1fr);gap:4px}.trooth-mobile-nav a{color:#2d6a4f;text-decoration:none;text-align:center;font-size:11px;font-weight:800;padding:7px 3px;border-radius:12px}.trooth-mobile-nav a:hover,.trooth-mobile-nav a.active{background:#d8f3dc}.trooth-mobile-nav .ico{display:block;font-size:19px;line-height:20px;margin-bottom:2px}body{padding-bottom:78px}}';
    document.head.appendChild(style);
    var n=document.createElement('nav');n.id='trooth-mobile-nav';n.className='trooth-mobile-nav';n.setAttribute('aria-label','Mobile navigation');
    n.innerHTML='<a href="index.html" data-page="index.html"><span class="ico">🏠</span>Home</a><a href="friends.html" data-page="friends.html"><span class="ico">👥</span>Friends</a><a href="chat.html" data-page="chat.html"><span class="ico">💬</span>Messages</a><a href="notifications.html" data-page="notifications.html"><span class="ico">🔔</span>Alerts</a><a href="auth.html" data-page="auth.html"><span class="ico">👤</span>Profile</a>';
    document.body.appendChild(n);
    var page=location.pathname.split('/').pop()||'index.html';n.querySelectorAll('a').forEach(function(a){if(a.dataset.page===page)a.classList.add('active')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
