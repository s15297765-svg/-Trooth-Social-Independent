// Trooth Social Independent — Home News/Sports/Marketplace/Property live hub v1
(function(){
  if(window.__troothHomeHubLiveV1)return;window.__troothHomeHubLiveV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var map={news_stories:'newsHub',sports_stories:'sportsHub',store_listings:'storesHub',properties:'propertyHub'};
    var channels=[],timer=null,stopped=false;
    function refresh(table){
      if(stopped)return;clearTimeout(timer);timer=setTimeout(function(){
        var id=map[table];
        if(id&&typeof window.loadHub==='function')window.loadHub(table,id);
        window.dispatchEvent(new CustomEvent('trooth-home-hub-live-refresh',{detail:{table:table}}));
      },180);
    }
    Object.keys(map).forEach(function(table){
      var ch=sb.channel('trooth-home-hub-live-v1-'+table).on('postgres_changes',{event:'*',schema:'public',table:table},function(){refresh(table)}).subscribe();
      channels.push(ch);
    });
    function cleanup(){stopped=true;clearTimeout(timer);channels.forEach(function(ch){try{sb.removeChannel(ch)}catch(e){}});channels=[]}
    window.addEventListener('beforeunload',cleanup,{once:true});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')Object.keys(map).forEach(refresh)});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
