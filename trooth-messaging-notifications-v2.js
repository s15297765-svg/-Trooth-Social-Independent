// Trooth Social Independent — Messaging + Notifications V2
// Additive realtime layer. Uses the current Supabase client and existing RLS policies.
(function(){
  function boot(){
    const sb=window.troothSupabase;
    if(!sb) return setTimeout(boot,300);
    let channel;
    async function state(){
      const r=await sb.auth.getUser();
      return r.data && r.data.user ? r.data.user : null;
    }
    async function refreshMessages(){
      const u=await state(); if(!u) return [];
      const r=await sb.from('messages').select('*').or('sender_id.eq.'+u.id+',receiver_id.eq.'+u.id).order('created_at',{ascending:true}).limit(500);
      window.troothMessages=r.data||[];
      window.dispatchEvent(new CustomEvent('trooth-messages-refresh',{detail:window.troothMessages}));
      return window.troothMessages;
    }
    async function refreshNotifications(){
      const u=await state(); if(!u) return [];
      const r=await sb.from('notifications').select('*').eq('user_id',u.id).order('created_at',{ascending:false}).limit(200);
      window.troothNotifications=r.data||[];
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:window.troothNotifications}));
      return window.troothNotifications;
    }
    window.troothSendMessage=async function(receiverId,body){
      const u=await state(); const text=String(body||'').trim();
      if(!u||!receiverId||!text) throw new Error('Login, receiver and message are required.');
      const r=await sb.from('messages').insert({sender_id:u.id,receiver_id:receiverId,body:text,is_read:false}).select().single();
      if(r.error) throw r.error; await refreshMessages(); return r.data;
    };
    window.troothMarkMessageRead=async function(messageId){
      const u=await state(); if(!u||!messageId) return;
      await sb.from('messages').update({is_read:true}).eq('id',messageId).eq('receiver_id',u.id);
      await refreshMessages();
    };
    window.troothMarkAllNotificationsRead=async function(){
      const u=await state(); if(!u) return;
      await sb.from('notifications').update({is_read:true}).eq('user_id',u.id).eq('is_read',false);
      await refreshNotifications();
    };
    async function start(){
      const u=await state(); if(!u) return;
      await Promise.all([refreshMessages(),refreshNotifications()]);
      if(channel) sb.removeChannel(channel);
      channel=sb.channel('trooth-msg-notify-'+u.id)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},async payload=>{
          await refreshMessages();
          window.dispatchEvent(new CustomEvent('trooth-message-incoming',{detail:payload.new}));
        })
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+u.id},async payload=>{
          await refreshNotifications();
          window.dispatchEvent(new CustomEvent('trooth-notification-incoming',{detail:payload.new}));
        })
        .subscribe();
    }
    sb.auth.onAuthStateChange(function(){setTimeout(start,100);});
    start();
  }
  boot();
})();
