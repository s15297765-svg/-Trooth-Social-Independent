// Trooth Social Independent — live chat event bridge v2
(function(){
  function boot(){
    if(window.__troothChatLiveBridge)return;window.__troothChatLiveBridge=true;
    var sb=window.troothSupabase,channel=null,uid=null,starting=false;
    function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
    function cleanup(){if(channel&&sb){try{sb.removeChannel(channel)}catch(e){}}channel=null}
    async function start(){
      if(starting)return;starting=true;
      try{
        cleanup();if(!sb)return;
        var r=await sb.auth.getUser().catch(function(){return {data:{user:null}}});
        uid=r.data&&r.data.user?r.data.user.id:null;if(!uid)return;
        channel=sb.channel('trooth-chat-events-'+uid)
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+uid},function(payload){
            var m=payload.new||{};if(!m.id)return;
            emit('trooth-message-incoming',{message:m});
            emit('trooth-messages-refresh',{messageId:m.id,source:'live-chat'});
            emit('trooth-unread-updated',{messageId:m.id,receiverId:uid});
          })
          .on('postgres_changes',{event:'UPDATE',schema:'public',table:'messages',filter:'receiver_id=eq.'+uid},function(payload){
            var m=payload.new||{};if(m.id)emit('trooth-messages-refresh',{messageId:m.id,read:m.is_read===true,source:'live-chat'});
          })
          .subscribe(function(status){
            if(status==='SUBSCRIBED')emit('trooth-realtime-connected',{source:'chat'});
            else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')emit('trooth-realtime-status',{status:'RETRYING',source:'chat'});
          });
      }finally{starting=false}
    }
    if(sb&&sb.auth)sb.auth.onAuthStateChange(function(){setTimeout(start,0)});
    window.addEventListener('trooth-supabase-ready',function(){sb=window.troothSupabase;start()});
    window.addEventListener('trooth-auth-changed',function(){start()});
    window.addEventListener('online',function(){start()});
    window.addEventListener('beforeunload',cleanup);
    if(sb)start();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
