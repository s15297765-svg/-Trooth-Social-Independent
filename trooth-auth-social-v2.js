/* Trooth Social Independent — Auth/Profile + Friends + Messages + Notifications V2 */
(function(){
  function boot(){
    const sb=window.troothSupabase;
    if(!sb||!sb.auth)return;
    let channel=null;
    const emit=(name,detail)=>window.dispatchEvent(new CustomEvent(name,{detail}));
    async function sync(){
      const {data:{user}}=await sb.auth.getUser();
      if(!user)return null;
      window.troothCurrentUser=user;
      const profile=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
      window.troothCurrentProfile=profile.data||null;
      emit('trooth-profile-ready',{user,profile:profile.data||null});
      return user;
    }
    async function refreshBadges(user){
      const [n,m,f]=await Promise.all([
        sb.from('notifications').select('id,is_read').eq('user_id',user.id).eq('is_read',false),
        sb.from('messages').select('id,is_read').eq('receiver_id',user.id).eq('is_read',false),
        sb.from('friend_requests').select('id').eq('receiver_id',user.id).eq('status','pending')
      ]);
      const set=(selector,count)=>document.querySelectorAll(selector).forEach(el=>{el.textContent=count?String(count):'';el.hidden=!count});
      set('[data-trooth-notifications-badge]',(n.data||[]).length);
      set('[data-trooth-messages-badge]',(m.data||[]).length);
      set('[data-trooth-friends-badge]',(f.data||[]).length);
      emit('trooth-social-badges',{notifications:(n.data||[]).length,messages:(m.data||[]).length,friendRequests:(f.data||[]).length});
    }
    async function markMessageRead(id){
      const {data:{user}}=await sb.auth.getUser();
      if(!user||!id)return false;
      const r=await sb.from('messages').update({is_read:true}).eq('id',id).eq('receiver_id',user.id);
      if(!r.error)await refreshBadges(user);
      return !r.error;
    }
    async function markAllNotificationsRead(){
      const {data:{user}}=await sb.auth.getUser();
      if(!user)return false;
      const r=await sb.from('notifications').update({is_read:true}).eq('user_id',user.id).eq('is_read',false);
      if(!r.error)await refreshBadges(user);
      return !r.error;
    }
    async function sendMessage(receiverId,body){
      const text=String(body||'').trim();
      if(!receiverId||!text)return {error:new Error('Message and receiver are required')};
      const {data:{user}}=await sb.auth.getUser();
      if(!user)return {error:new Error('Please sign in first')};
      if(receiverId===user.id)return {error:new Error('You cannot message yourself')};
      return await sb.from('messages').insert({sender_id:user.id,receiver_id:receiverId,body:text,is_read:false}).select().single();
    }
    window.troothMarkMessageRead=markMessageRead;
    window.troothMarkAllNotificationsRead=markAllNotificationsRead;
    window.troothSendMessage=sendMessage;
    sb.auth.onAuthStateChange(async(event,session)=>{
      emit('trooth-auth-state',{event,session});
      if(event==='SIGNED_OUT'){window.troothCurrentUser=null;window.troothCurrentProfile=null;return;}
      if(session?.user){const user=await sync();if(user)await refreshBadges(user);}
    });
    sync().then(async user=>{
      if(!user)return;
      await refreshBadges(user);
      if(channel)sb.removeChannel(channel);
      channel=sb.channel('trooth-social-v2-'+user.id)
        .on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},async payload=>{emit('trooth-notification-live',payload);await refreshBadges(user)})
        .on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},async payload=>{emit('trooth-message-live',payload);await refreshBadges(user)})
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+user.id},async payload=>{emit('trooth-friend-request-live',payload);await refreshBadges(user)})
        .subscribe();
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
