// Trooth — live interaction bridge for News / Sports / Stores / Property / Film-Fashion
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
    var pending={};

    function refresh(table,source){
      if(!table||!events[table])return;
      // The unified bridge emits both a table event and a unified event.
      // Coalesce them so one database change causes one UI refresh.
      clearTimeout(pending[table]);
      pending[table]=setTimeout(function(){
        pending[table]=null;
        window.dispatchEvent(new CustomEvent('trooth-content-hub-interaction-refresh',{
          detail:{table:table,source:source||'interaction-bridge'}
        }));
      },80);
    }

    tables.forEach(function(table){
      var eventName=events[table];
      if(!eventName)return;
      window.addEventListener(eventName,function(){
        refresh(table,'content-hubs-realtime');
      });
    });

    window.addEventListener('trooth-content-hubs-refresh',function(e){
      var table=e&&e.detail&&e.detail.table;
      if(table&&events[table])refresh(table,'content-hubs-unified');
    });

    window.troothHubRefresh=function(table){
      if(table&&events[table])refresh(table,'manual');
      else tables.forEach(function(t){refresh(t,'manual');});
    };

    window.addEventListener('beforeunload',function(){
      tables.forEach(function(t){clearTimeout(pending[t]);pending[t]=null;});
    },{once:true});

    window.dispatchEvent(new CustomEvent('trooth-content-hub-interactions-ready'));
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
