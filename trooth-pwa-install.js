// Trooth Social Independent — resilient install prompt + app lifecycle v4
(function(){
  if(window.__troothPwaInstall)return;window.__troothPwaInstall=true;
  var deferred=null,installBusy=false,lastPromptAt=0;
  function toast(msg){var old=document.querySelector('.trooth-install-toast');if(old)old.remove();var t=document.createElement('div');t.className='trooth-install-toast';t.textContent=msg;t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 28px);text-align:center;pointer-events:none';document.body.appendChild(t);setTimeout(function(){if(t.parentNode)t.remove()},2600)}
  function standalone(){return window.matchMedia('(display-mode:standalone)').matches||window.navigator.standalone===true}
  function removeButton(){var b=document.getElementById('trooth-install-btn');if(b)b.remove()}
  function addButton(){if(!deferred||document.getElementById('trooth-install-btn')||standalone())return;var b=document.createElement('button');b.id='trooth-install-btn';b.type='button';b.textContent='📲 Install Trooth';b.setAttribute('aria-label','Install Trooth App');b.setAttribute('title','Install Trooth App');b.style.cssText='position:fixed;right:14px;bottom:78px;z-index:9998;border:0;border-radius:999px;padding:11px 15px;background:#40916c;color:#fff;font-weight:800;box-shadow:0 8px 20px #0002;cursor:pointer;touch-action:manipulation';b.onclick=function(){window.troothInstallApp()};document.body.appendChild(b)}
  window.troothInstallApp=function(){if(installBusy)return;if(!deferred){toast('App install prompt ابھی دستیاب نہیں۔');return}var now=Date.now();if(now-lastPromptAt<1200)return;lastPromptAt=now;installBusy=true;var p=deferred;deferred=null;removeButton();try{p.prompt();Promise.resolve(p.userChoice).then(function(r){if(r&&r.outcome==='accepted')toast('Trooth App install شروع ہو گئی ✓');else{toast('Install بعد میں بھی کیا جا سکتا ہے۔');window.dispatchEvent(new CustomEvent('trooth-pwa-install-dismissed'))}}).catch(function(){toast('Install prompt دوبارہ دستیاب ہو سکتی ہے۔')}).finally(function(){installBusy=false})}catch(e){installBusy=false;toast('Install prompt دوبارہ دستیاب ہو سکتی ہے.')}};
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;addButton();window.dispatchEvent(new CustomEvent('trooth-pwa-install-ready'))});
  window.addEventListener('appinstalled',function(){deferred=null;installBusy=false;removeButton();toast('Trooth App کامیابی سے install ہو گئی ✓');window.dispatchEvent(new CustomEvent('trooth-pwa-installed'))});
  function net(){document.documentElement.classList.toggle('trooth-offline',navigator.onLine===false)}
  function recover(){net();if(standalone())removeButton();else addButton();window.dispatchEvent(new CustomEvent('trooth-pwa-lifecycle-refresh'))}
  window.addEventListener('online',function(){recover();toast('🟢 Trooth دوبارہ online ہے');window.dispatchEvent(new CustomEvent('trooth-pwa-online'))});
  window.addEventListener('offline',function(){net();toast('📡 Offline mode — Trooth available ہے');window.dispatchEvent(new CustomEvent('trooth-pwa-offline'))});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)recover()});
  window.addEventListener('pageshow',recover);
  window.addEventListener('focus',function(){recover()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){net();if(standalone())removeButton();else addButton()},{once:true});else{net();if(standalone())removeButton();else addButton()}
})();
