/* Trooth Social Independent — live notification/message sync */
(function(){
  function boot(){
    const sb=window.troothSupabase;
    if(!sb || !sb.auth) return;
    sb.auth.getUser().then(({data})=>{
      const user=data&&data.user;
      if(!user) return;
      window.troothLiveUser=user;
      const channel=sb.channel('trooth-live-'+user.id)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-notification',{detail:payload.new}));
          if(typeof window.refreshTroothNotifications==='function') window.refreshTroothNotifications();
        })
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-message',{detail:payload.new}));
          if(typeof window.refreshTroothMessages==='function') window.refreshTroothMessages();
        })
        .subscribe();
      window.troothLiveChannel=channel;
    });
  }
  if(window.troothSupabase) boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
