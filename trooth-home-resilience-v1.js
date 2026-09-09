// Trooth Home Resilience v1 — prevents permanent loading states on the home surface.
(function(){
  if(window.__troothHomeResilienceV1)return;
  window.__troothHomeResilienceV1=true;
  var settled=false;
  function setFallback(id,text){
    var el=document.getElementById(id);
    if(!el)return;
    var s=(el.textContent||'').trim().toLowerCase();
    if(s==='loading...'||s.indexOf('loading your trooth feed')===0) el.innerHTML='<div class="hubitem">'+text+'</div>';
  }
  function recover(){
    if(window.troothSupabase){settled=true;return;}
    setFallback('feed','Trooth is reconnecting. Please refresh in a moment.');
    setFallback('newsHub','News is temporarily unavailable.');
    setFallback('sportsHub','Sports is temporarily unavailable.');
    setFallback('storesHub','Marketplace is temporarily unavailable.');
    setFallback('propertyHub','Property is temporarily unavailable.');
  }
  function clearLoadingIfReady(){if(window.troothSupabase){settled=true;return true;}return false;}
  window.addEventListener('trooth-supabase-ready',clearLoadingIfReady);
  window.addEventListener('trooth-supabase-client-ready',clearLoadingIfReady);
  window.addEventListener('trooth-supabase-error',function(){setTimeout(recover,250);});
  window.setTimeout(function(){if(!settled)recover();},7000);
})();
