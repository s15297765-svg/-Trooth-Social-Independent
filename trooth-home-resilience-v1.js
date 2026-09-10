// Trooth Home Resilience v2 — never leave Home hubs/feed stuck on Loading.
(function(){
  if(window.__troothHomeResilienceV2)return;
  window.__troothHomeResilienceV2=true;
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
  }
  window.addEventListener('trooth-supabase-error',function(){setTimeout(recover,250);});
  window.setTimeout(recover,8000);
})();
