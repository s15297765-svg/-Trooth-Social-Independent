// Trooth Social Independent — News / Sports / Stores / Property live hub bridge v1
(function(){
  if(window.__troothLiveMarketHubsV1)return;window.__troothLiveMarketHubsV1=true;
  var config={
    'news.html':{table:'news_stories',title:'📰 News',refresh:'trooth-news-refresh'},
    'sports.html':{table:'sports_stories',title:'🏆 Sports',refresh:'trooth-sports-refresh'},
    'stores.html':{table:'store_listings',title:'🛍️ Stores',refresh:'trooth-stores-refresh'},
    'property.html':{table:'property_listings',title:'🏠 Property',refresh:'trooth-property-refresh'}
  };
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1800)}
  function boot(){
    var key=location.pathname.split('/').pop().toLowerCase(),cfg=config[key];
    if(!cfg||!window.troothSupabase)return;
    var last=0;
    function refresh(){
      var now=Date.now();if(now-last<900)return;last=now;
      var names={
        'news.html':['load','render'],
        'sports.html':['load','render'],
        'stores.html':['load','render'],
        'property.html':['load','render']
      }[key]||[];
      for(var i=0;i<names.length;i++){try{if(typeof window[names[i]]==='function'){window[names[i]]();return}}catch(e){}}
      document.dispatchEvent(new CustomEvent(cfg.refresh));
    }
    window.troothLiveHubRefresh=refresh;
    window.addEventListener('online',function(){toast('🟢 '+cfg.title+' live connection restored');refresh()});
    window.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});
    window.addEventListener('pageshow',refresh);
    window.setInterval(function(){if(!document.hidden)refresh()},60000);
    try{
      window.troothSupabase.channel('trooth-hub-'+key).on('postgres_changes',{event:'*',schema:'public',table:cfg.table},function(){toast('🔴 '+cfg.title+' میں نئی activity');refresh()}).subscribe();
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
