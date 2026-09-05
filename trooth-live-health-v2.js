// Trooth Social Independent — robust realtime health monitor
(function(){
  function boot(){
    if(window.__troothLiveHealthV2)return;window.__troothLiveHealthV2=true;
    var el=document.createElement('div');el.id='trooth-live-health-v2';el.textContent='● LIVE';
    el.style='position:fixed;top:68px;right:12px;z-index:99998;background:#fff;padding:6px 10px;border-radius:999px;box-shadow:0 4px 16px #0002;font:700 11px system-ui;color:#40916c;transition:.2s';
    document.body.appendChild(el);
    function set(ok,text){el.textContent=ok?'● '+(text||'LIVE'):'○ OFFLINE';el.style.color=ok?'#40916c':'#718276'}
    function live(){set(true,'LIVE')}
    window.addEventListener('trooth-realtime-connected',live);
    window.addEventListener('trooth-message-incoming',live);
    window.addEventListener('trooth-notification-incoming',live);
    window.addEventListener('online',function(){set(true,'ONLINE')});
    window.addEventListener('offline',function(){set(false,'OFFLINE')});
    set(navigator.onLine,navigator.onLine?'ONLINE':'OFFLINE');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
