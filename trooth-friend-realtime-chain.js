// Trooth — optimized realtime Friends / Follow / Request chain v2
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothFriendRealtimeBooted)return;
    window.troothFriendRealtimeBooted=true;
    var uid=null,channel=null,timer=null,subTimer=null,started=true,lastSignal=0;
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
        if(!uid||!started)return;
        var now=Date.now();if(now-lastSignal<140)return;lastSignal=now;
        var detail={userId:uid,source:'friend-realtime-chain'};
        window.dispatchEvent(new CustomEvent('trooth-social-refresh',{detail:detail}));
        ['trooth-friends-refresh','trooth-profile-people-refresh','trooth-profile-social-refresh','trooth-navigation-refresh'].forEach(function(n){window.dispatchEvent(new CustomEvent(n,{detail:detail}))});
      },160);
    }
    async function subscribe(){
      clearTimeout(subTimer);if(!started)return;
      var id=await getUid();
      if(!started)return;
      clearChannel();
      if(!id){uid=null;return}
      uid=id;
      var name='trooth-friend-realtime-chain-'+id;
      channel=sb.channel(name)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'follower_id=eq.'+id},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+id},refresh)
        .subscribe(function(status){if(status==='SUBSCRIBED')refresh();else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')scheduleSubscribe(900)});
      window.troothFriendRealtimeChannel=channel;
    }
    function scheduleSubscribe(delay){clearTimeout(subTimer);if(started)subTimer=setTimeout(subscribe,delay==null?80:delay)}
    subscribe();
    sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||!session){uid=null;clearTimeout(timer);clearChannel();return}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')scheduleSubscribe(80);
    });
    window.addEventListener('online',function(){scheduleSubscribe(120)});
    window.addEventListener('beforeunload',function(){started=false;clearTimeout(timer);clearTimeout(subTimer);clearChannel()},{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
