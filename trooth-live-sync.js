/* Trooth Social Independent — live notification/message/news/sports sync */
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
        .on('postgres_changes',{event:'*',schema:'public',table:'news_stories'},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-news-update',{detail:payload}));
          if(location.pathname.toLowerCase().includes('news.html')) location.reload();
        })
        .on('postgres_changes',{event:'*',schema:'public',table:'sports_stories'},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-sports-update',{detail:payload}));
          if(location.pathname.toLowerCase().includes('sports.html')) location.reload();
        })
        .subscribe((status)=>{
          window.troothLiveStatus=status;
          window.dispatchEvent(new CustomEvent('trooth-live-status',{detail:status}));
        });
      window.troothLiveChannel=channel;
    });
  }
  if(window.troothSupabase) boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
