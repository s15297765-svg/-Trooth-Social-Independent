// Trooth Social Independent — resilient realtime health indicator v4
(function(){
  function boot(){
    if(window.__troothLiveHealth)return;window.__troothLiveHealth=true;
    var el=document.createElement('div');el.id='trooth-live-health';el.textContent='● LIVE';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.style='position:fixed;top:68px;right:12px;z-index:99998;background:#fff;padding:6px 10px;border-radius:999px;box-shadow:0 4px 16px #0002;font:700 11px system-ui;color:#718276;transition:.2s;cursor:default';
    document.body.appendChild(el);
    var last='',attempt=0,timer=null,lastSignal=0;
    function set(state,detail){var map={live:['● LIVE','#40916c','Trooth realtime is connected'],connecting:['● CONNECTING…','#9a7b19','Trooth realtime is connecting'],offline:['○ OFFLINE','#718276','You are offline'],error:['○ RETRYING…','#9a7b19','Trooth realtime is retrying'],reconnecting:['○ RECONNECTING…','#9a7b19','Trooth realtime is reconnecting']};var x=map[state]||map.connecting;if(last===state)return;last=state;el.textContent=x[0];el.style.color=x[1];el.title=x[2];el.setAttribute('aria-label',x[2]);if(detail&&detail.attempt)el.title+=' — attempt '+detail.attempt}
    function online(){return navigator.onLine!==false}
    function recover(){clearTimeout(timer);if(!online()){set('offline');return}set('connecting');timer=setTimeout(function(){if(online()&&last==='connecting')set('live')},1800)}
    function signalLive(){var now=Date.now();if(now-lastSignal<250)return;lastSignal=now;attempt=0;set('live')}
    set(online()?'connecting':'offline');
    window.addEventListener('trooth-realtime-connected',signalLive);
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='SUBSCRIBED')signalLive();else if(s==='CONNECTING')set('connecting');else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'){attempt++;set('error',e.detail)}else if(s==='CLOSED'){attempt++;set('reconnecting',e.detail)}else if(s==='RECONNECTING'){attempt++;set('reconnecting',e.detail)}else if(s==='RETRYING'){attempt++;set('error',e.detail)}else if(s==='OFFLINE')set('offline')});
    window.addEventListener('trooth-realtime-reconnect',function(e){attempt++;set('reconnecting',e.detail)});
    window.addEventListener('trooth-realtime-reconnecting',function(e){attempt++;set('reconnecting',e.detail)});
    window.addEventListener('trooth-message-incoming',signalLive);
    window.addEventListener('trooth-notification-incoming',signalLive);
    window.addEventListener('trooth-live-refresh-complete',signalLive);
    window.addEventListener('online',recover);
    window.addEventListener('offline',function(){clearTimeout(timer);timer=null;set('offline')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online())recover();else clearTimeout(timer)});
    window.addEventListener('pageshow',function(){if(online())recover()});
    window.addEventListener('focus',function(){if(online()&&!document.hidden)recover()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
