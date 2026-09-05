// Trooth Social Independent — unified realtime connection panel v7
(function(){
  function boot(){
    if(window.__troothLiveConnectionPanel)return;window.__troothLiveConnectionPanel=true;
    var el=document.createElement('div');el.id='trooth-connection-panel';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.style='position:fixed;left:12px;bottom:14px;z-index:99999;background:#fff;color:#173b29;padding:7px 11px;border-radius:999px;box-shadow:0 4px 18px #0002;font:700 11px system-ui;transition:.25s;cursor:default;max-width:calc(100vw - 24px)';
    document.body.appendChild(el);
    var last='',state='connecting',timer=null,moduleErrors=0;
    function set(next,detail){
      state=next;
      var text='⚪ Reconnecting…',color='#718276',title='Realtime connection is being restored';
      if(next==='connected'){text='🟢 Trooth Live';color='#40916c';title='Realtime connection active'}
      else if(next==='connecting'){text='🟡 Connecting…';color='#9a7b19';title='Connecting to Trooth Live'}
      else if(next==='offline'){text='⚪ Offline';color='#718276';title='Internet connection is offline'}
      else if(next==='retrying'){var n=detail&&detail.attempt?(' #'+detail.attempt):'';text='🟠 Retrying…'+n;color='#a55b16';title='Trooth is retrying the realtime connection'+(n?' — attempt '+detail.attempt:'')}
      else if(next==='reconnecting'){text='⚪ Reconnecting…';color='#718276';title='Realtime connection is being restored'}
      if(moduleErrors&&next==='connected')title+=' • '+moduleErrors+' live module load error'+(moduleErrors===1?'':'s');
      if(last===text&&el.title===title)return;last=text;el.textContent=text;el.style.color=color;el.title=title;el.setAttribute('aria-label',title);
    }
    function online(){return navigator.onLine!==false}
    function temporaryConnecting(){
      clearTimeout(timer);
      if(!online()){set('offline');return}
      if(state==='connected')return;
      set('connecting');
      timer=setTimeout(function(){if(online()&&state==='connecting')set('retrying',{attempt:1})},5000);
    }
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='SUBSCRIBED')set('connected');else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='RETRYING')set('retrying',e.detail);else if(s==='CLOSED'||s==='RECONNECTING')set('reconnecting');else if(s==='OFFLINE')set('offline');else if(s==='SIGNED_OUT')set('offline');else set('connecting')});
    window.addEventListener('trooth-realtime-connected',function(){clearTimeout(timer);set('connected')});
    window.addEventListener('trooth-module-error',function(e){var src=e.detail&&e.detail.src;if(!src||/^https:\/\/cdn\.jsdelivr\.net\//.test(src))return;if(e.detail&&e.detail.final)moduleErrors++;if(online())set('retrying',{attempt:moduleErrors||1})});
    window.addEventListener('trooth-module-loaded',function(e){var d=e.detail||{};if(d.retry&&moduleErrors>0)moduleErrors--;if(online()&&state==='retrying'&&moduleErrors===0)set('connecting')});
    window.addEventListener('trooth-message-incoming',function(){clearTimeout(timer);set('connected')});
    window.addEventListener('trooth-notification-incoming',function(){clearTimeout(timer);set('connected')});
    window.addEventListener('online',temporaryConnecting);
    window.addEventListener('offline',function(){clearTimeout(timer);set('offline')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden)temporaryConnecting()});
    window.addEventListener('pageshow',temporaryConnecting);
    set(online()?'connecting':'offline');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
