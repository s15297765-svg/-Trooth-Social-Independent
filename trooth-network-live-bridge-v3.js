// Trooth Social Independent — network live UX bridge v3
(function(){
  if(window.__troothNetworkLiveBridgeV3)return;
  window.__troothNetworkLiveBridgeV3=true;
  var last={};
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
  function key(p){var x=p&&p.payload||p||{};return [p&&p.kind||'',x.eventType||'',x.commit_timestamp||'',x.id||x.new&&x.new.id||''].join(':')}
  function relay(e){
    var d=e&&e.detail||{}; var k=key(d);
    if(k&&last[k])return; if(k)last[k]=Date.now();
    emit('trooth-live-network-update',d);
    if(d.kind==='friend_request'){
      emit('trooth-friends-refresh',d);
      emit('trooth-profile-social-refresh',d);
      emit('trooth-notification-center-refresh',d);
    }else if(d.kind==='connection' || d.kind==='follow'){
      emit('trooth-friends-refresh',d);
      emit('trooth-profile-social-refresh',d);
      emit('trooth-notification-center-refresh',d);
    }else if(d.kind==='message'){
      emit('trooth-messages-refresh',d);
      emit('trooth-notification-center-refresh',d);
    }
  }
  window.addEventListener('trooth-network-refresh',relay);
  window.addEventListener('trooth-notifications-refresh',function(e){
    var d=e&&e.detail||{}; emit('trooth-live-notification-update',d);
  });
  setInterval(function(){
    var now=Date.now();
    Object.keys(last).forEach(function(k){if(now-last[k]>60000)delete last[k]});
  },60000);
  emit('trooth-network-live-bridge-ready');
})();
