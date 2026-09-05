// Trooth Social Independent — resilient install prompt + app lifecycle
(function(){
  if(window.__troothPwaInstall)return;window.__troothPwaInstall=true;
  var deferred=null;
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:600 14px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 28px);text-align:center';document.body.appendChild(t);setTimeout(function(){if(t.parentNode)t.remove()},2600)}
  function standalone(){return window.matchMedia('(display-mode:standalone)').matches||window.navigator.standalone===true}
  function removeButton(){var b=document.getElementById('trooth-install-btn');if(b)b.remove()}
  function addButton(){if(!deferred||document.getElementById('trooth-install-btn')||standalone())return;var b=document.createElement('button');b.id='trooth-install-btn';b.type='button';b.textContent='📲 Install Trooth';b.setAttribute('aria-label','Install Trooth App');b.onclick=function(){window.troothInstallApp()};b.style.cssText='position:fixed;right:14px;bottom:78px;z-index:9998;border:0;border-radius:999px;padding:11px 15px;background:#40916c;color:white;font-weight:800;box-shadow:0 8px 20px #0002;cursor:pointer';document.body.appendChild(b)}
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;window.troothInstallApp=function(){if(!deferred){toast('App install prompt دستیاب نہیں۔');return}var p=deferred;deferred=null;removeButton();p.prompt();p.userChoice.then(function(r){if(r&&r.outcome==='accepted')toast('Trooth install شروع ہو گئی ✓');else toast('Install بعد میں بھی کیا جا سکتا ہے۔')}).catch(function(){toast('Install prompt دوبارہ دستیاب ہو سکتی ہے۔')})};addButton()});
  window.addEventListener('appinstalled',function(){deferred=null;removeButton();toast('Trooth App کامیابی سے install ہو گئی ✓')});
  function net(){document.documentElement.classList.toggle('trooth-offline',navigator.onLine===false)}
  window.addEventListener('online',function(){net();toast('🟢 Trooth دوبارہ online ہے');window.dispatchEvent(new CustomEvent('trooth-pwa-online'))});
  window.addEventListener('offline',function(){net();toast('📡 Offline mode — Trooth available ہے');window.dispatchEvent(new CustomEvent('trooth-pwa-offline'))});
  document.addEventListener('visibilitychange',function(){if(!document.hidden){net();if(!standalone())addButton()}});
  window.addEventListener('pageshow',function(){net();if(!standalone())addButton()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){net();addButton()},{once:true});else{net();addButton()}
})();
