// Trooth Social Independent — live interaction refresh coordinator
(function(){
  if(window.__troothLiveInteractionRefresh)return;window.__troothLiveInteractionRefresh=true;
  var timer=null,busy=false;
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:9px 14px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003';document.body.appendChild(t);setTimeout(function(){if(t.parentNode)t.remove()},1800)}
  async function refresh(){if(busy||!navigator.onLine)return;busy=true;try{if(typeof window.refreshTroothHeaderBadges==='function')await window.refreshTroothHeaderBadges();window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));}catch(e){}busy=false}
  function schedule(ms){clearTimeout(timer);timer=setTimeout(refresh,ms||300)}
  window.addEventListener('trooth-content-interaction-refresh',function(){schedule(120)});
  window.addEventListener('trooth-messages-refresh',function(){schedule(120)});
  window.addEventListener('trooth-notifications-refresh',function(){schedule(120)});
  window.addEventListener('trooth-auth-changed',function(){schedule(250)});
  window.addEventListener('online',function(){toast('🟢 Trooth Live دوبارہ connected');schedule(400)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(350)});
  setTimeout(refresh,2500);
})();
