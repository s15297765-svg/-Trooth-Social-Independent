// Trooth Social Independent — Like / Comment / Share -> Notifications
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothContentNotificationsBooted)return;
    window.troothContentNotificationsBooted=true;
    var uid=null,ch=null;
    async function getUser(){var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null;return uid}
    async function addNotification(kind,postId,actorId,body){
      if(!uid||!postId||!actorId||actorId===uid)return;
      var p=await sb.from('posts').select('id,user_id').eq('id',postId).maybeSingle();
      if(!p.data||!p.data.user_id||p.data.user_id===actorId)return;
      try{await sb.from('notifications').insert({user_id:p.data.user_id,actor_id:actorId,kind:kind,body:body,is_read:false,post_id:postId});window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));window.dispatchEvent(new CustomEvent('trooth-unread-refresh'));}catch(e){}
    }
    function subscribe(){
      if(!uid)return;if(ch)try{sb.removeChannel(ch)}catch(e){}
      ch=sb.channel('trooth-content-notifications-'+uid)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'post_likes'},function(p){var x=p.new;if(x)addNotification('like',x.post_id,x.user_id,'👍 Someone liked your post.')})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'comments'},function(p){var x=p.new;if(x)addNotification('comment',x.post_id,x.user_id,'💬 Someone commented on your post.')})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'post_shares'},function(p){var x=p.new;if(x)addNotification('share',x.post_id,x.user_id,'↗ Someone shared your post.')})
        .subscribe();
    }
    async function start(){await getUser();if(uid)subscribe()}
    start();sb.auth.onAuthStateChange(function(e){if(e==='SIGNED_IN'||e==='TOKEN_REFRESHED'||e==='USER_UPDATED')start();if(e==='SIGNED_OUT'){uid=null;if(ch){try{sb.removeChannel(ch)}catch(x){}ch=null}}});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
