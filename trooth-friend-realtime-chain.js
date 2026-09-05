// Trooth — optimized realtime Friends / Follow / Request chain
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothFriendRealtimeBooted)return;
    window.troothFriendRealtimeBooted=true;
    var uid=null,channel=null,timer=null,subTimer=null;
    function clearChannel(){
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothFriendRealtimeChannel=null;
    }
    async function getUid(){
      try{var r=await sb.auth.getUser();return r.data&&r.data.user?r.data.user.id:null}catch(e){return null}
    }
    function refresh(){
      clearTimeout(timer);
      timer=setTimeout(function(){
        if(!uid)return;
        var detail={userId:uid,source:'friend-realtime-chain'};
        window.dispatchEvent(new CustomEvent('trooth-social-refresh',{detail:detail}));
        ['trooth-friends-refresh','trooth-profile-people-refresh','trooth-profile-social-refresh','trooth-navigation-refresh'].forEach(function(n){window.dispatchEvent(new CustomEvent(n,{detail:detail}))});
      },160);
    }
    async function subscribe(){
      clearTimeout(subTimer);
      var id=await getUid();
      clearChannel();
      if(!id){uid=null;return}
      uid=id;
      var name='trooth-friend-realtime-chain-'+id;
      channel=sb.channel(name)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+id},refresh)
        .subscribe(function(status){if(status==='SUBSCRIBED')refresh()});
      window.troothFriendRealtimeChannel=channel;
    }
    function scheduleSubscribe(delay){
      clearTimeout(subTimer);
      subTimer=setTimeout(subscribe,delay==null?80:delay);
    }
    subscribe();
    sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||!session){clearTimeout(timer);clearChannel();uid=null;return}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')scheduleSubscribe();
    });
    window.addEventListener('beforeunload',function(){clearTimeout(timer);clearTimeout(subTimer);clearChannel()});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
