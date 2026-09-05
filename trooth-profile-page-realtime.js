// Trooth — public profile realtime refresh
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var id=new URLSearchParams(location.search).get('id');
    if(!id)return;
    if(window.troothProfilePageRealtime)return;
    var refreshTimer=null;
    var uidPromise=null;
    function refresh(){
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(function(){
        if(typeof window.loadPosts==='function')window.loadPosts();
        if(typeof window.loadStats==='function')window.loadStats();
        if(typeof window.renderActions==='function')window.renderActions();
      },250);
    }
    function refreshForCurrentUser(){
      if(!uidPromise)uidPromise=sb.auth.getUser();
      uidPromise.then(function(r){if(r.data&&r.data.user)refresh()}).catch(function(){});
    }
    var channel=sb.channel('trooth-profile-page-'+id)
      .on('postgres_changes',{event:'*',schema:'public',table:'profiles',filter:'id=eq.'+id},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'posts',filter:'user_id=eq.'+id},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+id},refreshForCurrentUser)
      .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+id},refreshForCurrentUser)
      .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+id},refreshForCurrentUser)
      .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+id},refreshForCurrentUser)
      .subscribe();
    window.troothProfilePageRealtime=channel;
    window.addEventListener('beforeunload',function(){clearTimeout(refreshTimer);try{sb.removeChannel(channel)}catch(e){}});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
