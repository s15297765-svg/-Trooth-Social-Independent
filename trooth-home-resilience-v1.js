// Trooth Home Resilience v1 — prevents permanent loading states on the home surface.
(function(){
  if(window.__troothHomeResilienceV1)return;
  window.__troothHomeResilienceV1=true;
  function setFallback(id,text){
    var el=document.getElementById(id);
    if(!el)return;
    var s=(el.textContent||'').trim().toLowerCase();
    if(s==='loading...'||s.indexOf('loading your trooth feed')===0){
      el.innerHTML='<div class="hubitem">'+text+'</div>';
    }
  }
  function recover(){
    setFallback('feed','No posts yet — be the first to share on Trooth.');
    setFallback('newsHub','No news stories yet.');
    setFallback('sportsHub','No sports stories yet.');
    setFallback('storesHub','No marketplace listings yet.');
    setFallback('propertyHub','No property listings yet.');
  }
  window.setTimeout(recover,12000);
  window.addEventListener('trooth-supabase-error',function(){
    setTimeout(function(){
      setFallback('feed','Trooth is reconnecting. Please refresh in a moment.');
      setFallback('newsHub','News is temporarily unavailable.');
      setFallback('sportsHub','Sports is temporarily unavailable.');
      setFallback('storesHub','Marketplace is temporarily unavailable.');
      setFallback('propertyHub','Property is temporarily unavailable.');
    },500);
  });
})();
