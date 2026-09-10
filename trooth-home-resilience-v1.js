// Trooth Home Resilience v3 — never leave Home hubs/feed stuck on Loading.
(function(){
  if(window.__troothHomeResilienceV3)return;
  window.__troothHomeResilienceV3=true;
  function fallback(id,html){
    var el=document.getElementById(id);
    if(!el)return;
    var s=(el.textContent||'').trim().toLowerCase();
    if(s==='loading...'||s.indexOf('loading your trooth feed')===0||s==='') el.innerHTML=html;
  }
  function recover(){
    fallback('feed','<div class="card empty">Trooth feed is ready. Login to publish and see your posts. 👋<br><a class="tag" href="auth.html" style="margin-top:10px">Profile / Login</a></div>');
    fallback('newsHub','<a class="hubitem" href="news.html"><span class="tag">NEWS</span><h3>📰 National & International</h3><p>Open the live News Center to read and publish stories.</p></a>');
    fallback('sportsHub','<a class="hubitem" href="sports.html"><span class="tag">SPORTS</span><h3>🏆 Sports News</h3><p>Open Trooth Sports for sports stories and updates.</p></a>');
    fallback('storesHub','<a class="hubitem" href="stores.html"><span class="tag">MARKETPLACE</span><h3>🛍️ Global Stores</h3><p>Explore the Trooth marketplace and international shopping space.</p></a>');
    fallback('propertyHub','<a class="hubitem" href="property.html"><span class="tag">PROPERTY</span><h3>🏠 Land & Houses</h3><p>Explore property listings for buying and selling.</p></a>');
    fallback('businessHub','<a class="hubitem" href="business.html"><span class="tag">BUSINESS</span><h3>💼 Trooth Business Network</h3><p>Create and discover business profiles and opportunities.</p></a>');
    fallback('filmFashionHub','<a class="hubitem" href="film-fashion.html"><span class="tag">STORY SPACE</span><h3>🎬 Film & Fashion</h3><p>One shared story space for film, fashion and trends.</p></a>');
    fallback('groupsHub','<a class="hubitem" href="groups.html"><span class="tag">COMMUNITY</span><h3>👨‍👩‍👧 Trooth Groups</h3><p>Create, discover and join Trooth communities.</p></a>');
  }
  window.addEventListener('trooth-supabase-error',function(){setTimeout(recover,250);});
  window.setTimeout(recover,8000);
})();
