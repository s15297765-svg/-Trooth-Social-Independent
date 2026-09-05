// Trooth Social Independent — realtime notification/message pulse
(function(){
  function boot(){
    if(window.__troothRealtimeAlerts)return; window.__troothRealtimeAlerts=true;
    var badge=document.createElement('div');badge.id='trooth-alert-pulse';badge.textContent='● LIVE';
    badge.style.cssText='position:fixed;right:12px;top:104px;z-index:9996;display:none;padding:6px 10px;border-radius:999px;background:#40916c;color:#fff;font:800 11px system-ui;box-shadow:0 5px 16px #0002';
    document.body.appendChild(badge);
    function pulse(msg){badge.textContent='● '+msg;badge.style.display='block';clearTimeout(pulse.t);pulse.t=setTimeout(function(){badge.style.display='none'},2200)}
    function connect(){
      if(!window.troothSupabase||!navigator.onLine)return;
      try{
        var c=window.troothSupabase.channel('trooth-realtime-alerts');
        c.on('broadcast',{event:'trooth-alert'},function(p){pulse((p&&p.payload&&p.payload.text)||'New activity')});
        c.subscribe(function(status){
          if(status==='SUBSCRIBED') window.troothRealtimeAlertChannel=c;
        });
      }catch(e){}
    }
    window.addEventListener('online',connect);document.addEventListener('visibilitychange',function(){if(!document.hidden)connect()});
    setTimeout(connect,1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
