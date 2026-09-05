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
        var name=names[table];
        if(name)window.dispatchEvent(new CustomEvent(name,{detail:{table:table,event:event,source:'content-hubs-realtime'}}));
        window.dispatchEvent(new CustomEvent('trooth-content-hubs-refresh',{detail:{table:table,event:event,source:'content-hubs-realtime'}}));
      },120);
    }
    var ch=sb.channel('trooth-content-hubs-realtime');
    tables.forEach(function(table){ch.on('postgres_changes',{event:'*',schema:'public',table:table},function(e){refresh(table,e.eventType)})});
    ch.subscribe(function(status){
      if(status==='SUBSCRIBED')window.dispatchEvent(new CustomEvent('trooth-content-hubs-ready'));
    });
    window.troothContentHubsRealtime=ch;
    sb.auth.onAuthStateChange(function(){
      if(window.troothContentHubsRealtime===ch){try{sb.removeChannel(ch)}catch(e){}window.troothContentHubsRealtime=null;setTimeout(boot,0)}
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
