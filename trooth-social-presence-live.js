// Trooth Social Independent — live presence layer
(function(){
  function boot(){
    if(window.__troothSocialPresenceLive)return;window.__troothSocialPresenceLive=true;
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    var ch=null,user=null,retry=null,attempt=0;
    function emit(status,extra){window.dispatchEvent(new CustomEvent('trooth-presence-status',{detail:Object.assign({status:status,attempt:attempt},extra||{})}))}
    function clear(){if(retry){clearTimeout(retry);retry=null}if(ch&&sb.removeChannel){try{sb.removeChannel(ch)}catch(e){}}ch=null}
    function connect(){if(!user||!navigator.onLine||ch)return;attempt++;ch=sb.channel('trooth-presence-live');
      ch.on('presence',{event:'sync'},function(){window.dispatchEvent(new CustomEvent('trooth-presence-sync',{detail:{state:ch.presenceState()}}))});
      ch.on('presence',{event:'join'},function(e){window.dispatchEvent(new CustomEvent('trooth-presence-join',{detail:e}))});
      ch.on('presence',{event:'leave'},function(e){window.dispatchEvent(new CustomEvent('trooth-presence-leave',{detail:e}))});
      ch.subscribe(function(status){if(status==='SUBSCRIBED'){attempt=0;ch.track({user_id:user.id,online_at:new Date().toISOString(),page:location.pathname});emit('ONLINE');window.dispatchEvent(new CustomEvent('trooth-presence-online',{detail:{user_id:user.id}}))}else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){emit('RETRYING');schedule()}})
    }
    function schedule(){if(!navigator.onLine||retry)return;var wait=Math.min(1000*Math.pow(2,Math.min(attempt,5)),30000);retry=setTimeout(function(){retry=null;clear();connect()},wait)}
    navigator.onLine||emit('OFFLINE');
    sb.auth.getUser().then(function(r){user=r.data&&r.data.user;if(user)connect()});
    sb.auth.onAuthStateChange(function(event,session){if(event==='SIGNED_OUT'){clear();user=null;emit('OFFLINE')}else if(session&&session.user){user=session.user;clear();attempt=0;connect()}});
    window.addEventListener('online',function(){clear();attempt=0;emit('RECONNECTING');connect()});
    window.addEventListener('offline',function(){clear();emit('OFFLINE')});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&navigator.onLine&&user&&!ch){attempt=0;connect()}});
    window.addEventListener('pagehide',clear);
    window.addEventListener('pageshow',function(){if(navigator.onLine&&user&&!ch){attempt=0;connect()}});
    window.addEventListener('beforeunload',clear);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,1600)},{once:true});else setTimeout(boot,1600);
})();
