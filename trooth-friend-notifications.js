// Trooth Social Independent — Friend Request → Notifications bridge v3
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothFriendNotificationsBooted)return;
    window.troothFriendNotificationsBooted=true;
    var channel=null,uid=null,seen={},seenAt={},TTL=12000,retryTimer=null;
    function cleanup(){clearTimeout(retryTimer);retryTimer=null;if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}}
    function prune(){var n=Date.now();Object.keys(seenAt).forEach(function(k){if(n-seenAt[k]>TTL){delete seen[k];delete seenAt[k]}})}
    async function profileName(id){try{var r=await sb.from('profiles').select('display_name').eq('id',id).maybeSingle();return r.data&&r.data.display_name||'Trooth Member'}catch(e){return 'Trooth Member'}}
    async function notify(user_id,actor_id,kind,body,key){
      if(!user_id||!actor_id||user_id===actor_id)return;
      prune();var k=key||kind+'|'+user_id+'|'+actor_id+'|'+body;if(seen[k])return;
      seen[k]=true;seenAt[k]=Date.now();
      try{var r=await sb.from('notifications').insert({user_id:user_id,actor_id:actor_id,kind:kind,body:body,is_read:false});if(r.error)throw r.error;
        window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));window.dispatchEvent(new CustomEvent('trooth-unread-refresh'));window.dispatchEvent(new CustomEvent('trooth-friend-notification',{detail:{kind:kind,actorId:actor_id}}));
      }catch(e){delete seen[k];delete seenAt[k]}
    }
    async function handle(payload){var row=payload&&payload.new||{};if(!row.id||!row.sender_id||!row.receiver_id)return;var actor=await profileName(row.sender_id);
      if(payload.eventType==='INSERT'&&row.status==='pending')await notify(row.receiver_id,row.sender_id,'friend_request','👥 '+actor+' sent you a friend request.','request|'+row.id);
      else if(payload.eventType==='UPDATE'&&row.status==='accepted')await notify(row.sender_id,row.receiver_id,'friend_accept','🤝 '+actor+' accepted your friend request.','accept|'+row.id);
    }
    async function connect(){cleanup();if(!navigator.onLine)return;var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null;if(!uid)return;seen={};seenAt={};
      channel=sb.channel('trooth-friend-notifications-'+uid+'-'+Date.now()).on('postgres_changes',{event:'INSERT',schema:'public',table:'friend_requests'},handle).on('postgres_changes',{event:'UPDATE',schema:'public',table:'friend_requests'},handle).subscribe(function(status){
        if(status==='SUBSCRIBED')window.dispatchEvent(new CustomEvent('trooth-realtime-connected',{detail:{source:'friend-notifications'}}));
        else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:'RETRYING',source:'friend-notifications'}}));cleanup();retryTimer=setTimeout(connect,1500)}
      });
    }
    connect();
    window.addEventListener('online',connect);window.addEventListener('offline',cleanup);
    sb.auth.onAuthStateChange(function(event){if(event==='SIGNED_OUT'){uid=null;seen={};seenAt={};cleanup()}else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')setTimeout(connect,80)});
    window.addEventListener('beforeunload',cleanup,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
