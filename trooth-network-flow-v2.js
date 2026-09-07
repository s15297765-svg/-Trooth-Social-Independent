// Trooth Social Independent — unified network flow v2
(function(){
  if(window.__troothNetworkFlowV2)return;
  window.__troothNetworkFlowV2=true;
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
  function boot(){
    var sb=window.troothSupabase;
    if(!sb)return;
    var channel=sb.channel('trooth-network-flow-v2')
      .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){
        emit('trooth-network-refresh',{kind:'friend_request',payload:p});
        emit('trooth-notifications-refresh',{kind:'friend_request',payload:p});
      })
      .on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){
        emit('trooth-network-refresh',{kind:'connection',payload:p});
        emit('trooth-notifications-refresh',{kind:'follow',payload:p});
      })
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},function(p){
        emit('trooth-network-refresh',{kind:'message',payload:p});
        emit('trooth-notifications-refresh',{kind:'message',payload:p});
      })
      .subscribe();
    window.addEventListener('beforeunload',function(){try{sb.removeChannel(channel)}catch(e){}});
    emit('trooth-network-flow-ready');
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();