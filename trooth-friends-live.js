/* Trooth Social Independent — live Friends / Following sync v2 */
(function(){
  function boot(){
    const sb=window.troothSupabase;if(!sb?.auth)return;
    sb.auth.getUser().then(({data})=>{
      const user=data?.user;if(!user)return;
      let timer=null,busy=false,pending=false;
      const refresh=async()=>{
        if(busy){pending=true;return} busy=true;
        try{
          if(location.pathname.toLowerCase().endsWith('friends.html')&&typeof loadSocial==='function'&&typeof loadStats==='function'){
            await loadSocial();await loadStats();
            if(typeof renderPeople==='function'&&document.getElementById('discover')?.classList.contains('active'))renderPeople();
          }
          window.dispatchEvent(new CustomEvent('trooth-friends-social-update'));
        }catch(e){}finally{busy=false;if(pending){pending=false;clearTimeout(timer);timer=setTimeout(refresh,100)}}
      };
      const channel=sb.channel('trooth-friends-live-'+user.id)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+user.id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+user.id},refresh)
        .subscribe(status=>{window.troothFriendsLiveStatus=status});
      window.addEventListener('beforeunload',()=>{try{sb.removeChannel(channel)}catch(e){}},{once:true});
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
