// Trooth Social Independent — unified live event bridge v2
(function(){
  if(window.__troothUnifiedLiveBridge)return;
  window.__troothUnifiedLiveBridge=true;
  var last={}, timers={};
  function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
  function key(type,detail){var d=detail||{};return type+':'+(d.id||d.message_id||d.notification_id||d.post_id||d.source||'general')}
  function relay(name,detail,wait){var k=key(name,detail);clearTimeout(timers[k]);timers[k]=setTimeout(function(){var now=Date.now();if(last[k]&&now-last[k]<900)return;last[k]=now;emit(name,detail)},wait||120)}
  window.addEventListener('trooth-message-incoming',function(e){
    var d=e.detail||{};
    relay('trooth-notifications-refresh',{source:'message',message:d});
    relay('trooth-chat-live-refresh',{source:'message',message:d});
    emit('trooth-live-unified',{type:'message',detail:d});
  });
  window.addEventListener('trooth-notification-incoming',function(e){
    var d=e.detail||{};
    relay('trooth-notifications-refresh',{source:'notification',notification:d});
    emit('trooth-live-unified',{type:'notification',detail:d});
  });
  window.addEventListener('trooth-unread-updated',function(e){
    var d=e.detail||{};
    relay('trooth-header-badges-refresh',{source:'unread',detail:d});
    emit('trooth-live-unified',{type:'unread',detail:d});
  });
  window.addEventListener('trooth-post-shared',function(e){
    var d=e.detail||{};
    relay('trooth-home-live-refresh',{source:'share',detail:d},180);
    emit('trooth-live-unified',{type:'share',detail:d});
  });
  window.addEventListener('trooth-feed-refreshed',function(e){
    var d=e.detail||{};
    relay('trooth-home-live-refresh',{source:'feed',detail:d},180);
  });
  window.addEventListener('trooth-home-hub-refresh',function(e){
    var d=e.detail||{};
    relay('trooth-home-live-refresh',{source:'hub',detail:d},220);
  });
  window.addEventListener('trooth-realtime-connected',function(){
    clearTimeout(timers.connected);timers.connected=setTimeout(function(){emit('trooth-live-unified',{type:'connected'})},80);
  });
})();
