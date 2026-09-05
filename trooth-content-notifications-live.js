// Trooth Social Independent — Like / Comment / Share -> Notifications v3
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothContentNotificationsBooted)return;
    window.troothContentNotificationsBooted=true;
    var uid=null,ch=null,busy={},recent={},retryTimer=null;
    var DEDUPE_TTL=12000;
    function cleanup(){clearTimeout(retryTimer);retryTimer=null;if(ch){try{sb.removeChannel(ch)}catch(e){}ch=null}}
    function cleanupRecent(){var now=Date.now();Object.keys(recent).forEach(function(k){if(now-recent[k]>DEDUPE_TTL)delete recent[k]})}
    async function getUser(){var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null;return uid}
    async function addNotification(kind,postId,actorId,body){
      if(!uid||!postId||!actorId||actorId===uid)return;cleanupRecent();var key=kind+'|'+postId+'|'+actorId;if(recent[key]||busy[key])return;recent[key]=Date.now();busy[key]=true;
      try{var p=await sb.from('posts').select('id,user_id').eq('id',postId).maybeSingle();if(!p.data||!p.data.user_id||p.data.user_id===actorId)return;var n=await sb.from('notifications').select('id').eq('user_id',p.data.user_id).eq('actor_id',actorId).eq('kind',kind).eq('post_id',postId).eq('is_read',false).limit(1);if(n.data&&n.data.length)return;var ins=await sb.from('notifications').insert({user_id:p.data.user_id,actor_id:actorId,kind:kind,body:body,is_read:false,post_id:postId});if(ins.error)throw ins.error;window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));window.dispatchEvent(new CustomEvent('trooth-unread-refresh'))}catch(e){delete recent[key]}finally{delete busy[key]}
    }
    function subscribe(){
      cleanup();if(!uid||!navigator.onLine)return;
      ch=sb.channel('trooth-content-notifications-'+uid+'-'+Date.now())
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'post_likes'},function(p){var x=p.new;if(x)addNotification('like',x.post_id,x.user_id,'👍 Someone liked your post.')})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'comments'},function(p){var x=p.new;if(x)addNotification('comment',x.post_id,x.user_id,'💬 Someone commented on your post.')})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'post_shares'},function(p){var x=p.new;if(x)addNotification('share',x.post_id,x.user_id,'↗ Someone shared your post.')})
        .subscribe(function(status){if(status==='SUBSCRIBED')window.dispatchEvent(new CustomEvent('trooth-realtime-connected',{detail:{source:'content-notifications'}}));else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:'RETRYING',source:'content-notifications'}}));cleanup();retryTimer=setTimeout(subscribe,1500)}});
    }
    async function start(){await getUser();if(uid&&navigator.onLine)subscribe()}
    start();window.addEventListener('online',start);window.addEventListener('offline',cleanup);
    sb.auth.onAuthStateChange(function(e){if(e==='SIGNED_IN'||e==='TOKEN_REFRESHED'||e==='USER_UPDATED')setTimeout(start,80);if(e==='SIGNED_OUT'){uid=null;busy={};recent={};cleanup()}});
    window.addEventListener('beforeunload',cleanup,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
