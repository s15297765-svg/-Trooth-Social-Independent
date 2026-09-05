// Trooth Social Independent — Friend Request → Notifications bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothFriendNotificationsBooted)return;
    window.troothFriendNotificationsBooted=true;
    var channel=null,uid=null;
    function cleanup(){if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}}
    async function profileName(id){try{var r=await sb.from('profiles').select('display_name').eq('id',id).maybeSingle();return r.data?.display_name||'Trooth Member'}catch(e){return 'Trooth Member'}}
    async function notify(user_id,actor_id,kind,body){
      if(!user_id||!actor_id||user_id===actor_id)return;
      try{await sb.from('notifications').insert({user_id,actor_id,kind,body,is_read:false})}catch(e){}
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-unread-refresh'));
    }
    async function handle(payload){
      var row=payload?.new||{};if(!row.id||!row.sender_id||!row.receiver_id)return;
      var actor=await profileName(row.sender_id);
      if(payload.eventType==='INSERT'&&row.status==='pending'){
        await notify(row.receiver_id,row.sender_id,'friend_request','👥 '+actor+' sent you a friend request.');
      }else if(payload.eventType==='UPDATE'&&row.status==='accepted'){
        await notify(row.sender_id,row.receiver_id,'friend_accept','🤝 '+actor+' accepted your friend request.');
      }
    }
    async function connect(){
      cleanup();var r=await sb.auth.getUser();uid=r.data?.user?.id||null;if(!uid)return;
      channel=sb.channel('trooth-friend-notifications-'+uid+'-'+Date.now())
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'friend_requests'},handle)
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'friend_requests'},handle)
        .subscribe();
    }
    connect();
    sb.auth.onAuthStateChange(function(event){if(event==='SIGNED_OUT')cleanup();else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')setTimeout(connect,80)});
    window.addEventListener('beforeunload',cleanup,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
