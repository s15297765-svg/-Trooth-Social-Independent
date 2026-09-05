// Trooth Social Independent — live interaction refresh coordinator v3
(function(){
  if(window.__troothLiveInteractionRefreshV3)return;window.__troothLiveInteractionRefreshV3=true;
  var timer=null,busy=false,lastRun=0;
  function toast(msg){var old=document.querySelector('.trooth-live-refresh-toast');if(old)old.remove();var t=document.createElement('div');t.className='trooth-live-refresh-toast';t.textContent=msg;t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:9px 14px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;pointer-events:none;max-width:calc(100vw - 28px);text-align:center';document.body.appendChild(t);setTimeout(function(){if(t.parentNode)t.remove()},1800)}
  async function refresh(source){if(busy||navigator.onLine===false)return;var now=Date.now();if(now-lastRun<650)return;busy=true;lastRun=now;try{
    // Interaction refresh should update counters/badges, but must not trigger
    // the Home Feed "new posts" banner. The feed's dedicated realtime bridge
    // owns genuine post refreshes.
    if(typeof window.refreshTroothHeaderBadges==='function')await window.refreshTroothHeaderBadges();
    window.dispatchEvent(new CustomEvent('trooth-live-refresh-complete',{detail:{at:now,source:source||'interaction-v3'}}));
  }catch(e){}finally{busy=false}}
  function schedule(ms,source){clearTimeout(timer);timer=setTimeout(function(){refresh(source)},ms||300)}
  window.addEventListener('trooth-content-interaction-refresh',function(){schedule(120,'content-interaction')});
  window.addEventListener('trooth-messages-refresh',function(){schedule(120,'messages')});
  window.addEventListener('trooth-notifications-refresh',function(){schedule(120,'notifications')});
  window.addEventListener('trooth-auth-changed',function(){schedule(250,'auth')});
  window.addEventListener('trooth-pwa-lifecycle-refresh',function(){schedule(300,'pwa')});
  window.addEventListener('trooth-pwa-installed',function(){schedule(500,'pwa-installed')});
  window.addEventListener('online',function(){toast('🟢 Trooth Live دوبارہ connected');schedule(400,'online')});
  window.addEventListener('offline',function(){clearTimeout(timer);timer=null});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(350,'visibility');else clearTimeout(timer)});
  window.addEventListener('pageshow',function(){schedule(350,'pageshow')});
  window.addEventListener('focus',function(){if(!document.hidden)schedule(450,'focus')});
  setTimeout(function(){refresh('initial')},2500);
})();
