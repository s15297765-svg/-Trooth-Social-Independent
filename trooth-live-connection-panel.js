// Trooth Social Independent — unified realtime connection panel
(function(){
  function boot(){
    if(window.__troothLiveConnectionPanel)return;window.__troothLiveConnectionPanel=true;
    var el=document.createElement('div');el.id='trooth-connection-panel';el.textContent='🟢 Trooth Live';
    el.style='position:fixed;left:12px;bottom:14px;z-index:99999;background:#fff;color:#173b29;padding:7px 11px;border-radius:999px;box-shadow:0 4px 18px #0002;font:700 11px system-ui;transition:.2s';
    document.body.appendChild(el);
    function set(state){
      if(state==='connected'){el.textContent='🟢 Trooth Live';el.style.color='#40916c'}
      else if(state==='connecting'){el.textContent='🟡 Connecting…';el.style.color='#9a7b19'}
      else {el.textContent='⚪ Reconnecting…';el.style.color='#718276'}
    }
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;set(s==='SUBSCRIBED'?'connected':'connecting')});
    window.addEventListener('trooth-realtime-connected',function(){set('connected')});
    window.addEventListener('trooth-realtime-reconnect',function(){set('reconnecting')});
    window.addEventListener('online',function(){set('connecting')});
    window.addEventListener('offline',function(){set('reconnecting')});
    set(navigator.onLine?'connecting':'reconnecting');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
