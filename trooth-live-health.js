// Trooth Social Independent — resilient realtime health indicator v2
(function(){
  function boot(){
    if(window.__troothLiveHealth)return;window.__troothLiveHealth=true;
    var el=document.createElement('div');el.id='trooth-live-health';el.textContent='● LIVE';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.style='position:fixed;top:68px;right:12px;z-index:99998;background:#fff;padding:6px 10px;border-radius:999px;box-shadow:0 4px 16px #0002;font:700 11px system-ui;color:#718276;transition:.2s;cursor:default';
    document.body.appendChild(el);
    var last='',attempt=0,timer;
    function set(state){var map={live:['● LIVE','#40916c','Trooth realtime is connected'],connecting:['● CONNECTING…','#9a7b19','Trooth realtime is connecting'],offline:['○ OFFLINE','#718276','You are offline'],error:['○ RETRYING…','#9a7b19','Trooth realtime is retrying'],reconnecting:['○ RECONNECTING…','#9a7b19','Trooth realtime is reconnecting']};var x=map[state]||map.connecting;if(last===state)return;last=state;el.textContent=x[0];el.style.color=x[1];el.title=x[2];el.setAttribute('aria-label',x[2])}
    function online(){return navigator.onLine!==false}
    function recover(){clearTimeout(timer);if(!online()){set('offline');return}set('connecting');timer=setTimeout(function(){if(online())set('live')},1800)}
    set(online()?'connecting':'offline');
    window.addEventListener('trooth-realtime-connected',function(){attempt=0;set('live')});
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='SUBSCRIBED'){attempt=0;set('live')}else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'){attempt++;set('error')}else if(s==='CLOSED'){attempt++;set('reconnecting')}});
    window.addEventListener('trooth-realtime-reconnect',function(){attempt++;set('reconnecting')});
    window.addEventListener('trooth-realtime-reconnecting',function(e){attempt++;set('reconnecting');if(e.detail&&e.detail.attempt)el.title='Trooth reconnecting — attempt '+e.detail.attempt});
    window.addEventListener('trooth-message-incoming',function(){attempt=0;set('live')});
    window.addEventListener('trooth-notification-incoming',function(){attempt=0;set('live')});
    window.addEventListener('online',recover);
    window.addEventListener('offline',function(){clearTimeout(timer);set('offline')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online())recover()});
    window.addEventListener('pageshow',function(){if(online())recover()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
