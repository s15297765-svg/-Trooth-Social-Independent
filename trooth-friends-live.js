/* Trooth Social Independent — live Friends / Following sync */
(function(){
  function boot(){
    if(!window.troothSupabase||!window.troothSupabase.auth)return;
    const sb=window.troothSupabase;
    sb.auth.getUser().then(({data})=>{
      const user=data&&data.user;if(!user)return;
      const isFriends=location.pathname.toLowerCase().endsWith('friends.html');
      const refresh=()=>{
        window.dispatchEvent(new CustomEvent('trooth-friends-social-update'));
        if(isFriends){clearTimeout(window.troothFriendsRefreshTimer);window.troothFriendsRefreshTimer=setTimeout(()=>location.reload(),450)}
      };
      sb.channel('trooth-friends-live-'+user.id)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+user.id},refresh)
        .subscribe(status=>{window.troothFriendsLiveStatus=status});
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
