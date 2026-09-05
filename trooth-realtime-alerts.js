// Trooth Social Independent — realtime notification/message pulse
(function(){
  function boot(){
    if(window.__troothRealtimeAlerts)return; window.__troothRealtimeAlerts=true;
    var badge=document.createElement('div');badge.id='trooth-alert-pulse';badge.textContent='● LIVE';
    badge.style.cssText='position:fixed;right:12px;top:104px;z-index:9996;display:none;padding:6px 10px;border-radius:999px;background:#40916c;color:#fff;font:800 11px system-ui;box-shadow:0 5px 16px #0002';
    document.body.appendChild(badge);
    function pulse(msg){badge.textContent='● '+msg;badge.style.display='block';clearTimeout(pulse.t);pulse.t=setTimeout(function(){badge.style.display='none'},2200)}
    var channel=null,connecting=false,retry=0,timer=null;
    function connect(){
      if(!window.troothSupabase||!navigator.onLine||connecting||channel)return;
      connecting=true;
      try{
        channel=window.troothSupabase.channel('trooth-realtime-alerts');
        channel.on('broadcast',{event:'trooth-alert'},function(p){pulse((p&&p.payload&&p.payload.text)||'New activity')});
        channel.subscribe(function(status){
          connecting=false;
          if(status==='SUBSCRIBED'){retry=0;window.troothRealtimeAlertChannel=channel;window.dispatchEvent(new CustomEvent('trooth-alerts-connected'))}
          if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){channel=null;window.troothRealtimeAlertChannel=null;schedule()}
        });
      }catch(e){connecting=false;channel=null;schedule()}
    }
    function schedule(){if(!navigator.onLine)return;clearTimeout(timer);retry=Math.min(retry+1,6);timer=setTimeout(connect,Math.min(1000*Math.pow(2,retry),30000))}
    function reconnect(){if(channel&&window.troothSupabase){try{window.troothSupabase.removeChannel(channel)}catch(e){}}channel=null;window.troothRealtimeAlertChannel=null;connecting=false;retry=0;connect()}
    window.addEventListener('online',function(){pulse('Connection restored');reconnect()});
    window.addEventListener('offline',function(){clearTimeout(timer);if(channel&&window.troothSupabase){try{window.troothSupabase.removeChannel(channel)}catch(e){}}channel=null;window.troothRealtimeAlertChannel=null;connecting=false});
    window.addEventListener('trooth-realtime-reconnect',reconnect);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)connect()});
    window.addEventListener('trooth-message-incoming',function(){pulse('New message')});
    window.addEventListener('trooth-notification-incoming',function(){pulse('New notification')});
    setTimeout(connect,1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
