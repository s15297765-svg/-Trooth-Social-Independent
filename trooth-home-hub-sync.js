// Trooth Social Independent — Unified Home Hub Sync
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||window.troothHomeHubSyncReady)return;
    window.troothHomeHubSyncReady=true;
    var tables=['news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    var channels=[];
    function refresh(){
      ['newsHub','sportsHub','storesHub','propertyHub'].forEach(function(id){var el=document.getElementById(id);if(el)el.setAttribute('data-live','true')});
      if(typeof window.loadPosts==='function')window.loadPosts();
    }
    function cleanup(){channels.forEach(function(ch){try{sb.removeChannel(ch)}catch(e){}});channels=[]}
    tables.forEach(function(table){
      var ch=sb.channel('trooth-home-hub-'+table+'-'+Date.now()).on('postgres_changes',{event:'*',schema:'public',table:table},function(){refresh();window.dispatchEvent(new CustomEvent('trooth-home-hub-refresh',{detail:{table:table}}))}).subscribe();
      channels.push(ch);
    });
    window.addEventListener('trooth-home-feed-refresh',refresh);
    sb.auth.onAuthStateChange(function(event){if(event==='SIGNED_OUT')cleanup();if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED')boot()});
    window.addEventListener('beforeunload',cleanup,{once:true});
    window.troothHomeHubRefresh=refresh;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
