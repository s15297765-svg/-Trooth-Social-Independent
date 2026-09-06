// Trooth Social Independent — Home Feed realtime debounce bridge v1
(function(){
  if(window.__troothHomeFeedDebounceV1)return;window.__troothHomeFeedDebounceV1=true;
  var timer=null,last=0;
  function schedule(reason){
    var now=Date.now();
    if(now-last<250)return;
    clearTimeout(timer);
    timer=setTimeout(function(){
      last=Date.now();
      window.dispatchEvent(new CustomEvent('trooth-home-feed-refresh-request',{detail:{reason:reason||'realtime'}}));
    },220);
  }
  ['trooth-content-interaction-refresh','trooth-saved-content-refresh','trooth-home-hub-live-refresh','trooth-interaction-updated'].forEach(function(ev){
    window.addEventListener(ev,function(){schedule(ev)});
  });
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')schedule('visible')});
})();
