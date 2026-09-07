// Trooth Social Independent — Network UI Sync v1
(function(){
  if(window.__troothNetworkUISyncV1)return; window.__troothNetworkUISyncV1=true;
  var timer=0, running=false, last=0;
  function emit(n,d){try{window.dispatchEvent(new CustomEvent(n,{detail:d||{}}))}catch(e){}}
  function refresh(){
    if(running||!navigator.onLine)return;
    var now=Date.now(); if(now-last<600)return; last=now; running=true;
    try{
      ['refreshTroothNotifications','refreshTroothMessages','refreshNotifications','refreshMessages','loadNotifications','loadMessages','loadSocial','loadProfiles'].forEach(function(fn){
        try{if(typeof window[fn]==='function')window[fn]()}catch(e){}
      });
      emit('trooth-network-ui-synced',{at:now});
    }finally{running=false}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(refresh,220)}
  ['trooth-network-ui-refresh','trooth-profile-social-refresh','trooth-friends-refresh','trooth-notifications-refresh','trooth-messages-refresh','trooth-network-refresh','trooth-unread-refresh','trooth-auth-changed'].forEach(function(n){window.addEventListener(n,schedule)});
  window.addEventListener('online',schedule); window.addEventListener('pageshow',schedule); window.addEventListener('focus',function(){if(!document.hidden)schedule()});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
  setTimeout(refresh,1200);
})();
