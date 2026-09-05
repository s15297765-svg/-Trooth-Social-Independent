// Trooth Social Independent — realtime resilience bridge
(function(){
  function boot(){
    if(window.__troothRealtimeResilience)return;window.__troothRealtimeResilience=true;
    var timer=null,backoff=1000,reconnecting=false,lastRefresh=0;
    function refresh(){
      var now=Date.now();if(now-lastRefresh<800)return;lastRefresh=now;
      ['trooth-feed-refresh','trooth-messages-refresh','trooth-notifications-refresh','trooth-friends-refresh','trooth-profile-social-refresh'].forEach(function(name){window.dispatchEvent(new CustomEvent(name))});
    }
    function reconnect(){
      if(!navigator.onLine||reconnecting)return;
      reconnecting=true;
      try{if(window.__troothGlobalChannel&&window.troothSupabase){window.troothSupabase.removeChannel(window.__troothGlobalChannel);window.__troothGlobalChannel=null}}catch(e){}
      window.__troothGlobalRealtime=false;
      window.dispatchEvent(new CustomEvent('trooth-realtime-reconnect'));
      refresh();
      setTimeout(function(){reconnecting=false},1200);
      backoff=Math.min(backoff*2,30000);
    }
    function schedule(ms){clearTimeout(timer);timer=setTimeout(function(){reconnect()},ms)}
    window.addEventListener('online',function(){backoff=1000;reconnecting=false;schedule(900)});
    window.addEventListener('offline',function(){clearTimeout(timer);reconnecting=false;window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:'OFFLINE'}}))});
    window.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&navigator.onLine){refresh();schedule(1200)}});
    window.addEventListener('trooth-realtime-connected',function(){clearTimeout(timer);backoff=1000;reconnecting=false});
    window.addEventListener('trooth-realtime-reconnect',function(){if(navigator.onLine&&!reconnecting)schedule(backoff)});
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if((s==='CHANNEL_ERROR'||s==='TIMED_OUT')&&navigator.onLine)schedule(backoff)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
