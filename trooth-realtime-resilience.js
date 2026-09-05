// Trooth Social Independent — realtime resilience bridge
(function(){
  function boot(){
    if(window.__troothRealtimeResilience)return;window.__troothRealtimeResilience=true;
    var timer=null,backoff=1000,reconnecting=false,lastRefresh=0;
    function signal(status,extra){window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:Object.assign({status:status},extra||{})}))}
    function refresh(reason){var now=Date.now();if(now-lastRefresh<800)return;lastRefresh=now;['trooth-feed-refresh','trooth-messages-refresh','trooth-notifications-refresh','trooth-friends-refresh','trooth-profile-social-refresh'].forEach(function(name){window.dispatchEvent(new CustomEvent(name,{detail:{reason:reason||'resilience'}}))})}
    function reconnect(reason){if(!navigator.onLine||reconnecting)return;reconnecting=true;signal('RECONNECTING',{reason:reason||'recovery'});try{if(window.__troothGlobalChannel&&window.troothSupabase){window.troothSupabase.removeChannel(window.__troothGlobalChannel);window.__troothGlobalChannel=null}}catch(e){}window.__troothGlobalRealtime=false;window.dispatchEvent(new CustomEvent('trooth-realtime-reconnect'));refresh(reason||'reconnect');setTimeout(function(){reconnecting=false},1200);backoff=Math.min(backoff*2,30000)}
    function schedule(ms,reason){clearTimeout(timer);timer=setTimeout(function(){reconnect(reason||'scheduled')},ms)}
    window.addEventListener('online',function(){backoff=1000;reconnecting=false;signal('RECONNECTING',{reason:'online'});schedule(900,'online')});
    window.addEventListener('offline',function(){clearTimeout(timer);reconnecting=false;signal('OFFLINE',{reason:'network'})});
    window.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&navigator.onLine){refresh('visibility');schedule(1200,'visibility')}});
    window.addEventListener('pageshow',function(){if(navigator.onLine){refresh('pageshow');schedule(800,'pageshow')}});
    window.addEventListener('pagehide',function(){clearTimeout(timer)});
    window.addEventListener('focus',function(){if(navigator.onLine){refresh('focus');schedule(1500,'focus')}});
    window.addEventListener('trooth-realtime-connected',function(){clearTimeout(timer);backoff=1000;reconnecting=false;signal('LIVE',{reason:'connected'})});
    window.addEventListener('trooth-realtime-reconnect',function(){if(navigator.onLine&&!reconnecting)schedule(backoff,'requested')});
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if((s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='CLOSED')&&navigator.onLine)schedule(backoff,s.toLowerCase())});
    document.addEventListener('visibilitychange',function(){if(document.hidden)clearTimeout(timer)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
