// Trooth Social Independent — unified live event bridge v2
(function(){
  if(window.__troothUnifiedLiveBridge)return;
  window.__troothUnifiedLiveBridge=true;
  var last={};
  function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
  function relay(key,name,detail,ttl){
    var now=Date.now(),sig=key+JSON.stringify(detail||{});
    if(last[key]&&last[key].sig===sig&&now-last[key].time<(ttl||1200))return;
    last[key]={sig:sig,time:now};emit(name,detail);
  }
  window.addEventListener('trooth-message-incoming',function(e){
    var d=e.detail||{};
    relay('message-refresh','trooth-notifications-refresh',{source:'message',message:d});
    relay('message-chat','trooth-chat-live-refresh',{source:'message',message:d});
    emit('trooth-live-unified',{type:'message',detail:d});
  });
  window.addEventListener('trooth-notification-incoming',function(e){
    var d=e.detail||{};
    relay('notification-refresh','trooth-notifications-refresh',{source:'notification',notification:d});
    emit('trooth-live-unified',{type:'notification',detail:d});
  });
  window.addEventListener('trooth-unread-updated',function(e){
    var d=e.detail||{};
    relay('unread-badges','trooth-header-badges-refresh',{source:'unread',detail:d});
    emit('trooth-live-unified',{type:'unread',detail:d});
  });
  window.addEventListener('trooth-post-shared',function(e){
    var d=e.detail||{};
    relay('share-home','trooth-home-live-refresh',{source:'share',detail:d},2000);
    emit('trooth-live-unified',{type:'share',detail:d});
  });
  window.addEventListener('trooth-feed-refreshed',function(e){
    relay('feed-home','trooth-home-live-refresh',{source:'feed',detail:e.detail||{}},1000);
  });
  window.addEventListener('trooth-home-hub-refresh',function(e){
    relay('hub-home','trooth-home-live-refresh',{source:'hub',detail:e.detail||{}},1500);
  });
  window.addEventListener('trooth-realtime-status',function(e){
    var d=e.detail||{};
    emit('trooth-live-unified',{type:'status',detail:d});
  });
  window.addEventListener('trooth-realtime-connected',function(){
    emit('trooth-live-unified',{type:'connected'});
    relay('connected-refresh','trooth-home-live-refresh',{source:'connected'},2500);
  });
})();
