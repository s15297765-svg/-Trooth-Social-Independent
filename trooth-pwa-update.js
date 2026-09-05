// Trooth Social Independent — PWA update experience
(function(){
  function boot(){
    if(window.__troothPwaUpdate)return;window.__troothPwaUpdate=true;
    if(!('serviceWorker' in navigator))return;
    function show(){
      if(document.getElementById('trooth-update-banner'))return;
      var x=document.createElement('div');x.id='trooth-update-banner';
      x.innerHTML='<span>🌿 Trooth کی نئی اپڈیٹ تیار ہے</span><button type="button">Update</button>';
      x.style='position:fixed;left:12px;right:12px;bottom:74px;z-index:100001;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#173b29;color:#fff;padding:11px 14px;border-radius:14px;box-shadow:0 8px 30px #0004;font:700 12px system-ui';
      x.querySelector('button').style='border:0;border-radius:999px;padding:7px 13px;background:#d8f3dc;color:#173b29;font-weight:800';
      x.querySelector('button').onclick=function(){var r=window.__troothWaitingWorker;if(r){r.postMessage({type:'SKIP_WAITING'});location.reload()}else location.reload()};
      document.body.appendChild(x);
    }
    navigator.serviceWorker.ready.then(function(reg){
      function check(){if(reg.waiting)show();}
      check();
      reg.addEventListener('updatefound',function(){
        var w=reg.installing;if(!w)return;
        w.addEventListener('statechange',function(){if(w.state==='installed'&&navigator.serviceWorker.controller){window.__troothWaitingWorker=w;show()}});
      });
      setInterval(function(){reg.update().catch(function(){});check()},120000);
    }).catch(function(){});
    navigator.serviceWorker.addEventListener('controllerchange',function(){
      if(!window.__troothPwaReloaded){window.__troothPwaReloaded=true;location.reload()}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
