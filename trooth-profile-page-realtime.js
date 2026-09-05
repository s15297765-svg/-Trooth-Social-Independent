// Trooth — public profile realtime refresh
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var id=new URLSearchParams(location.search).get('id');
    if(!id)return;
    var uidPromise=sb.auth.getUser();
    var refreshTimer=null;
    function refresh(){
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(function(){
        if(typeof window.loadPosts==='function')window.loadPosts();
        if(typeof window.loadStats==='function')window.loadStats();
        if(typeof window.renderActions==='function')window.renderActions();
      },250);
    }
    var channel=sb.channel('trooth-profile-page-'+id)
      .on('postgres_changes',{event:'*',schema:'public',table:'profiles',filter:'id=eq.'+id},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'posts',filter:'user_id=eq.'+id},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'connections'},async function(){
        var r=await uidPromise;var u=r.data&&r.data.user;if(u)refresh();
      })
      .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},async function(){
        var r=await uidPromise;var u=r.data&&r.data.user;if(u)refresh();
      }).subscribe();
    window.troothProfilePageRealtime=channel;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
