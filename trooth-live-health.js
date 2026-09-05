// Trooth Social Independent — resilient realtime health indicator v9
(function(){
  function boot(){
    if(window.__troothLiveHealthV9)return;window.__troothLiveHealthV9=true;
    var el=document.createElement('div');el.id='trooth-live-health';el.textContent='● LIVE';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.setAttribute('aria-atomic','true');
    el.style='position:fixed;top:68px;right:12px;z-index:99998;background:#fff;padding:6px 10px;border-radius:999px;box-shadow:0 4px 16px #0002;font:700 11px system-ui;color:#718276;transition:.2s;cursor:default;max-width:calc(100vw - 24px)';
    document.body.appendChild(el);
    var state='',attempt=0,timer=null,watchdog=null,lastSignal=0,lastConnected=0,staleAfter=30000;
    function set(next,detail){
      var map={live:['● LIVE','#40916c','Trooth realtime is connected'],connecting:['● CONNECTING…','#9a7b19','Trooth realtime is connecting'],offline:['○ OFFLINE','#718276','You are offline'],error:['○ RETRYING…','#9a7b19','Trooth realtime is retrying'],reconnecting:['○ RECONNECTING…','#9a7b19','Trooth realtime is reconnecting']};
      var x=map[next]||map.connecting, suffix=detail&&detail.attempt?' — attempt '+detail.attempt:'';
      if(state===next&&el.title===x[2]+suffix)return;state=next;el.textContent=x[0];el.style.color=x[1];el.title=x[2]+suffix;el.setAttribute('aria-label',x[2]+suffix);el.dataset.state=next;
    }
    function online(){return navigator.onLine!==false}
    function recover(){clearTimeout(timer);timer=null;if(!online()){set('offline');return}set('connecting');timer=setTimeout(function(){if(online()&&state==='connecting'){attempt++;set('error',{attempt:attempt})}},5000)}
    function signalLive(){var now=Date.now();if(now-lastSignal<250)return;lastSignal=now;lastConnected=now;attempt=0;clearTimeout(timer);timer=null;set('live')}
    function startWatchdog(){clearInterval(watchdog);watchdog=setInterval(function(){if(!online()){set('offline');return}if(state==='live'&&lastConnected&&Date.now()-lastConnected>staleAfter){attempt++;recover()}},10000)}
    function onRealtimeStatus(e){var d=e.detail||{},s=d.status;if(s==='SUBSCRIBED')signalLive();else if(s==='CONNECTING'){if(state==='live'&&Date.now()-lastConnected<8000)return;recover()}else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'){attempt++;set('error',{attempt:attempt,force:true})}else if(s==='CLOSED'||s==='RECONNECTING'){attempt++;set('reconnecting',{attempt:attempt,force:true})}else if(s==='RETRYING'){set('error',{attempt:d.attempt||++attempt,force:true})}else if(s==='OFFLINE')set('offline')}
    set(online()?'connecting':'offline');startWatchdog();
    window.addEventListener('trooth-realtime-connected',signalLive);
    window.addEventListener('trooth-realtime-status',onRealtimeStatus);
    window.addEventListener('trooth-realtime-reconnect',function(){attempt++;set('reconnecting',{attempt:attempt,force:true})});
    window.addEventListener('trooth-realtime-reconnecting',function(){attempt++;set('reconnecting',{attempt:attempt,force:true})});
    window.addEventListener('trooth-message-incoming',signalLive);
    window.addEventListener('trooth-notification-incoming',signalLive);
    window.addEventListener('trooth-live-refresh-complete',signalLive);
    window.addEventListener('online',recover);
    window.addEventListener('offline',function(){clearTimeout(timer);timer=null;set('offline')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online()){if(state!=='live')recover()}else clearTimeout(timer)});
    window.addEventListener('pageshow',function(){if(online()&&state!=='live')recover()});
    window.addEventListener('focus',function(){if(online()&&!document.hidden&&state!=='live')recover()});
    window.addEventListener('beforeunload',function(){clearTimeout(timer);clearInterval(watchdog)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
