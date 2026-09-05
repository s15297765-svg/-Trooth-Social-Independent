// Trooth Social Independent — unified live event bridge v3
(function(){
  if(window.__troothUnifiedLiveBridge)return;
  window.__troothUnifiedLiveBridge=true;
  var last={},timers={};
  function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
  function key(type,detail){var d=detail||{};return type+':'+(d.id||d.message_id||d.notification_id||d.post_id||d.source||d.type||'general')}
  function relay(name,detail,wait){var k=key(name,detail);clearTimeout(timers[k]);timers[k]=setTimeout(function(){var now=Date.now();if(last[k]&&now-last[k]<1200)return;last[k]=now;emit(name,detail)},wait||120)}
  function unified(type,detail){relay('trooth-live-unified',{type:type,detail:detail||{}},60)}
  window.addEventListener('trooth-message-incoming',function(e){var d=e.detail||{};relay('trooth-notifications-refresh',{source:'message',message:d});relay('trooth-chat-live-refresh',{source:'message',message:d});unified('message',d)})
  window.addEventListener('trooth-notification-incoming',function(e){var d=e.detail||{};relay('trooth-notifications-refresh',{source:'notification',notification:d});unified('notification',d)})
  window.addEventListener('trooth-unread-updated',function(e){var d=e.detail||{};relay('trooth-header-badges-refresh',{source:'unread',detail:d});unified('unread',d)})
  window.addEventListener('trooth-post-shared',function(e){var d=e.detail||{};relay('trooth-home-live-refresh',{source:'share',detail:d},180);unified('share',d)})
  window.addEventListener('trooth-feed-refreshed',function(e){var d=e.detail||{};relay('trooth-home-live-refresh',{source:'feed',detail:d},180);unified('feed',d)})
  window.addEventListener('trooth-home-hub-refresh',function(e){var d=e.detail||{};relay('trooth-home-live-refresh',{source:'hub',detail:d},220);unified('hub',d)})
  window.addEventListener('trooth-realtime-connected',function(){clearTimeout(timers.connected);timers.connected=setTimeout(function(){unified('connected')},80)})
  window.addEventListener('trooth-realtime-status',function(e){var d=e.detail||{};var status=d.status||d.state||'';if(status)unified('status',d)})
  window.addEventListener('online',function(){unified('online')})
  window.addEventListener('offline',function(){unified('offline')})
  window.addEventListener('trooth-live-refresh-complete',function(e){unified('refresh-complete',e.detail||{})})
})();
