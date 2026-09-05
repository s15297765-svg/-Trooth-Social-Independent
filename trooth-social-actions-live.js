// Trooth Social Independent — realtime social actions/counts
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    sb.auth.getUser().then(function(r){
      var uid=r.data&&r.data.user&&r.data.user.id;if(!uid)return;
      var refreshTimer=null;
      function refresh(){
        clearTimeout(refreshTimer);refreshTimer=setTimeout(function(){
          ['trooth-social-refresh','trooth-profile-social-refresh'].forEach(function(e){window.dispatchEvent(new CustomEvent(e));});
        },150);
      }
      var ch=sb.channel('trooth-social-actions-live')
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+uid},refresh)
        .subscribe();
      window.troothSocialActionsChannel=ch;
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();