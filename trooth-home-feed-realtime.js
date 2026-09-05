// Trooth Social Independent — Home Feed Realtime
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb) return setTimeout(boot,300);
    if(window.troothHomeFeedRealtimeReady) return;
    window.troothHomeFeedRealtimeReady=true;
    function refresh(){
      if(typeof window.loadPosts==='function') window.loadPosts();
      window.dispatchEvent(new CustomEvent('trooth-home-feed-refresh'));
    }
    var channel=sb.channel('trooth-home-feed-realtime')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},refresh)
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'posts'},refresh)
      .on('postgres_changes',{event:'DELETE',schema:'public',table:'posts'},refresh)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'post_likes'},refresh)
      .on('postgres_changes',{event:'DELETE',schema:'public',table:'post_likes'},refresh)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'comments'},refresh)
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'comments'},refresh)
      .on('postgres_changes',{event:'DELETE',schema:'public',table:'comments'},refresh)
      .subscribe();
    window.troothHomeFeedRealtimeChannel=channel;
  }
  if(window.troothSupabase) boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
