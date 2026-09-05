// Trooth Social Independent — Unified Home Hub Sync
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||window.troothHomeHubSyncReady)return;
    window.troothHomeHubSyncReady=true;
    var tables=['news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    var channels=[],refreshTimer=null;
    function refresh(){
      if(refreshTimer)clearTimeout(refreshTimer);
      refreshTimer=setTimeout(function(){
        ['newsHub','sportsHub','storesHub','propertyHub'].forEach(function(id){var el=document.getElementById(id);if(el)el.setAttribute('data-live','true')});
        if(typeof window.loadPosts==='function')window.loadPosts();
        window.dispatchEvent(new CustomEvent('trooth-home-hub-refresh',{detail:{source:'section-sync'}}));
      },250);
    }
    function cleanup(){channels.forEach(function(ch){try{sb.removeChannel(ch)}catch(e){}});channels=[];if(refreshTimer)clearTimeout(refreshTimer);refreshTimer=null}
    tables.forEach(function(table){
      var ch=sb.channel('trooth-home-hub-'+table+'-'+Date.now()).on('postgres_changes',{event:'*',schema:'public',table:table},function(e){refresh();window.dispatchEvent(new CustomEvent('trooth-home-section-live',{detail:{table:table,event:e&&e.eventType||'change'}}))}).subscribe();
      channels.push(ch);
    });
    window.addEventListener('trooth-home-feed-refresh',refresh);
    sb.auth.onAuthStateChange(function(event){if(event==='SIGNED_OUT'){cleanup();window.troothHomeHubSyncReady=false}if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'){cleanup();window.troothHomeHubSyncReady=false;setTimeout(boot,0)}});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')refresh()});
    window.addEventListener('focus',refresh);
    window.addEventListener('beforeunload',cleanup,{once:true});
    window.troothHomeHubRefresh=refresh;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
