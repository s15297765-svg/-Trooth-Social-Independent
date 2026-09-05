// Trooth Social Independent — unified live social bridge
(function(){
  function boot(){
    if(window.__troothSocialLiveBridge)return;window.__troothSocialLiveBridge=true;
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    var channel=null,online=navigator.onLine!==false,retry=null,attempt=0,connecting=false;
    function fire(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function refresh(){fire('trooth-feed-refresh');fire('trooth-messages-refresh');fire('trooth-notifications-refresh');fire('trooth-friends-refresh');fire('trooth-profile-social-refresh')}
    function emit(table,p){fire('trooth-social-live-event',{table:table,event:p.eventType,payload:p});if(table==='posts'||table==='stories_reels')fire('trooth-feed-refresh',p);if(table==='messages')fire('trooth-messages-refresh',p);if(table==='notifications')fire('trooth-notifications-refresh',p);if(table==='friend_requests'||table==='connections'){fire('trooth-friends-refresh',p);fire('trooth-profile-social-refresh',p)}}
    function cleanup(){if(retry){clearTimeout(retry);retry=null}if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}}
    function schedule(){if(!online||retry)return;attempt=Math.min(attempt+1,6);var ms=Math.min(30000,1200*Math.pow(2,attempt-1));fire('trooth-realtime-status',{status:'RETRYING',channel:'social-live-bridge',attempt:attempt,delay:ms});retry=setTimeout(function(){retry=null;subscribe()},ms)}
    function subscribe(){if(!online||connecting)return;connecting=true;cleanup();fire('trooth-realtime-status',{status:'CONNECTING',channel:'social-live-bridge'});try{
      channel=sb.channel('trooth-social-live-bridge');
      channel.on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){emit('posts',p)});
      channel.on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},function(p){emit('stories_reels',p)});
      channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},function(p){emit('messages',p)});
      channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications'},function(p){emit('notifications',p)});
      channel.on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){emit('friend_requests',p)});
      channel.on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){emit('connections',p)});
      channel.subscribe(function(status){connecting=false;fire('trooth-realtime-status',{status:status,channel:'social-live-bridge'});if(status==='SUBSCRIBED'){attempt=0;fire('trooth-realtime-connected')}else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED')schedule()});
    }catch(e){connecting=false;schedule()}}
    window.addEventListener('trooth-auth-changed',function(){attempt=0;cleanup();setTimeout(function(){refresh();subscribe()},300)});
    window.addEventListener('trooth-realtime-reconnect',function(){attempt=0;cleanup();setTimeout(subscribe,400)});
    window.addEventListener('online',function(){online=true;attempt=0;fire('trooth-realtime-status',{status:'RECONNECTING'});setTimeout(function(){refresh();subscribe()},500)});
    window.addEventListener('offline',function(){online=false;cleanup();fire('trooth-realtime-status',{status:'OFFLINE'})});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online){setTimeout(function(){refresh();if(!channel)subscribe()},350)}});
    subscribe();window.__troothSocialLiveBridgeRefresh=refresh;
  }
  function start(){setTimeout(boot,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
