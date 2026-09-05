// Trooth Social Independent — install prompt + app lifecycle
(function(){
  var deferred=null;
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:600 14px system-ui;box-shadow:0 8px 24px #0002';document.body.appendChild(t);setTimeout(function(){t.remove()},2600)}
  function addButton(){if(!deferred||document.getElementById('trooth-install-btn')||window.matchMedia('(display-mode:standalone)').matches)return;var b=document.createElement('button');b.id='trooth-install-btn';b.textContent='📲 Install Trooth';b.onclick=function(){window.troothInstallApp()};b.style.cssText='position:fixed;right:14px;bottom:78px;z-index:9998;border:0;border-radius:999px;padding:11px 15px;background:#40916c;color:white;font-weight:800;box-shadow:0 8px 20px #0002;cursor:pointer';document.body.appendChild(b)}
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;window.troothInstallApp=function(){if(!deferred){toast('App install prompt دستیاب نہیں۔');return}deferred.prompt();deferred.userChoice.then(function(r){if(r&&r.outcome==='accepted')toast('Trooth install شروع ہو گئی ✓');deferred=null;var b=document.getElementById('trooth-install-btn');if(b)b.remove()}).catch(function(){})};addButton()});
  window.addEventListener('appinstalled',function(){deferred=null;var b=document.getElementById('trooth-install-btn');if(b)b.remove();toast('Trooth App کامیابی سے install ہو گئی ✓')});
  function net(){document.documentElement.classList.toggle('trooth-offline',!navigator.onLine)}
  window.addEventListener('online',function(){net();toast('🟢 Trooth دوبارہ online ہے')});window.addEventListener('offline',function(){net();toast('📡 Offline mode — Trooth available ہے')});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',net,{once:true});else net();
})();
