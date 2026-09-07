// Trooth Dream Home v1 — visual dashboard layer, safe to run after the existing home modules.
(function(){
  if(window.__troothDreamHomeV1)return;
  window.__troothDreamHomeV1=true;
  function addCss(){if(!document.querySelector('link[data-trooth-dream]')){var l=document.createElement('link');l.rel='stylesheet';l.dataset.troothDream='1';l.href='trooth-dream-home-v1.css?v=1';document.head.appendChild(l)}}
  function nav(){if(document.querySelector('.dream-mobile-nav'))return;var n=document.createElement('nav');n.className='dream-mobile-nav';n.setAttribute('aria-label','Mobile navigation');n.innerHTML='<a class="active" href="index.html"><b>⌂</b>Home</a><a href="friends.html"><b>👥</b>Friends</a><a href="notifications-messages.html"><b>💬</b>Chat</a><a href="stores.html"><b>🛍️</b>Shop</a><a href="auth.html"><b>👤</b>Profile</a>';document.body.appendChild(n)}
  function pills(){var hero=document.querySelector('.hero');if(!hero||hero.querySelector('.dream-pills'))return;var d=document.createElement('div');d.className='dream-pills';d.innerHTML='<a class="dream-pill" href="news.html">📰 News</a><a class="dream-pill" href="sports.html">🏆 Sports</a><a class="dream-pill" href="business.html">💼 Business</a><a class="dream-pill" href="stores.html">🛍️ Shopping</a><a class="dream-pill" href="property.html">🏠 Property</a><a class="dream-pill" href="film-fashion.html">🎬 Film & Fashion</a>';hero.appendChild(d)}
  function boot(){addCss();nav();pills();document.body.classList.add('trooth-dream-home-active')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
