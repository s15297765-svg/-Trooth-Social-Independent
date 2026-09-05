// Trooth Social Independent — unified live event bridge v5
(function(){
  if(window.__troothUnifiedLiveBridgeV5)return;
  window.__troothUnifiedLiveBridgeV5=true;
  var last={},timers={};
  function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
  function key(type,detail){var d=detail||{};return type+':'+(d.id||d.message_id||d.notification_id||d.post_id||d.source||d.type||'general')}
  function relay(name,detail,wait){
    var k=key(name,detail);clearTimeout(timers[k]);
    timers[k]=setTimeout(function(){
      var now=Date.now();
      if(last[k]&&now-last[k]<1200)return;
      last[k]=now;emit(name,detail);
    },wait||120);
  }
  function unified(type,detail){
    var d=detail||{},payload={type:type,detail:d,source:'unified-v5',at:Date.now()};
    relay('trooth-live-unified',payload,60);
  }
  window.addEventListener('trooth-message-incoming',function(e){var d=e.detail||{};relay('trooth-notifications-refresh',{source:'message',message:d});relay('trooth-chat-live-refresh',{source:'message',message:d});unified('message',d)})
  window.addEventListener('trooth-notification-incoming',function(e){var d=e.detail||{};relay('trooth-notifications-refresh',{source:'notification',notification:d});unified('notification',d)})
  window.addEventListener('trooth-unread-updated',function(e){var d=e.detail||{};relay('trooth-header-badges-refresh',{source:'unread',detail:d});unified('unread',d)})
  // Social interactions refresh Activity/Badges, but never trigger a feed "new posts" cycle.
  window.addEventListener('trooth-post-liked',function(e){unified('like',e.detail||{})})
  window.addEventListener('trooth-comment-added',function(e){unified('comment',e.detail||{})})
  window.addEventListener('trooth-post-shared',function(e){unified('share',e.detail||{})})
  window.addEventListener('trooth-feed-refreshed',function(e){var d=e.detail||{};relay('trooth-home-live-refresh',{source:'feed',detail:d},180);unified('feed',d)})
  window.addEventListener('trooth-home-hub-refresh',function(e){var d=e.detail||{};relay('trooth-home-live-refresh',{source:'hub',detail:d},220);unified('hub',d)})
  window.addEventListener('trooth-realtime-connected',function(){clearTimeout(timers.connected);timers.connected=setTimeout(function(){unified('connected')},80)})
  window.addEventListener('trooth-realtime-status',function(e){var d=e.detail||{},status=d.status||d.state||'';if(status)unified('status',d)})
  window.addEventListener('online',function(){unified('online')})
  window.addEventListener('offline',function(){unified('offline')})
  window.addEventListener('trooth-live-refresh-complete',function(e){unified('refresh-complete',e.detail||{})})
  window.addEventListener('beforeunload',function(){Object.keys(timers).forEach(function(k){clearTimeout(timers[k])});timers={};last={}},{once:true});
})();
