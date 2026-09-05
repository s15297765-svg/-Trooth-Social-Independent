// Trooth Social Independent — unified live event bridge v1
(function(){
  if(window.__troothUnifiedLiveBridge)return;
  window.__troothUnifiedLiveBridge=true;
  function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
  window.addEventListener('trooth-message-incoming',function(e){
    var d=e.detail||{};
    emit('trooth-notifications-refresh',{source:'message',message:d});
    emit('trooth-chat-live-refresh',{source:'message',message:d});
    emit('trooth-live-unified',{type:'message',detail:d});
  });
  window.addEventListener('trooth-notification-incoming',function(e){
    var d=e.detail||{};
    emit('trooth-notifications-refresh',{source:'notification',notification:d});
    emit('trooth-live-unified',{type:'notification',detail:d});
  });
  window.addEventListener('trooth-unread-updated',function(e){
    emit('trooth-header-badges-refresh',{source:'unread',detail:e.detail||{}});
    emit('trooth-live-unified',{type:'unread',detail:e.detail||{}});
  });
  window.addEventListener('trooth-post-shared',function(e){
    emit('trooth-home-live-refresh',{source:'share',detail:e.detail||{}});
    emit('trooth-live-unified',{type:'share',detail:e.detail||{}});
  });
  window.addEventListener('trooth-feed-refreshed',function(e){
    emit('trooth-home-live-refresh',{source:'feed',detail:e.detail||{}});
  });
  window.addEventListener('trooth-realtime-connected',function(){
    emit('trooth-live-unified',{type:'connected'});
  });
})();
