// Trooth Social Independent — Friend / Follow realtime UI bridge v1
(function(){
  if(window.__troothFriendFollowRealtimeV1)return;window.__troothFriendFollowRealtimeV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var me=null,channel=null;
    async function who(){try{var r=await sb.auth.getUser();me=r.data&&r.data.user||null}catch(e){me=null}}
    function refresh(){
      window.dispatchEvent(new CustomEvent('trooth-social-graph-refresh',{detail:{source:'friend-follow-realtime'}}));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'friend-follow-realtime'}}));
    }
    function subscribe(){
      if(channel)try{sb.removeChannel(channel)}catch(e){}
      if(!me)return;
      channel=sb.channel('trooth-friend-follow-live-'+me.id)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(p){var r=p.new||p.old||{};if(r.sender_id===me.id||r.receiver_id===me.id)refresh()})
        .on('postgres_changes',{event:'*',schema:'public',table:'connections'},function(p){var r=p.new||p.old||{};if(r.follower_id===me.id||r.following_id===me.id)refresh()})
        .subscribe();
    }
    who().then(subscribe);
    sb.auth.onAuthStateChange(function(){who().then(subscribe)});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
