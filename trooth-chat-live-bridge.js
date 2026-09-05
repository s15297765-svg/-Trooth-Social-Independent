// Trooth Social Independent — live chat event bridge
(function(){
  function boot(){
    if(window.__troothChatLiveBridge)return;window.__troothChatLiveBridge=true;
    var sb=window.troothSupabase,channel=null,uid=null;
    function cleanup(){if(channel&&sb){try{sb.removeChannel(channel)}catch(e){}}channel=null}
    async function start(){
      cleanup();
      if(!sb)return;
      var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null;
      if(!uid)return;
      channel=sb.channel('trooth-chat-events-'+uid)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+uid},function(payload){
          var m=payload.new||{};if(!m.id)return;
          window.dispatchEvent(new CustomEvent('trooth-message-incoming',{detail:{message:m}}));
          window.dispatchEvent(new CustomEvent('trooth-messages-refresh',{detail:{messageId:m.id}}));
        })
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'messages',filter:'receiver_id=eq.'+uid},function(payload){
          var m=payload.new||{};if(m.is_read===true)window.dispatchEvent(new CustomEvent('trooth-messages-refresh',{detail:{messageId:m.id,read:true}}));
        })
        .subscribe();
    }
    sb.auth.onAuthStateChange(function(){setTimeout(start,0)});
    window.addEventListener('trooth-supabase-ready',function(){sb=window.troothSupabase;start()});
    window.addEventListener('beforeunload',cleanup);
    start();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
