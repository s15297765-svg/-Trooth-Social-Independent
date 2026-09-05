// Trooth Social Independent — global live connection status
(function(){
  function boot(){
    if(document.getElementById('trooth-live-status')) return;
    var b=document.createElement('div');
    b.id='trooth-live-status';
    b.innerHTML='<span class="dot"></span><span class="label">Live</span>';
    b.style.cssText='position:fixed;top:68px;right:12px;z-index:9997;display:flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;background:#fff;box-shadow:0 5px 18px #0001;font:700 12px system-ui;color:#173b29;transition:.2s';
    var s=document.createElement('style');
    s.textContent='#trooth-live-status .dot{width:8px;height:8px;border-radius:50%;background:#2d9d62;display:inline-block}#trooth-live-status.off .dot{background:#999}#trooth-live-status.off .label{color:#777}';
    document.head.appendChild(s);document.body.appendChild(b);
    function set(){b.classList.toggle('off',!navigator.onLine);b.querySelector('.label').textContent=navigator.onLine?'Live':'Offline'}
    window.addEventListener('online',set);window.addEventListener('offline',set);set();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
