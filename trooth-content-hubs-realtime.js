// Trooth — unified realtime bridge for Groups + Business + News + Sports + Stores + Property + Film/Fashion
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||!sb.channel||!sb.auth)return;
    if(window.troothContentHubsRealtime)return;
    var tables=['groups','group_members','group_announcements','group_join_requests','businesses','business_posts','news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    var names={groups:'trooth-groups-refresh',group_members:'trooth-groups-refresh',group_announcements:'trooth-groups-refresh',group_join_requests:'trooth-groups-refresh',businesses:'trooth-business-refresh',business_posts:'trooth-business-refresh',news_stories:'trooth-news-refresh',sports_stories:'trooth-sports-refresh',store_listings:'trooth-stores-refresh',properties:'trooth-property-refresh',film_fashion_stories:'trooth-film-fashion-refresh'};
    var timer=null,channel=null,authSub=null,starting=false,cleaned=false;
    function refresh(table,event){
      clearTimeout(timer);timer=setTimeout(function(){
        var detail={table:table,event:event,source:'content-hubs-realtime'};
        var name=names[table];
        if(name)window.dispatchEvent(new CustomEvent(name,{detail:detail}));
        window.dispatchEvent(new CustomEvent('trooth-content-hubs-refresh',{detail:detail}));
        window.dispatchEvent(new CustomEvent('trooth-navigation-refresh',{detail:detail}));
      },120);
    }
    function cleanup(){
      if(cleaned)return;cleaned=true;clearTimeout(timer);timer=null;
      if(authSub&&authSub.unsubscribe){try{authSub.unsubscribe()}catch(e){}authSub=null}
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}
      if(window.troothContentHubsRealtime)window.troothContentHubsRealtime=null;
    }
    function subscribe(){
      if(starting||channel)return;starting=true;cleaned=false;
      var ch=sb.channel('trooth-content-hubs-realtime-'+Date.now());channel=ch;
      tables.forEach(function(table){ch.on('postgres_changes',{event:'*',schema:'public',table:table},function(e){refresh(table,e.eventType)})});
      ch.subscribe(function(status){
        starting=false;
        if(status==='SUBSCRIBED'){
          window.troothContentHubsRealtime=ch;
          window.dispatchEvent(new CustomEvent('trooth-content-hubs-ready'));
        }
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){try{sb.removeChannel(ch)}catch(e){}if(channel===ch)channel=null;setTimeout(subscribe,700)}
      });
    }
    subscribe();
    authSub=sb.auth.onAuthStateChange(function(event){
      if(event==='SIGNED_OUT'){cleanup();return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        cleanup();setTimeout(boot,50);
      }
    });
    window.addEventListener('beforeunload',cleanup,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
