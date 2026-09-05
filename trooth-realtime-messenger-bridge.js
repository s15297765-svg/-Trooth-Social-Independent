// Trooth — unified realtime messaging + notification bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var userId=null;
    async function getUser(){var r=await sb.auth.getUser();userId=r.data&&r.data.user?r.data.user.id:null;return userId}
    function ping(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    async function refresh(){
      if(!await getUser())return;
      ping('trooth-messages-refresh',{source:'realtime-bridge'});
      ping('trooth-notifications-refresh',{source:'realtime-bridge'});
      ping('trooth-navigation-refresh',{source:'realtime-bridge'});
    }
    async function start(){
      if(!await getUser()||window.troothUnifiedRealtimeChannel)return;
      var ch=sb.channel('trooth-unified-realtime-'+userId)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+userId},function(e){ping('trooth-message-incoming',e.new);refresh()})
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'messages',filter:'receiver_id=eq.'+userId},function(e){ping('trooth-message-updated',e.new);refresh()})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+userId},function(e){ping('trooth-notification-incoming',e.new);refresh()})
        .subscribe(function(status){if(status==='SUBSCRIBED')refresh()});
      window.troothUnifiedRealtimeChannel=ch;
    }
    start();
    sb.auth.onAuthStateChange(function(){window.troothUnifiedRealtimeChannel=null;setTimeout(start,0)});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
