// Trooth Social Independent — resilient PWA update experience
(function(){
  function boot(){
    if(window.__troothPwaUpdate)return;window.__troothPwaUpdate=true;
    if(!('serviceWorker' in navigator))return;
    function show(reg,worker){
      if(document.getElementById('trooth-update-banner'))return;
      window.__troothWaitingWorker=worker||reg.waiting;
      var x=document.createElement('div');x.id='trooth-update-banner';x.setAttribute('role','status');x.setAttribute('aria-live','polite');
      x.innerHTML='<span>🌿 Trooth کی نئی اپڈیٹ تیار ہے</span><button type="button" aria-label="Install Trooth update">Update</button>';
      x.style='position:fixed;left:12px;right:12px;bottom:74px;z-index:100001;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#173b29;color:#fff;padding:11px 14px;border-radius:14px;box-shadow:0 8px 30px #0004;font:700 12px system-ui';
      x.querySelector('button').style='border:0;border-radius:999px;padding:8px 14px;background:#d8f3dc;color:#173b29;font-weight:800;cursor:pointer';
      x.querySelector('button').onclick=function(){var w=window.__troothWaitingWorker||reg.waiting;if(w){w.postMessage({type:'SKIP_WAITING'});return}reg.update().catch(function(){})};
      document.body.appendChild(x);
    }
    function watch(reg){
      function check(){if(reg.waiting)show(reg,reg.waiting)}
      check();
      reg.addEventListener('updatefound',function(){
        var w=reg.installing;if(!w)return;
        w.addEventListener('statechange',function(){if(w.state==='installed'&&navigator.serviceWorker.controller){show(reg,w)}});
      });
      reg.update().catch(function(){});
      setInterval(function(){if(navigator.onLine)reg.update().catch(function(){});check()},120000);
      window.addEventListener('online',function(){setTimeout(function(){reg.update().catch(function(){})},1200)});
      document.addEventListener('visibilitychange',function(){if(!document.hidden&&navigator.onLine)reg.update().catch(function(){})});
    }
    navigator.serviceWorker.ready.then(watch).catch(function(){});
    navigator.serviceWorker.addEventListener('controllerchange',function(){
      if(!window.__troothPwaReloaded){window.__troothPwaReloaded=true;location.reload()}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
