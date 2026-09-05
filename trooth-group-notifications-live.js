// Trooth — Groups -> Notifications realtime bridge v3
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothGroupNotificationsBooted)return;
    window.troothGroupNotificationsBooted=true;
    var uid=null,ch=null,seen={},seenAt={},retryTimer=null,DEDUPE_TTL=12000;
    function cleanup(){clearTimeout(retryTimer);retryTimer=null;if(ch){try{sb.removeChannel(ch)}catch(e){}ch=null}}
    function prune(){var now=Date.now();Object.keys(seenAt).forEach(function(k){if(now-seenAt[k]>DEDUPE_TTL){delete seen[k];delete seenAt[k]}})}
    function notify(kind,body,actorId,postId,key){
      if(!uid||!body||actorId===uid&&kind!=='group_join_request')return;prune();var dedupe=key||kind+'|'+body+'|'+(actorId||'');if(seen[dedupe])return;seen[dedupe]=true;seenAt[dedupe]=Date.now();
      var row={user_id:uid,actor_id:actorId||uid,kind:kind,body:body,is_read:false};if(postId)row.post_id=postId;
      sb.from('notifications').insert(row).then(function(r){if(r.error)throw r.error;window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));window.dispatchEvent(new CustomEvent('trooth-unread-refresh'));window.dispatchEvent(new CustomEvent('trooth-group-notification',{detail:{kind:kind,body:body,postId:postId||null}}))}).catch(function(){delete seen[dedupe];delete seenAt[dedupe]});
    }
    async function subscribe(){
      cleanup();if(!navigator.onLine)return;var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null;if(!uid)return;seen={};seenAt={};
      ch=sb.channel('trooth-group-notifications-'+uid+'-'+Date.now())
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'group_join_requests'},async function(p){var x=p.new;if(!x||x.user_id===uid||x.status!=='pending')return;var g=await sb.from('groups').select('name,created_by').eq('id',x.group_id).maybeSingle();if(g.data&&g.data.created_by===uid)notify('group_join_request','📨 New join request for '+g.data.name,x.user_id,null,'join|'+x.id)})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'group_announcements'},async function(p){var x=p.new;if(!x||x.created_by===uid)return;var g=await sb.from('groups').select('name').eq('id',x.group_id).maybeSingle();if(!g.data)return;var m=await sb.from('group_members').select('user_id').eq('group_id',x.group_id).eq('user_id',uid).maybeSingle();if(m.data)notify('group_announcement','📢 New announcement in '+g.data.name,x.created_by,null,'announcement|'+x.id)})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},async function(p){var x=p.new;if(!x||!x.group_id||x.user_id===uid)return;var m=await sb.from('group_members').select('user_id').eq('group_id',x.group_id).eq('user_id',uid).maybeSingle();if(!m.data)return;var g=await sb.from('groups').select('name').eq('id',x.group_id).maybeSingle();if(g.data)notify('group_activity','📝 New post in '+g.data.name,x.user_id,x.id,'post|'+x.id)})
        .subscribe(function(status){if(status==='SUBSCRIBED')window.dispatchEvent(new CustomEvent('trooth-realtime-connected',{detail:{source:'group-notifications'}}));else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:'RETRYING',source:'group-notifications'}}));cleanup();retryTimer=setTimeout(subscribe,1500)}});
    }
    subscribe();window.addEventListener('online',subscribe);window.addEventListener('offline',cleanup);
    sb.auth.onAuthStateChange(function(e){if(e==='SIGNED_OUT'){uid=null;seen={};seenAt={};cleanup()}else if(e==='SIGNED_IN'||e==='TOKEN_REFRESHED'||e==='USER_UPDATED')setTimeout(subscribe,80)});
    window.addEventListener('beforeunload',cleanup,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
