// Trooth Social Independent — unified live social bridge
(function(){
  function boot(){
    if(window.__troothSocialLiveBridge)return;window.__troothSocialLiveBridge=true;
    var sb=window.troothSupabase;
    if(!sb||!sb.channel)return;
    var channel=null;
    function refresh(){
      window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-profile-social-refresh'));
    }
    function emit(table,payload){
      window.dispatchEvent(new CustomEvent('trooth-social-live-event',{detail:{table:table,event:payload.eventType,payload:payload}}));
      if(table==='posts'||table==='stories_reels')window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
      if(table==='messages')window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
      if(table==='notifications')window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      if(table==='friend_requests'||table==='connections'){
        window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));
        window.dispatchEvent(new CustomEvent('trooth-profile-social-refresh'));
      }
    }
    function subscribe(){
      try{if(channel)sb.removeChannel(channel)}catch(e){}
      channel=sb.channel('trooth-social-live-bridge');
      channel.on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){emit('posts',p)});
      channel.on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},function(p){emit('stories_reels',p)});
      channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},function(p){emit('messages',p)});
      channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications'},function(p){emit('notifications',p)});
      channel.on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){emit('friend_requests',p)});
      channel.on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){emit('connections',p)});
      channel.subscribe(function(status){
        window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:status,channel:'social-live-bridge'}}));
        if(status==='SUBSCRIBED')window.dispatchEvent(new CustomEvent('trooth-realtime-connected'));
      });
    }
    function start(){sb.auth.getUser().then(function(){subscribe()}).catch(function(){subscribe()})}
    window.addEventListener('trooth-auth-changed',function(){setTimeout(function(){refresh();start()},250)});
    window.addEventListener('trooth-realtime-reconnect',function(){setTimeout(function(){start();refresh()},500)});
    window.addEventListener('online',function(){setTimeout(function(){start();refresh()},500)});
    window.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(refresh,350)});
    start();
    window.__troothSocialLiveBridgeRefresh=refresh;
  }
  function start(){setTimeout(boot,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
