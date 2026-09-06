// Trooth Social Independent — Live hub status indicator v1
(function(){
  if(window.__troothHomeHubStatusV1)return;window.__troothHomeHubStatusV1=true;
  function boot(){
    if(!window.troothSupabase)return;
    var map={news_stories:'newsHub',sports_stories:'sportsHub',store_listings:'storesHub',properties:'propertyHub'};
    Object.keys(map).forEach(function(table){
      var el=document.getElementById(map[table]);if(!el||el.parentElement.querySelector('[data-trooth-live-status="'+table+'"]'))return;
      var s=document.createElement('span');s.dataset.troothLiveStatus=table;s.textContent=' • LIVE';s.title='Realtime updates enabled';s.style.cssText='font-size:11px;font-weight:800;color:#2d6a4f;margin-left:6px';
      var h=el.parentElement.querySelector('h2');if(h)h.appendChild(s);
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
