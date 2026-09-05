// Trooth — realtime Friends / Follow / Request chain
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var uid=null;
    async function refresh(){
      var r=await sb.auth.getUser();if(!r.data||!r.data.user)return;uid=r.data.user.id;
      window.dispatchEvent(new CustomEvent('trooth-social-refresh',{detail:{userId:uid}}));
      ['trooth-friends-refresh','trooth-profile-people-refresh','trooth-profile-social-refresh','trooth-navigation-refresh'].forEach(function(n){window.dispatchEvent(new CustomEvent(n));});
    }
    async function subscribe(){
      var r=await sb.auth.getUser();if(!r.data||!r.data.user)return;uid=r.data.user.id;
      if(window.troothFriendRealtimeChannel)return;
      var ch=sb.channel('trooth-friend-realtime-chain-'+uid)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+uid},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+uid},refresh)
        .subscribe(function(status){if(status==='SUBSCRIBED')refresh()});
      window.troothFriendRealtimeChannel=ch;
    }
    subscribe();
    sb.auth.onAuthStateChange(function(){window.troothFriendRealtimeChannel=null;setTimeout(subscribe,0)});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
