// Trooth Social Independent — live interaction refresh coordinator v2
(function(){
  if(window.__troothLiveInteractionRefresh)return;window.__troothLiveInteractionRefresh=true;
  var timer=null,busy=false,lastRun=0;
  function toast(msg){var old=document.querySelector('.trooth-live-refresh-toast');if(old)old.remove();var t=document.createElement('div');t.className='trooth-live-refresh-toast';t.textContent=msg;t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:9px 14px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;pointer-events:none;max-width:calc(100vw - 28px);text-align:center';document.body.appendChild(t);setTimeout(function(){if(t.parentNode)t.remove()},1800)}
  async function refresh(){if(busy||!navigator.onLine)return;var now=Date.now();if(now-lastRun<350)return;busy=true;lastRun=now;try{if(typeof window.refreshTroothHeaderBadges==='function')await window.refreshTroothHeaderBadges();window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));window.dispatchEvent(new CustomEvent('trooth-live-refresh-complete',{detail:{at:now}}));}catch(e){}finally{busy=false}}
  function schedule(ms){clearTimeout(timer);timer=setTimeout(refresh,ms||300)}
  window.addEventListener('trooth-content-interaction-refresh',function(){schedule(120)});
  window.addEventListener('trooth-messages-refresh',function(){schedule(120)});
  window.addEventListener('trooth-notifications-refresh',function(){schedule(120)});
  window.addEventListener('trooth-auth-changed',function(){schedule(250)});
  window.addEventListener('trooth-pwa-lifecycle-refresh',function(){schedule(300)});
  window.addEventListener('trooth-pwa-installed',function(){schedule(500)});
  window.addEventListener('online',function(){toast('🟢 Trooth Live دوبارہ connected');schedule(400)});
  window.addEventListener('offline',function(){clearTimeout(timer);timer=null});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(350);else clearTimeout(timer)});
  window.addEventListener('pageshow',function(){schedule(350)});
  window.addEventListener('focus',function(){if(!document.hidden)schedule(450)});
  setTimeout(refresh,2500);
})();
