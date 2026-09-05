// Trooth Social Independent — live presence bridge
(function(){
  function boot(){
    if(window.__troothPresenceBridge)return;window.__troothPresenceBridge=true;
    var sb=window.troothSupabase, channel=null, uid=null;
    function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
    function cleanup(){if(channel&&sb){try{sb.removeChannel(channel)}catch(e){}}channel=null}
    async function start(){
      cleanup(); if(!sb)return;
      var r=await sb.auth.getUser().catch(function(){return {data:{user:null}}});
      uid=r.data&&r.data.user&&r.data.user.id; if(!uid)return;
      channel=sb.channel('trooth-presence-live-'+uid);
      channel.on('presence',{event:'sync'},function(){emit('trooth-presence-sync',{state:channel.presenceState()})});
      channel.on('presence',{event:'join'},function(p){emit('trooth-presence-join',p)});
      channel.on('presence',{event:'leave'},function(p){emit('trooth-presence-leave',p)});
      channel.subscribe(async function(status){
        if(status==='SUBSCRIBED'){
          await channel.track({user_id:uid,online_at:new Date().toISOString(),page:location.pathname}).catch(function(){});
          emit('trooth-presence-online',{userId:uid});
        }else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT') emit('trooth-presence-error',{status:status});
      });
    }
    window.addEventListener('trooth-supabase-ready',function(){sb=window.troothSupabase;start()});
    window.addEventListener('trooth-auth-changed',function(){start()});
    document.addEventListener('visibilitychange',function(){if(!channel||!uid)return;channel.track({user_id:uid,online_at:new Date().toISOString(),page:location.pathname,visible:!document.hidden}).catch(function(){})});
    window.addEventListener('beforeunload',cleanup);
    if(sb)start();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
