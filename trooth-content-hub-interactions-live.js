// Trooth — live interactions for News / Sports / Stores / Property / Film-Fashion hubs
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var tables=['news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    function refresh(table){window.dispatchEvent(new CustomEvent('trooth-content-hub-interaction-refresh',{detail:{table:table}}));}
    tables.forEach(function(table){
      sb.channel('trooth-hub-interactions-'+table)
        .on('postgres_changes',{event:'*',schema:'public',table:table},function(e){refresh(table);})
        .subscribe();
    });
    window.troothHubRefresh=function(table){if(table)refresh(table);else tables.forEach(refresh);};
    window.dispatchEvent(new CustomEvent('trooth-content-hub-interactions-ready'));
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
