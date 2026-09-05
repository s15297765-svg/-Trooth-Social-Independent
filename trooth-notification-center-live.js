// Trooth Notification Center — live bridge v3
(function(){
  if(window.__troothNotificationCenterLiveV3)return;window.__troothNotificationCenterLiveV3=true;
  var timer=null,busy=false,last=0;
  function schedule(ms){clearTimeout(timer);timer=setTimeout(run,ms||250)}
  async function run(){
    if(busy||!navigator.onLine||!window.troothSupabase)return;
    var now=Date.now();if(now-last<700)return;busy=true;last=now;
    try{
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'notification-center-v3'}}));
      window.dispatchEvent(new CustomEvent('trooth-unread-refresh',{detail:{source:'notification-center-v3'}}));
      if(typeof window.refreshTroothHeaderBadges==='function')await window.refreshTroothHeaderBadges();
    }catch(e){}finally{busy=false}
  }
  function incoming(){schedule(90)}
  window.addEventListener('trooth-notification-created',incoming);
  window.addEventListener('trooth-notification-read',incoming);
  window.addEventListener('trooth-content-interaction-refresh',incoming);
  window.addEventListener('trooth-messages-refresh',incoming);
  window.addEventListener('trooth-auth-changed',function(){schedule(200)});
  window.addEventListener('trooth-unread-updated',incoming);
  window.addEventListener('trooth-live-refresh-complete',function(){schedule(100)});
  window.addEventListener('online',function(){schedule(300)});
  window.addEventListener('pageshow',function(){schedule(280)});
  window.addEventListener('focus',function(){if(!document.hidden)schedule(320)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(320);else clearTimeout(timer)});
  setTimeout(run,1700);
})();
