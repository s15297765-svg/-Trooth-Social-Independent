/* Trooth Social Independent — unified live sync */
(function(){
  let authSub=null, channel=null, reconnectTimer=null, refreshTimer=null, stopped=false, booted=false;
  const page=()=>location.pathname.toLowerCase();
  function addStyles(){
    if(document.getElementById('trooth-live-indicator-css')) return;
    const s=document.createElement('style');s.id='trooth-live-indicator-css';
    s.textContent='.trooth-live-indicator{position:fixed;top:72px;right:14px;z-index:9999;display:none;gap:8px;align-items:center;padding:9px 13px;border-radius:999px;background:#fff;border:1px solid #bbf7d0;box-shadow:0 5px 18px rgba(0,0,0,.12);font:700 13px system-ui;color:#166534;cursor:pointer}.trooth-live-dot{width:9px;height:9px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 4px #dcfce7}.trooth-live-indicator.breaking .trooth-live-dot{background:#dc2626;box-shadow:0 0 0 4px #fee2e2}.trooth-live-indicator.sports .trooth-live-dot{background:#2563eb;box-shadow:0 0 0 4px #dbeafe}.trooth-live-indicator.show{display:flex}';
    document.head.appendChild(s);
  }
  function indicator(kind,text,target){
    addStyles();let el=document.getElementById('trooth-live-indicator');
    if(!el){el=document.createElement('div');el.id='trooth-live-indicator';document.body.appendChild(el)}
    el.className='trooth-live-indicator show '+kind;
    el.innerHTML='<span class="trooth-live-dot"></span><span>'+text+'</span>';
    el.onclick=()=>{if(target)location.href=target};
    clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('show'),7000);
  }
  function clearChannel(){
    clearTimeout(reconnectTimer);clearTimeout(refreshTimer);reconnectTimer=refreshTimer=null;
    if(channel){try{window.troothSupabase.removeChannel(channel)}catch(e){}channel=null}
    window.troothLiveChannel=null;
  }
  function scheduleReload(){
    if(stopped)return;
    clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{
      refreshTimer=null;if(stopped)return;
      const p=page();
      if(p.endsWith('news.html')||p.endsWith('sports.html')) location.reload();
    },300);
  }
  function subscribe(user){
    const sb=window.troothSupabase;if(!sb||!user||stopped)return;
    clearChannel();
    const uid=user.id;
    channel=sb.channel('trooth-live-'+uid+'-'+Date.now())
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+uid},payload=>{
        window.dispatchEvent(new CustomEvent('trooth-notification',{detail:payload.new}));
        if(typeof window.refreshTroothNotifications==='function')window.refreshTroothNotifications();
        indicator('social','🟢 نئی Notification — نئی سرگرمی','notifications.html');
      })
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+uid},payload=>{
        window.dispatchEvent(new CustomEvent('trooth-message',{detail:payload.new}));
        if(typeof window.refreshTroothMessages==='function')window.refreshTroothMessages();
        indicator('social','🟢 نیا Message — نیا پیغام','chat.html?user='+encodeURIComponent(payload.new.sender_id));
      })
      .on('postgres_changes',{event:'*',schema:'public',table:'news_stories'},payload=>{
        window.dispatchEvent(new CustomEvent('trooth-news-update',{detail:payload}));
        if(payload.eventType==='INSERT')indicator('breaking','🔴 Breaking News — نئی خبر','news.html');
        scheduleReload();
      })
      .on('postgres_changes',{event:'*',schema:'public',table:'sports_stories'},payload=>{
        window.dispatchEvent(new CustomEvent('trooth-sports-update',{detail:payload}));
        if(payload.eventType==='INSERT')indicator('sports','🔵 Live Sports — نئی اپڈیٹ','sports.html');
        scheduleReload();
      })
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},payload=>{
        window.dispatchEvent(new CustomEvent('trooth-post-update',{detail:payload}));
        if(payload.new?.user_id!==uid&&!page().includes('group.html'))indicator('social','🟢 Live Feed — نئی پوسٹ','index.html');
        window.dispatchEvent(new CustomEvent('trooth-live-feed-update',{detail:payload}));
      })
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+uid},payload=>{
        window.dispatchEvent(new CustomEvent('trooth-friend-request',{detail:payload.new}));
        indicator('social','🟢 Friend Request — نئی درخواست','friends.html');
      })
      .subscribe(status=>{
        window.troothLiveStatus=status;
        window.dispatchEvent(new CustomEvent('trooth-live-status',{detail:status}));
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT') reconnectTimer=setTimeout(()=>connect(),800);
      });
    window.troothLiveChannel=channel;
  }
  async function connect(){
    if(stopped||!window.troothSupabase?.auth)return;
    try{
      const {data}=await window.troothSupabase.auth.getUser();
      if(data?.user){window.troothLiveUser=data.user;subscribe(data.user)}else{window.troothLiveUser=null;clearChannel()}
    }catch(e){if(!stopped)reconnectTimer=setTimeout(connect,1000)}
  }
  function cleanup(full){
    stopped=true;clearChannel();
    if(full&&authSub){try{authSub.subscription.unsubscribe()}catch(e){}authSub=null}
  }
  function boot(){
    if(booted||!window.troothSupabase?.auth)return;
    booted=true;stopped=false;connect();
    authSub=window.troothSupabase.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT'||event==='USER_DELETED'){stopped=true;clearChannel();window.troothLiveUser=null;return}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        stopped=false;clearChannel();window.troothLiveUser=session?.user||null;setTimeout(connect,80);
      }
    }).data;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
  window.addEventListener('beforeunload',()=>cleanup(true),{once:true});
})();
