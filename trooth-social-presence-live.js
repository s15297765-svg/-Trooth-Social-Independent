// Trooth Social Independent — live presence layer
(function(){
  function boot(){
    if(window.__troothSocialPresenceLive)return;window.__troothSocialPresenceLive=true;
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    var ch=sb.channel('trooth-presence-live');
    ch.on('presence',{event:'sync'},function(){
      var state=ch.presenceState();
      window.dispatchEvent(new CustomEvent('trooth-presence-sync',{detail:{state:state}}));
    });
    ch.on('presence',{event:'join'},function(e){
      window.dispatchEvent(new CustomEvent('trooth-presence-join',{detail:e}));
    });
    ch.on('presence',{event:'leave'},function(e){
      window.dispatchEvent(new CustomEvent('trooth-presence-leave',{detail:e}));
    });
    sb.auth.getUser().then(function(r){
      var u=r.data&&r.data.user;if(!u)return;
      ch.subscribe(function(status){
        if(status==='SUBSCRIBED'){
          ch.track({user_id:u.id,online_at:new Date().toISOString(),page:location.pathname});
          window.dispatchEvent(new CustomEvent('trooth-presence-online',{detail:{user_id:u.id}}));
        }
      });
    });
    window.addEventListener('beforeunload',function(){ch.untrack().catch(function(){});});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,1600)},{once:true});else setTimeout(boot,1600);
})();
