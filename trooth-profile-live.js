// Trooth Social Independent — live Profile data refresh
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    sb.auth.getUser().then(function(r){
      var user=r.data&&r.data.user;if(!user)return;
      var channel=sb.channel('trooth-profile-live-data')
        .on('postgres_changes',{event:'*',schema:'public',table:'profiles',filter:'id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'posts',filter:'user_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+user.id},refresh)
        .subscribe();
      window.troothProfileLiveChannel=channel;
      function refresh(){
        window.dispatchEvent(new CustomEvent('trooth-profile-data-refresh'));
        if(typeof window.renderProfile==='function') window.renderProfile();
      }
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
