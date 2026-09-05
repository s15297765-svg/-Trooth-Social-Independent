// Trooth Social Independent — install prompt + online status
(function(){
  var deferred=null;
  function toast(msg){
    var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:600 14px system-ui;box-shadow:0 8px 24px #0002';document.body.appendChild(t);setTimeout(function(){t.remove()},2600);
  }
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;window.troothInstallApp=function(){if(!deferred){toast('App پہلے ہی installed ہے یا browser install prompt دستیاب نہیں۔');return}deferred.prompt();deferred.userChoice.then(function(){deferred=null})};
    if(!document.getElementById('trooth-install-btn')){var b=document.createElement('button');b.id='trooth-install-btn';b.textContent='📲 Install Trooth';b.onclick=function(){window.troothInstallApp()};b.style.cssText='position:fixed;right:14px;bottom:78px;z-index:9998;border:0;border-radius:999px;padding:11px 15px;background:#40916c;color:white;font-weight:800;box-shadow:0 8px 20px #0002;cursor:pointer';document.body.appendChild(b)}
  });
  window.addEventListener('appinstalled',function(){var b=document.getElementById('trooth-install-btn');if(b)b.remove();toast('Trooth App کامیابی سے install ہو گئی ✓')});
  function net(){document.documentElement.classList.toggle('trooth-offline',!navigator.onLine);if(!navigator.onLine)toast('Offline mode — cached Trooth pages available');}
  window.addEventListener('online',net);window.addEventListener('offline',net);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',net);else net();
})();
