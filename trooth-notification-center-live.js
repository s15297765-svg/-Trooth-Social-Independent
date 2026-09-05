// Trooth Notification Center — live bridge v2
(function(){
  if(window.__troothNotificationCenterLiveV2)return;window.__troothNotificationCenterLiveV2=true;
  var timer=null,busy=false,last=0;
  function schedule(ms){clearTimeout(timer);timer=setTimeout(run,ms||250)}
  async function run(){
    if(busy||!navigator.onLine)return;
    if(!window.troothSupabase)return;
    var now=Date.now();if(now-last<500)return;busy=true;last=now;
    try{
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-unread-refresh'));
      if(typeof window.refreshTroothHeaderBadges==='function')await window.refreshTroothHeaderBadges();
    }catch(e){}finally{busy=false}
  }
  function incoming(){schedule(70)}
  window.addEventListener('trooth-notification-created',incoming);
  window.addEventListener('trooth-notification-read',incoming);
  window.addEventListener('trooth-content-interaction-refresh',incoming);
  window.addEventListener('trooth-messages-refresh',incoming);
  window.addEventListener('trooth-auth-changed',function(){schedule(180)});
  window.addEventListener('trooth-unread-updated',incoming);
  window.addEventListener('trooth-live-refresh-complete',function(){schedule(80)});
  window.addEventListener('online',function(){schedule(300)});
  window.addEventListener('pageshow',function(){schedule(250)});
  window.addEventListener('focus',function(){if(!document.hidden)schedule(300)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(300);else clearTimeout(timer)});
  setTimeout(run,1600);
})();
