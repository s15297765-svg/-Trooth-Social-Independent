// Trooth Social Independent — mark message notifications read when opening a chat
(function(){
  if(window.__troothChatNotificationReadV1)return;window.__troothChatNotificationReadV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb||!sb.auth)return;
    window.addEventListener('trooth-chat-peer-change',async function(e){
      try{
        var r=await sb.auth.getUser(),me=r.data&&r.data.user,peer=e.detail&&e.detail.userId;
        if(!me||!peer)return;
        var q=await sb.from('notifications').update({is_read:true}).eq('user_id',me.id).eq('actor_id',peer).eq('kind','message').eq('is_read',false);
        if(!q.error)window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'chat-notification-read',actor_id:peer}}));
      }catch(err){console.warn('Trooth chat notification read:',err.message)}
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
