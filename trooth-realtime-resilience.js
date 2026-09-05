// Trooth Social Independent — realtime resilience bridge
(function(){
  function boot(){
    if(window.__troothRealtimeResilience)return;window.__troothRealtimeResilience=true;
    var timer=null;
    function refresh(){
      window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
    }
    function reconnect(){
      try{if(window.__troothGlobalChannel && window.troothSupabase){window.troothSupabase.removeChannel(window.__troothGlobalChannel);window.__troothGlobalChannel=null}}catch(e){}
      window.__troothGlobalRealtime=false;
      window.dispatchEvent(new CustomEvent('trooth-realtime-reconnect'));
      refresh();
    }
    window.addEventListener('online',function(){clearTimeout(timer);timer=setTimeout(reconnect,900);});
    window.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){clearTimeout(timer);timer=setTimeout(refresh,500)}});
    window.addEventListener('trooth-realtime-connected',function(){clearTimeout(timer)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
