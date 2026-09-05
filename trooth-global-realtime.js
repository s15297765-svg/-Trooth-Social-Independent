// Trooth Social Independent — global realtime event bridge
(function(){
  function boot(){
    if(window.__troothGlobalRealtime)return;window.__troothGlobalRealtime=true;
    var sb=window.troothSupabase;if(!sb)return;
    function signal(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    sb.auth.getUser().then(function(r){
      var u=r.data&&r.data.user;if(!u)return;
      try{if(window.__troothGlobalChannel)sb.removeChannel(window.__troothGlobalChannel)}catch(e){}
      var c=sb.channel('trooth-global-'+u.id)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+u.id},function(p){signal('trooth-notification-incoming',p.new);signal('trooth-notifications-refresh',p.new)})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},function(p){signal('trooth-message-incoming',p.new);signal('trooth-messages-refresh',p.new)})
        .on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){signal('trooth-feed-refresh',p)})
        .subscribe(function(status){if(status==='SUBSCRIBED')signal('trooth-realtime-connected')});
      window.__troothGlobalChannel=c;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2200)},{once:true});else setTimeout(boot,2200);
  window.addEventListener('online',function(){setTimeout(boot,700)});
})();
