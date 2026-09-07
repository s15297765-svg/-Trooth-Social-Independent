// Trooth Social Independent — Feed ↔ Activity ↔ Notifications bridge v1
(function(){
 if(window.__troothFeedActivityBridgeV1)return;window.__troothFeedActivityBridgeV1=true;
 function emit(n,d){try{window.dispatchEvent(new CustomEvent(n,{detail:d||{}}))}catch(e){}}
 var timer=0;
 function refresh(){clearTimeout(timer);timer=setTimeout(function(){
  ['refreshActivity','loadActivity','refreshTroothNotifications','refreshNotifications'].forEach(function(fn){try{if(typeof window[fn]==='function')window[fn]()}catch(e){}});
  emit('trooth-feed-activity-synced',{at:Date.now()});
 },220)}
 ['trooth-content-interaction-refresh','trooth-saved-content-refresh','trooth-network-ui-refresh'].forEach(function(n){window.addEventListener(n,refresh)});
 window.addEventListener('pageshow',refresh);window.addEventListener('focus',refresh);
})();
