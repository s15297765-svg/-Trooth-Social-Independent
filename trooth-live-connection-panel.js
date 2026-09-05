// Trooth Social Independent — unified realtime connection panel
(function(){
  function boot(){
    if(window.__troothLiveConnectionPanel)return;window.__troothLiveConnectionPanel=true;
    var el=document.createElement('div');el.id='trooth-connection-panel';
    el.style='position:fixed;left:12px;bottom:14px;z-index:99999;background:#fff;color:#173b29;padding:7px 11px;border-radius:999px;box-shadow:0 4px 18px #0002;font:700 11px system-ui;transition:.2s;cursor:default';
    document.body.appendChild(el);
    function set(state,detail){
      if(state==='connected'){el.textContent='🟢 Trooth Live';el.style.color='#40916c';el.title='Realtime connection active'}
      else if(state==='connecting'){el.textContent='🟡 Connecting…';el.style.color='#9a7b19';el.title='Connecting to Trooth Live'}
      else if(state==='offline'){el.textContent='⚪ Offline';el.style.color='#718276';el.title='Internet connection is offline'}
      else if(state==='retrying'){var n=detail&&detail.attempt?(' #'+detail.attempt):'';el.textContent='🟠 Retrying…'+n;el.style.color='#a55b16';el.title='Trooth is retrying the realtime connection'}
      else {el.textContent='⚪ Reconnecting…';el.style.color='#718276';el.title='Realtime connection is being restored'}
    }
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='SUBSCRIBED')set('connected');else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='CLOSED'||s==='RETRYING')set('retrying',e.detail);else if(s==='RECONNECTING')set('reconnecting');else if(s==='OFFLINE')set('offline');else if(s==='SIGNED_OUT')set('offline');else set('connecting')});
    window.addEventListener('trooth-realtime-connected',function(){set('connected')});
    window.addEventListener('trooth-realtime-reconnect',function(){set('reconnecting')});
    window.addEventListener('online',function(){set('connecting')});
    window.addEventListener('offline',function(){set('offline')});
    set(navigator.onLine?'connecting':'offline');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
