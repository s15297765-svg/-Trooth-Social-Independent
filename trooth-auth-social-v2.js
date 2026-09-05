/* Trooth Social Independent — Auth/Profile + Friends + Messages + Notifications V2 */
(function(){
  function boot(){
    const sb=window.troothSupabase;
    if(!sb||!sb.auth||window.troothAuthSocialV2Booted)return;
    window.troothAuthSocialV2Booted=true;
    let channel=null,authSub=null,reconnectTimer=null,stopped=false,badgeTimer=null,badgeBusy=false;
    const emit=(name,detail)=>window.dispatchEvent(new CustomEvent(name,{detail}));
    function clearTimers(){clearTimeout(reconnectTimer);reconnectTimer=null;clearTimeout(badgeTimer);badgeTimer=null;}
    function clearChannel(){clearTimeout(reconnectTimer);reconnectTimer=null;if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}}
    async function sync(){
      if(stopped)return null;
      const {data:{user}}=await sb.auth.getUser();
      if(!user||stopped)return null;
      window.troothCurrentUser=user;
      const profile=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
      if(stopped)return null;
      window.troothCurrentProfile=profile.data||null;
      emit('trooth-profile-ready',{user,profile:profile.data||null});
      return user;
    }
    async function refreshBadges(user){
      if(!user||stopped||badgeBusy)return;
      badgeBusy=true;
      try{
        const [n,m,f]=await Promise.all([
          sb.from('notifications').select('id,is_read').eq('user_id',user.id).eq('is_read',false),
          sb.from('messages').select('id,is_read').eq('receiver_id',user.id).eq('is_read',false),
          sb.from('friend_requests').select('id').eq('receiver_id',user.id).eq('status','pending')
        ]);
        if(stopped)return;
        const set=(selector,count)=>document.querySelectorAll(selector).forEach(el=>{el.textContent=count?String(count):'';el.hidden=!count});
        const counts={notifications:(n.data||[]).length,messages:(m.data||[]).length,friendRequests:(f.data||[]).length};
        set('[data-trooth-notifications-badge]',counts.notifications);
        set('[data-trooth-messages-badge]',counts.messages);
        set('[data-trooth-friends-badge]',counts.friendRequests);
        emit('trooth-social-badges',counts);
      }finally{badgeBusy=false;}
    }
    function scheduleBadges(user){
      if(stopped)return;
      clearTimeout(badgeTimer);
      badgeTimer=setTimeout(()=>{badgeTimer=null;refreshBadges(user);},120);
    }
    async function markMessageRead(id){
      const {data:{user}}=await sb.auth.getUser();
      if(!user||!id)return false;
      const r=await sb.from('messages').update({is_read:true}).eq('id',id).eq('receiver_id',user.id);
      if(!r.error)scheduleBadges(user);
      return !r.error;
    }
    async function markAllNotificationsRead(){
      const {data:{user}}=await sb.auth.getUser();
      if(!user)return false;
      const r=await sb.from('notifications').update({is_read:true}).eq('user_id',user.id).eq('is_read',false);
      if(!r.error)scheduleBadges(user);
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
    function subscribe(user){
      if(stopped||!user)return;
      clearChannel();
      channel=sb.channel('trooth-social-v2-'+user.id+'-'+Date.now())
        .on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},payload=>{emit('trooth-notification-live',payload);scheduleBadges(user)})
        .on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},payload=>{emit('trooth-message-live',payload);scheduleBadges(user)})
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+user.id},payload=>{emit('trooth-friend-request-live',payload);scheduleBadges(user)})
        .subscribe(status=>{
          if((status==='CHANNEL_ERROR'||status==='TIMED_OUT')&&!stopped){
            clearTimeout(reconnectTimer);reconnectTimer=setTimeout(connect,700);
          }
        });
      window.troothSocialV2Channel=channel;
    }
    async function connect(){
      if(stopped)return;
      try{
        const user=await sync();
        if(!user){clearChannel();return;}
        await refreshBadges(user);
        subscribe(user);
      }catch(e){
        if(!stopped){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(connect,1000);}
      }
    }
    function stop(){stopped=true;clearTimers();clearChannel();window.troothCurrentUser=null;window.troothCurrentProfile=null;}
    function resume(){stopped=false;connect();}
    window.troothMarkMessageRead=markMessageRead;
    window.troothMarkAllNotificationsRead=markAllNotificationsRead;
    window.troothSendMessage=sendMessage;
    authSub=sb.auth.onAuthStateChange((event,session)=>{
      emit('trooth-auth-state',{event,session});
      if(event==='SIGNED_OUT'||event==='USER_DELETED'||!session){stop();return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')resume();
    });
    connect();
    window.addEventListener('trooth-auth-social-stop',stop);
    window.addEventListener('trooth-auth-social-start',resume);
    window.addEventListener('beforeunload',()=>{
      stop();
      try{if(authSub&&authSub.data&&authSub.data.subscription)authSub.data.subscription.unsubscribe()}catch(e){}
    },{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
