// Trooth Social Independent — unified realtime connection panel v2
(function(){
  function boot(){
    if(window.__troothLiveConnectionPanel)return;window.__troothLiveConnectionPanel=true;
    var el=document.createElement('div');el.id='trooth-connection-panel';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.style='position:fixed;left:12px;bottom:14px;z-index:99999;background:#fff;color:#173b29;padding:7px 11px;border-radius:999px;box-shadow:0 4px 18px #0002;font:700 11px system-ui;transition:.2s;cursor:default;max-width:calc(100vw - 24px)';
    document.body.appendChild(el);
    var last='';
    function set(state,detail){
      var text='⚪ Reconnecting…',color='#718276',title='Realtime connection is being restored';
      if(state==='connected'){text='🟢 Trooth Live';color='#40916c';title='Realtime connection active'}
      else if(state==='connecting'){text='🟡 Connecting…';color='#9a7b19';title='Connecting to Trooth Live'}
      else if(state==='offline'){text='⚪ Offline';color='#718276';title='Internet connection is offline'}
      else if(state==='retrying'){var n=detail&&detail.attempt?(' #'+detail.attempt):'';text='🟠 Retrying…'+n;color='#a55b16';title='Trooth is retrying the realtime connection'+(n?' — attempt '+(detail.attempt):'')}
      else if(state==='reconnecting'){text='⚪ Reconnecting…';color='#718276';title='Realtime connection is being restored'}
      if(last===text)return;last=text;el.textContent=text;el.style.color=color;el.title=title;el.setAttribute('aria-label',title);
    }
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='SUBSCRIBED')set('connected');else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='RETRYING')set('retrying',e.detail);else if(s==='CLOSED')set('reconnecting');else if(s==='RECONNECTING')set('reconnecting');else if(s==='OFFLINE'||s==='SIGNED_OUT')set('offline');else set('connecting')});
    window.addEventListener('trooth-realtime-connected',function(){set('connected')});
    window.addEventListener('trooth-realtime-reconnect',function(e){set('reconnecting',e.detail)});
    window.addEventListener('trooth-realtime-reconnecting',function(e){set('retrying',e.detail)});
    window.addEventListener('trooth-message-incoming',function(){set('connected')});
    window.addEventListener('trooth-notification-incoming',function(){set('connected')});
    window.addEventListener('online',function(){set('connecting')});
    window.addEventListener('offline',function(){set('offline')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&navigator.onLine)set('connecting')});
    window.addEventListener('pageshow',function(){if(navigator.onLine)set('connecting')});
    set(navigator.onLine?'connecting':'offline');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
