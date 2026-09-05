// Trooth — realtime Friends / Follow / Request chain
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothFriendRealtimeBooted)return;
    window.troothFriendRealtimeBooted=true;
    var uid=null,channel=null,timer=null;
    async function getUid(){
      var r=await sb.auth.getUser();
      return r.data&&r.data.user?r.data.user.id:null;
    }
    function refresh(){
      clearTimeout(timer);
      timer=setTimeout(async function(){
        var id=await getUid();if(!id)return;uid=id;
        window.dispatchEvent(new CustomEvent('trooth-social-refresh',{detail:{userId:id}}));
        ['trooth-friends-refresh','trooth-profile-people-refresh','trooth-profile-social-refresh','trooth-navigation-refresh'].forEach(function(n){window.dispatchEvent(new CustomEvent(n));});
      },120);
    }
    async function subscribe(){
      var id=await getUid();if(!id)return;
      uid=id;
      if(channel){try{await sb.removeChannel(channel)}catch(e){}channel=null;}
      channel=sb.channel('trooth-friend-realtime-chain-'+id)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+id},refresh)
        .subscribe(function(status){if(status==='SUBSCRIBED')refresh()});
      window.troothFriendRealtimeChannel=channel;
    }
    subscribe();
    sb.auth.onAuthStateChange(function(event){
      if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='USER_DELETED'){
        clearTimeout(timer);
        setTimeout(function(){subscribe()},50);
      }
    });
    window.addEventListener('beforeunload',function(){
      clearTimeout(timer);
      if(channel){try{sb.removeChannel(channel)}catch(e){}}
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
