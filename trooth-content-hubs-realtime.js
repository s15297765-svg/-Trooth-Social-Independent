// Trooth — unified realtime bridge for Groups + Business + News + Sports + Stores + Property + Film/Fashion
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||!sb.channel||!sb.auth)return;
    if(window.troothContentHubsRealtime)return;
    var tables=['groups','group_members','group_announcements','group_join_requests','businesses','business_posts','news_stories','sports_stories','store_listings','properties','film_fashion_stories'];
    var names={groups:'trooth-groups-refresh',group_members:'trooth-groups-refresh',group_announcements:'trooth-groups-refresh',group_join_requests:'trooth-groups-refresh',businesses:'trooth-business-refresh',business_posts:'trooth-business-refresh',news_stories:'trooth-news-refresh',sports_stories:'trooth-sports-refresh',store_listings:'trooth-stores-refresh',properties:'trooth-property-refresh',film_fashion_stories:'trooth-film-fashion-refresh'};
    var timer=null,channel=null,authSub=null,starting=false,stopped=false;
    function refresh(table,event){
      if(stopped)return;
      clearTimeout(timer);timer=setTimeout(function(){
        timer=null;if(stopped)return;
        var detail={table:table,event:event,source:'content-hubs-realtime'};
        var name=names[table];
        if(name)window.dispatchEvent(new CustomEvent(name,{detail:detail}));
        window.dispatchEvent(new CustomEvent('trooth-content-hubs-refresh',{detail:detail}));
        window.dispatchEvent(new CustomEvent('trooth-navigation-refresh',{detail:detail}));
      },120);
    }
    function clearChannel(){
      clearTimeout(timer);timer=null;starting=false;
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothContentHubsRealtime=null;
    }
    function cleanup(full){
      clearChannel();
      if(full&&authSub&&authSub.unsubscribe){try{authSub.unsubscribe()}catch(e){}authSub=null;}
    }
    function subscribe(){
      if(stopped||starting||channel)return;
      starting=true;
      var ch=sb.channel('trooth-content-hubs-realtime-'+Date.now());channel=ch;
      tables.forEach(function(table){ch.on('postgres_changes',{event:'*',schema:'public',table:table},function(e){refresh(table,e.eventType)})});
      ch.subscribe(function(status){
        starting=false;window.troothContentHubsRealtimeStatus=status;
        if(status==='SUBSCRIBED'){
          if(channel!==ch)return;
          window.troothContentHubsRealtime=ch;window.dispatchEvent(new CustomEvent('trooth-content-hubs-ready'));
        }else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
          try{sb.removeChannel(ch)}catch(e){}if(channel===ch)channel=null;
          if(!stopped)setTimeout(subscribe,700);
        }
      });
    }
    subscribe();
    authSub=sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||event==='USER_DELETED'||!session){stopped=true;clearChannel();return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        stopped=false;clearChannel();setTimeout(function(){if(!stopped)subscribe()},80);
      }
    });
    window.addEventListener('beforeunload',function(){stopped=true;cleanup(true)},{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
