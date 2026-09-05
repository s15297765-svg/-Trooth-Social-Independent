// Trooth — Likes + Comments -> Notifications realtime bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||window.troothContentNotificationsBooted)return;
    window.troothContentNotificationsBooted=true;
    var uid=null,ch=null;
    async function getUser(){var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null;return uid}
    async function addNotification(kind,postId,actorId,body){
      if(!uid||!postId||!actorId||actorId===uid)return;
      var row={user_id:uid,actor_id:actorId,kind:kind,body:body,is_read:false,post_id:postId};
      try{await sb.from('notifications').insert(row);window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));window.dispatchEvent(new CustomEvent('trooth-unread-refresh'));}catch(e){}
    }
    async function handleLike(p){
      var x=p.new;if(!x||!x.post_id||!x.user_id||x.user_id===uid)return;
      var r=await sb.from('posts').select('id,user_id').eq('id',x.post_id).maybeSingle();
      if(r.data&&r.data.user_id)await addNotification('like',x.post_id,x.user_id,'👍 Someone liked your post.');
    }
    async function handleComment(p){
      var x=p.new;if(!x||!x.post_id||!x.user_id||x.user_id===uid)return;
      var r=await sb.from('posts').select('id,user_id').eq('id',x.post_id).maybeSingle();
      if(r.data&&r.data.user_id)await addNotification('comment',x.post_id,x.user_id,'💬 Someone commented on your post.');
    }
    async function subscribe(){
      await getUser();if(!uid)return;
      if(ch)try{sb.removeChannel(ch)}catch(e){}
      ch=sb.channel('trooth-content-notifications-'+uid)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'post_likes'},handleLike)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'comments'},handleComment)
        .subscribe();
    }
    subscribe();
    sb.auth.onAuthStateChange(function(e){if(e==='SIGNED_IN'||e==='TOKEN_REFRESHED'||e==='USER_UPDATED')subscribe();});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
