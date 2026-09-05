// Trooth Social Independent — Messaging + Notifications V3
// Data/API bridge only. Realtime ownership stays with the dedicated live bridges.
(function(){
  if(window.troothMessagingNotificationsV3)return;
  window.troothMessagingNotificationsV3=true;
  function boot(){
    const sb=window.troothSupabase;
    if(!sb)return setTimeout(boot,300);
    let refreshTimer=null,starting=false,stopped=false,pending=false;
    async function state(){try{const r=await sb.auth.getUser();return r.data&&r.data.user?r.data.user:null}catch(e){return null}}
    function schedule(){if(stopped)return;clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{refreshTimer=null;start()},220)}
    async function refreshMessages(emit=true){
      const u=await state();if(!u||stopped)return window.troothMessages||[];
      const r=await sb.from('messages').select('*').or('sender_id.eq.'+u.id+',receiver_id.eq.'+u.id).order('created_at',{ascending:true}).limit(500);
      if(r.error)return window.troothMessages||[];
      window.troothMessages=r.data||[];
      if(emit)window.dispatchEvent(new CustomEvent('trooth-messages-refresh',{detail:window.troothMessages,source:'messaging-v3'}));
      return window.troothMessages;
    }
    async function refreshNotifications(emit=true){
      const u=await state();if(!u||stopped)return window.troothNotifications||[];
      const r=await sb.from('notifications').select('*').eq('user_id',u.id).order('created_at',{ascending:false}).limit(200);
      if(r.error)return window.troothNotifications||[];
      window.troothNotifications=r.data||[];
      if(emit)window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:window.troothNotifications,source:'messaging-v3'}));
      return window.troothNotifications;
    }
    window.troothSendMessage=async function(receiverId,body){
      const u=await state(),text=String(body||'').trim();
      if(!u||!receiverId||!text)throw new Error('Login, receiver and message are required.');
      const r=await sb.from('messages').insert({sender_id:u.id,receiver_id:receiverId,body:text,is_read:false}).select().single();
      if(r.error)throw r.error;schedule();return r.data;
    };
    window.troothMarkMessageRead=async function(messageId){
      const u=await state();if(!u||!messageId)return;
      const r=await sb.from('messages').update({is_read:true}).eq('id',messageId).eq('receiver_id',u.id);
      if(r.error)throw r.error;schedule();
    };
    window.troothMarkAllNotificationsRead=async function(){
      const u=await state();if(!u)return;
      const r=await sb.from('notifications').update({is_read:true}).eq('user_id',u.id).eq('is_read',false);
      if(r.error)throw r.error;schedule();
    };
    async function start(){
      if(stopped)return;if(starting){pending=true;return}
      starting=true;pending=false;
      try{await Promise.all([refreshMessages(false),refreshNotifications(false)])}
      finally{starting=false;if(pending)schedule()}
    }
    window.addEventListener('trooth-message-incoming',schedule);
    window.addEventListener('trooth-notification-incoming',schedule);
    window.addEventListener('trooth-messages-refresh',e=>{if(!e.detail||e.detail.source!=='messaging-v3')schedule()});
    window.addEventListener('trooth-notifications-refresh',e=>{if(!e.detail||e.detail.source!=='messaging-v3')schedule()});
    window.addEventListener('trooth-auth-changed',()=>{stopped=false;start()});
    window.addEventListener('online',()=>{stopped=false;schedule()});
    window.addEventListener('beforeunload',()=>{stopped=true;clearTimeout(refreshTimer)},{once:true});
    start();
  }
  boot();
})();
