// Trooth Social Independent — realtime resilience bridge
(function(){
  function boot(){
    if(window.__troothRealtimeResilience)return;window.__troothRealtimeResilience=true;
    var timer=null,backoff=1000;
    function refresh(){
      window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-profile-social-refresh'));
    }
    function reconnect(){
      if(!navigator.onLine)return;
      try{if(window.__troothGlobalChannel&&window.troothSupabase){window.troothSupabase.removeChannel(window.__troothGlobalChannel);window.__troothGlobalChannel=null}}catch(e){}
      window.__troothGlobalRealtime=false;
      window.dispatchEvent(new CustomEvent('trooth-realtime-reconnect'));
      refresh();
      backoff=Math.min(backoff*2,30000);
    }
    window.addEventListener('online',function(){backoff=1000;clearTimeout(timer);timer=setTimeout(reconnect,700)});
    window.addEventListener('offline',function(){clearTimeout(timer);window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:'OFFLINE'}}))});
    window.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&navigator.onLine){clearTimeout(timer);timer=setTimeout(function(){refresh();reconnect()},600)}});
    window.addEventListener('trooth-realtime-connected',function(){clearTimeout(timer);backoff=1000});
    window.addEventListener('trooth-realtime-reconnect',function(){clearTimeout(timer);timer=setTimeout(reconnect,backoff)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
