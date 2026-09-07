// Trooth Social Independent — unified network UX v3
(function(){
  if(window.__troothNetworkUXV3)return;
  window.__troothNetworkUXV3=true;
  var timer=0;
  var pending={};
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
  function schedule(kind,payload){
    pending[kind]=payload||{};
    clearTimeout(timer);
    timer=setTimeout(function(){
      var p=pending; pending={};
      emit('trooth-network-ui-refresh',p);
      emit('trooth-profile-social-refresh',p);
      emit('trooth-friends-refresh',p);
      emit('trooth-notifications-refresh',p);
      emit('trooth-messages-refresh',p);
    },180);
  }
  function boot(){
    var sb=window.troothSupabase;
    if(!sb)return;
    var channel=sb.channel('trooth-network-ux-v3')
      .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){schedule('friend_request',p)})
      .on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){schedule('connection',p)})
      .on('postgres_changes',{event:'*',schema:'public',table:'messages'},function(p){schedule('message',p)})
      .on('postgres_changes',{event:'*',schema:'public',table:'notifications'},function(p){schedule('notification',p)})
      .subscribe(function(status){emit('trooth-network-ux-status',{status:status})});
    window.addEventListener('beforeunload',function(){try{sb.removeChannel(channel)}catch(e){}});
    emit('trooth-network-ux-ready');
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();