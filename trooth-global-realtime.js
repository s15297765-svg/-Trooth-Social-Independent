// Trooth Social Independent — resilient global realtime event bridge v3
(function(){
  function boot(){
    if(window.__troothGlobalRealtimeBootedV3)return;window.__troothGlobalRealtimeBootedV3=true;
    var sb=window.troothSupabase;if(!sb)return;
    var retry=null,connecting=false,online=navigator.onLine!==false,attempt=0,sessionTimer=null,reconnectTimer=null,lastRefresh={};
    function signal(name,detail){
      var refreshEvent=/^(trooth-(notifications|messages|feed|friends|profile-social)-refresh)$/.test(name);
      if(refreshEvent){var now=Date.now();if(lastRefresh[name]&&now-lastRefresh[name]<300)return;lastRefresh[name]=now}
      window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}));
    }
    function clearRetry(){if(retry){clearTimeout(retry);retry=null}}
    function clearReconnect(){if(reconnectTimer){clearTimeout(reconnectTimer);reconnectTimer=null}}
    function clearChannel(){clearRetry();clearReconnect();if(window.__troothGlobalChannel){try{sb.removeChannel(window.__troothGlobalChannel)}catch(e){}window.__troothGlobalChannel=null}}
    function schedule(){if(!online||retry||connecting)return;attempt=Math.min(attempt+1,6);var ms=Math.min(30000,1500*Math.pow(2,attempt-1));signal('trooth-realtime-status',{status:'RETRYING',delay:ms,attempt:attempt});retry=setTimeout(function(){retry=null;connect()},ms)}
    function queueConnect(ms){clearReconnect();if(!online||connecting)return;reconnectTimer=setTimeout(function(){reconnectTimer=null;connect()},ms||300)}
    function connect(){
      if(!online||connecting||!sb.auth)return;connecting=true;clearRetry();clearReconnect();
      sb.auth.getUser().then(function(r){
        var u=r.data&&r.data.user;
        if(!u){connecting=false;clearChannel();attempt=0;signal('trooth-realtime-status',{status:'SIGNED_OUT'});return}
        clearChannel();signal('trooth-realtime-status',{status:'CONNECTING'});
        try{
          var c=sb.channel('trooth-global-'+u.id)
            .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+u.id},function(p){signal('trooth-notification-incoming',p.new);signal('trooth-notifications-refresh',p.new)})
            .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},function(p){signal('trooth-message-incoming',p.new);signal('trooth-messages-refresh',p.new)})
            .on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){signal('trooth-feed-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},function(p){signal('trooth-feed-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){signal('trooth-friends-refresh',p);signal('trooth-profile-social-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){signal('trooth-friends-refresh',p);signal('trooth-profile-social-refresh',p)})
            .on('postgres_changes',{event:'*',schema:'public',table:'profiles'},function(p){signal('trooth-profile-social-refresh',p)})
            .subscribe(function(status){
              connecting=false;signal('trooth-realtime-status',{status:status});
              if(status==='SUBSCRIBED'){attempt=0;clearRetry();clearReconnect();signal('trooth-realtime-connected')}
              else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED')schedule();
            });
          window.__troothGlobalChannel=c;
        }catch(e){connecting=false;schedule()}
      }).catch(function(){connecting=false;schedule()});
    }
    function refreshSession(){if(!online||!sb.auth)return;sb.auth.getSession().then(function(r){var s=r.data&&r.data.session;if(s&&!window.__troothGlobalChannel&&!connecting)queueConnect(0)}).catch(function(){})}
    connect();
    window.addEventListener('online',function(){online=true;attempt=0;signal('trooth-realtime-status',{status:'RECONNECTING'});clearChannel();queueConnect(400)});
    window.addEventListener('offline',function(){online=false;clearChannel();signal('trooth-realtime-status',{status:'OFFLINE'})});
    document.addEventListener('visibilitychange',function(){
      if(!document.hidden&&online){clearChannel();queueConnect(500)}else{clearRetry();clearReconnect()}
    });
    window.addEventListener('pageshow',function(){if(online&&!document.hidden){clearChannel();queueConnect(400)}});
    window.addEventListener('trooth-realtime-reconnect',function(){attempt=0;clearChannel();queueConnect(0)});
    window.addEventListener('trooth-auth-changed',function(){attempt=0;clearChannel();queueConnect(300)});
    if(sb.auth.onAuthStateChange)sb.auth.onAuthStateChange(function(event){if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'){clearChannel();queueConnect(250)}else if(event==='SIGNED_OUT'){clearChannel();signal('trooth-realtime-status',{status:'SIGNED_OUT'})}});
    sessionTimer=setInterval(refreshSession,120000);
    window.addEventListener('beforeunload',function(){clearChannel();if(sessionTimer)clearInterval(sessionTimer)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2200)},{once:true});else setTimeout(boot,2200);
})();
