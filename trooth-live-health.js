// Trooth Social Independent — realtime health indicator
(function(){
  function boot(){
    if(window.__troothLiveHealth)return;window.__troothLiveHealth=true;
    var el=document.createElement('div');el.id='trooth-live-health';el.textContent='● LIVE';
    el.style='position:fixed;top:68px;right:12px;z-index:99998;background:#fff;padding:6px 10px;border-radius:999px;box-shadow:0 4px 16px #0002;font:700 11px system-ui;color:#718276;transition:.2s';
    document.body.appendChild(el);
    function set(ok,text){el.textContent=ok?'● '+(text||'LIVE'):'○ OFFLINE';el.style.color=ok?'#40916c':'#718276'}
    function listen(){window.addEventListener('trooth-realtime-connected',function(){set(true,'LIVE')});window.addEventListener('online',function(){set(true,'ONLINE')});window.addEventListener('offline',function(){set(false)});}
    listen();set(navigator.onLine,navigator.onLine?'LIVE':'OFFLINE');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
