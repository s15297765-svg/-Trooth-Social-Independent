// Trooth — live interaction bridge for News / Sports / Stores / Property / Film-Fashion hubs
(function(){
  function boot(){
    if(window.troothContentHubInteractionsLive)return;
    window.troothContentHubInteractionsLive=true;

    var tables=['news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    var events={
      news_stories:'trooth-news-refresh',
      sports_stories:'trooth-sports-refresh',
      store_listings:'trooth-stores-refresh',
      properties:'trooth-property-refresh',
      film_fashion_stories:'trooth-film-fashion-refresh'
    };

    function refresh(table,source){
      window.dispatchEvent(new CustomEvent('trooth-content-hub-interaction-refresh',{
        detail:{table:table,source:source||'interaction-bridge'}
      }));
    }

    // Use the unified realtime bridge instead of opening duplicate
    // Postgres Changes channels for every content table.
    tables.forEach(function(table){
      var eventName=events[table];
      if(!eventName)return;
      window.addEventListener(eventName,function(e){
        refresh(table,'content-hubs-realtime');
      });
    });

    // Also accept the unified refresh event as a safety net/manual bridge.
    window.addEventListener('trooth-content-hubs-refresh',function(e){
      var table=e&&e.detail&&e.detail.table;
      if(table&&events[table])refresh(table,'content-hubs-unified');
    });

    window.troothHubRefresh=function(table){
      if(table&&events[table])refresh(table,'manual');
      else tables.forEach(function(t){refresh(t,'manual');});
    };

    window.dispatchEvent(new CustomEvent('trooth-content-hub-interactions-ready'));
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
