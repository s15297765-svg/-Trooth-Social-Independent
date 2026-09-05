// Trooth Social Independent — unified realtime connection panel v10
(function(){
  function boot(){
    if(window.__troothLiveConnectionPanelV10)return;window.__troothLiveConnectionPanelV10=true;
    var el=document.createElement('div');el.id='trooth-connection-panel';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.setAttribute('aria-atomic','true');
    el.style='position:fixed;left:12px;bottom:14px;z-index:99999;background:#fff;color:#173b29;padding:7px 11px;border-radius:999px;box-shadow:0 4px 18px #0002;font:700 11px system-ui;transition:.25s;cursor:default;max-width:calc(100vw - 24px);padding-bottom:calc(7px + env(safe-area-inset-bottom))';
    document.body.appendChild(el);
    var last='',state='connecting',timer=null,watchdog=null,moduleErrors=0,lastConnectedAt=0,lastSignal=0;
    function set(next,detail){
      state=next;
      if(next==='connected')lastConnectedAt=Date.now();
      var text='⚪ Reconnecting…',color='#718276',title='Realtime connection is being restored';
      if(next==='connected'){text='🟢 Trooth Live';color='#40916c';title='Realtime connection active'}
      else if(next==='connecting'){text='🟡 Connecting…';color='#9a7b19';title='Connecting to Trooth Live'}
      else if(next==='offline'){text='⚪ Offline';color='#718276';title='Internet connection is offline'}
      else if(next==='retrying'){var n=detail&&detail.attempt?(' #'+detail.attempt):'';text='🟠 Retrying…'+n;color='#a55b16';title='Trooth is retrying the realtime connection'+(n?' — attempt '+detail.attempt:'')}
      else if(next==='reconnecting'){text='⚪ Reconnecting…';color='#718276';title='Realtime connection is being restored'}
      if(moduleErrors&&next==='connected')title+=' • '+moduleErrors+' live module load error'+(moduleErrors===1?'':'s');
      if(last===text&&el.title===title)return;last=text;el.textContent=text;el.style.color=color;el.title=title;el.setAttribute('aria-label',title);el.dataset.state=next;
    }
    function online(){return navigator.onLine!==false}
    function connected(){return state==='connected'&&lastConnectedAt>0&&Date.now()-lastConnectedAt<30000}
    function temporaryConnecting(){
      clearTimeout(timer);
      if(!online()){set('offline');return}
      if(connected())return;
      set('connecting');
      timer=setTimeout(function(){if(online()&&state==='connecting')set('retrying',{attempt:1})},5000);
    }
    function signalConnected(){
      var now=Date.now();if(now-lastSignal<250)return;lastSignal=now;
      clearTimeout(timer);set('connected');
    }
    function startWatchdog(){
      clearInterval(watchdog);
      watchdog=setInterval(function(){
        if(!online()){set('offline');return}
        if(state==='connected'&&lastConnectedAt&&Date.now()-lastConnectedAt>30000)temporaryConnecting();
      },10000);
    }
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='SUBSCRIBED')signalConnected();else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='RETRYING')set('retrying',e.detail);else if(s==='CLOSED'||s==='RECONNECTING')set('reconnecting',e.detail);else if(s==='OFFLINE'||s==='SIGNED_OUT')set('offline');else if(s==='CONNECTING')temporaryConnecting()});
    window.addEventListener('trooth-realtime-connected',signalConnected);
    window.addEventListener('trooth-module-error',function(e){var src=e.detail&&e.detail.src;if(!src||/^https:\/\/cdn\.jsdelivr\.net\//.test(src))return;if(e.detail&&e.detail.final)moduleErrors++;if(online())set('retrying',{attempt:moduleErrors||1})});
    window.addEventListener('trooth-module-loaded',function(e){var d=e.detail||{};if(d.retry&&moduleErrors>0)moduleErrors--;if(online()&&state==='retrying'&&moduleErrors===0)temporaryConnecting()});
    window.addEventListener('trooth-message-incoming',signalConnected);
    window.addEventListener('trooth-notification-incoming',signalConnected);
    window.addEventListener('trooth-live-refresh-complete',signalConnected);
    window.addEventListener('online',temporaryConnecting);
    window.addEventListener('offline',function(){clearTimeout(timer);set('offline')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden)temporaryConnecting();else clearTimeout(timer)});
    window.addEventListener('pageshow',temporaryConnecting);
    window.addEventListener('beforeunload',function(){clearTimeout(timer);clearInterval(watchdog)});
    set(online()?'connecting':'offline');startWatchdog();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
