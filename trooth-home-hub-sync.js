// Trooth Social Independent — Unified Home Hub Sync v2
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||window.troothHomeHubSyncReady)return;
    window.troothHomeHubSyncReady=true;
    var tables=['news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    var channels=[],refreshTimer=null,started=true;
    function refresh(reason){
      if(!started)return;
      if(refreshTimer)clearTimeout(refreshTimer);
      refreshTimer=setTimeout(function(){
        refreshTimer=null;if(!started)return;
        ['newsHub','sportsHub','storesHub','propertyHub'].forEach(function(id){var el=document.getElementById(id);if(el)el.setAttribute('data-live','true')});
        if(typeof window.loadPosts==='function')window.loadPosts();
        window.dispatchEvent(new CustomEvent('trooth-home-hub-refresh',{detail:{source:'section-sync',reason:reason||'live'}}));
      },250);
    }
    function cleanup(){
      started=false;
      channels.forEach(function(ch){try{sb.removeChannel(ch)}catch(e){}});channels=[];
      if(refreshTimer)clearTimeout(refreshTimer);refreshTimer=null;
    }
    tables.forEach(function(table){
      var ch=sb.channel('trooth-home-hub-'+table+'-'+Date.now()).on('postgres_changes',{event:'*',schema:'public',table:table},function(e){
        refresh(table);
        window.dispatchEvent(new CustomEvent('trooth-home-section-live',{detail:{table:table,event:e&&e.eventType||'change',source:'home-hub-sync'}}));
      }).subscribe();
      channels.push(ch);
    });
    window.addEventListener('trooth-home-feed-refresh',function(){refresh('feed')});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')refresh('visible')});
    window.addEventListener('focus',function(){refresh('focus')});
    window.addEventListener('beforeunload',cleanup,{once:true});
    sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||!session){cleanup();window.troothHomeHubSyncReady=false;return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        cleanup();window.troothHomeHubSyncReady=false;setTimeout(boot,80);
      }
    });
    window.troothHomeHubRefresh=refresh;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
