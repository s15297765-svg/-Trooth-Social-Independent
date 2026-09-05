// Trooth Social Independent — resilient realtime health indicator
(function(){
  function boot(){
    if(window.__troothLiveHealth)return;window.__troothLiveHealth=true;
    var el=document.createElement('div');el.id='trooth-live-health';el.textContent='● LIVE';
    el.style='position:fixed;top:68px;right:12px;z-index:99998;background:#fff;padding:6px 10px;border-radius:999px;box-shadow:0 4px 16px #0002;font:700 11px system-ui;color:#718276;transition:.2s;cursor:default';
    document.body.appendChild(el);
    var last='';
    function set(state){var map={live:['● LIVE','#40916c'],connecting:['● CONNECTING…','#9a7b19'],offline:['○ OFFLINE','#718276'],error:['○ RETRYING…','#9a7b19'],reconnecting:['○ RECONNECTING…','#9a7b19']};var x=map[state]||map.connecting;if(last===state)return;last=state;el.textContent=x[0];el.style.color=x[1];el.title=state==='live'?'Trooth realtime is connected':state==='offline'?'You are offline':'Trooth realtime is reconnecting'}
    function online(){return navigator.onLine!==false}
    set(online()?'connecting':'offline');
    window.addEventListener('trooth-realtime-connected',function(){set('live')});
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='SUBSCRIBED')set('live');else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT')set('error');else if(s==='CLOSED')set('reconnecting')});
    window.addEventListener('trooth-realtime-reconnect',function(){set('reconnecting')});
    window.addEventListener('trooth-realtime-reconnecting',function(){set('reconnecting')});
    window.addEventListener('trooth-message-incoming',function(){set('live')});
    window.addEventListener('trooth-notification-incoming',function(){set('live')});
    window.addEventListener('online',function(){set('connecting');setTimeout(function(){if(online())set('live')},1800)});
    window.addEventListener('offline',function(){set('offline')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online())set('connecting')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
