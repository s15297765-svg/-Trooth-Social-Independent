// Trooth Social Independent — global realtime refresh bridge
(function(){
  function boot(){
    if(window.__troothGlobalRealtime)return;window.__troothGlobalRealtime=true;
    var sb=window.troothSupabase;if(!sb)return;
    function pulse(type,payload){
      window.dispatchEvent(new CustomEvent('trooth-'+type+'-incoming',{detail:payload}));
      window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));
    }
    sb.auth.getUser().then(function(r){
      var u=r.data&&r.data.user;if(!u)return;
      if(window.__troothGlobalChannel){try{sb.removeChannel(window.__troothGlobalChannel)}catch(e){}}
      var c=sb.channel('trooth-global-realtime-'+u.id);
      c.on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+u.id},function(p){pulse('notification',p)});
      c.on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},function(p){pulse('message',p)});
      c.on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(p){pulse('post',p)});
      c.subscribe();window.__troothGlobalChannel=c;
    });
    window.addEventListener('online',function(){setTimeout(boot,900)});
  }
  function start(){setTimeout(boot,2600)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
