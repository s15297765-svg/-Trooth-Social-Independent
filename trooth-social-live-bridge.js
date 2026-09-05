// Trooth Social Independent — unified live social bridge
(function(){
  function boot(){
    if(window.__troothSocialLiveBridge)return;window.__troothSocialLiveBridge=true;
    var sb=window.troothSupabase;
    function refresh(){
      window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));
    }
    window.addEventListener('trooth-auth-changed',function(){setTimeout(refresh,150)});
    window.addEventListener('trooth-realtime-reconnect',function(){setTimeout(refresh,500)});
    window.addEventListener('online',function(){setTimeout(refresh,300)});
    if(!sb||!sb.channel)return;
    var channel=sb.channel('trooth-social-live-bridge');
    ['posts','messages','notifications','friendships','follows','stories_reels'].forEach(function(table){
      channel.on('postgres_changes',{event:'*',schema:'public',table:table},function(payload){
        window.dispatchEvent(new CustomEvent('trooth-social-live-event',{detail:{table:table,event:payload.eventType,payload:payload}}));
        if(table==='posts'||table==='stories_reels')window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
        if(table==='messages')window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
        if(table==='notifications')window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
        if(table==='friendships'||table==='follows')window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));
      });
    });
    channel.subscribe(function(status){
      window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:status,channel:'social-live-bridge'}}));
    });
    window.__troothSocialLiveBridgeRefresh=refresh;
  }
  function start(){setTimeout(boot,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
