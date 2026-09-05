// Trooth — unified realtime bridge for Groups + Business + News + Sports + Stores + Property + Film/Fashion
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    if(window.troothContentHubsRealtime)return;
    var tables=['groups','group_members','group_announcements','group_join_requests','businesses','business_posts','news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    var names={groups:'trooth-groups-refresh',group_members:'trooth-groups-refresh',group_announcements:'trooth-groups-refresh',group_join_requests:'trooth-groups-refresh',businesses:'trooth-business-refresh',business_posts:'trooth-business-refresh',news_stories:'trooth-news-refresh',sports_stories:'trooth-sports-refresh',store_listings:'trooth-stores-refresh',properties:'trooth-property-refresh',film_fashion_stories:'trooth-film-fashion-refresh'};
    var timer=null;
    function refresh(table,event){
      clearTimeout(timer);timer=setTimeout(function(){
        var detail={table:table,event:event,source:'content-hubs-realtime'};
        var name=names[table];
        if(name)window.dispatchEvent(new CustomEvent(name,{detail:detail}));
        window.dispatchEvent(new CustomEvent('trooth-content-hubs-refresh',{detail:detail}));
        window.dispatchEvent(new CustomEvent('trooth-navigation-refresh',{detail:detail}));
      },120);
    }
    function subscribe(){
      var ch=sb.channel('trooth-content-hubs-realtime-'+Date.now());
      tables.forEach(function(table){ch.on('postgres_changes',{event:'*',schema:'public',table:table},function(e){refresh(table,e.eventType)})});
      ch.subscribe(function(status){
        if(status==='SUBSCRIBED'){
          window.troothContentHubsRealtime=ch;
          window.dispatchEvent(new CustomEvent('trooth-content-hubs-ready'));
        }
      });
      return ch;
    }
    var ch=subscribe();
    sb.auth.onAuthStateChange(function(){
      if(window.troothContentHubsRealtime===ch){try{sb.removeChannel(ch)}catch(e){}window.troothContentHubsRealtime=null;setTimeout(boot,50)}
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
