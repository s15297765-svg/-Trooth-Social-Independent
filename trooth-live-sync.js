/* Trooth Social Independent — live notification/message/news/sports/feed/friend sync */
(function(){
  function addStyles(){
    if(document.getElementById('trooth-live-indicator-css')) return;
    const s=document.createElement('style'); s.id='trooth-live-indicator-css';
    s.textContent='.trooth-live-indicator{position:fixed;top:72px;right:14px;z-index:9999;display:none;gap:8px;align-items:center;padding:9px 13px;border-radius:999px;background:#fff;border:1px solid #bbf7d0;box-shadow:0 5px 18px rgba(0,0,0,.12);font:700 13px system-ui;color:#166534;cursor:pointer}.trooth-live-dot{width:9px;height:9px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 4px #dcfce7}.trooth-live-indicator.breaking .trooth-live-dot{background:#dc2626;box-shadow:0 0 0 4px #fee2e2}.trooth-live-indicator.sports .trooth-live-dot{background:#2563eb;box-shadow:0 0 0 4px #dbeafe}.trooth-live-indicator.social .trooth-live-dot{background:#16a34a}.trooth-live-indicator.show{display:flex}';
    document.head.appendChild(s);
  }
  function indicator(kind,text,target){
    addStyles();
    let el=document.getElementById('trooth-live-indicator');
    if(!el){el=document.createElement('div');el.id='trooth-live-indicator';document.body.appendChild(el)}
    el.className='trooth-live-indicator show '+kind;
    el.innerHTML='<span class="trooth-live-dot"></span><span>'+text+'</span>';
    el.onclick=()=>{if(target) location.href=target};
    clearTimeout(el._timer); el._timer=setTimeout(()=>el.classList.remove('show'),9000);
  }
  function boot(){
    if(!window.troothSupabase || !window.troothSupabase.auth) return;
    const sb=window.troothSupabase;
    sb.auth.getUser().then(({data})=>{
      const user=data&&data.user;
      if(!user) return;
      window.troothLiveUser=user;
      const channel=sb.channel('trooth-live-'+user.id)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-notification',{detail:payload.new}));
          if(typeof window.refreshTroothNotifications==='function') window.refreshTroothNotifications();
          indicator('social','🟢 نئی Notification — نئی سرگرمی','index.html');
        })
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-message',{detail:payload.new}));
          if(typeof window.refreshTroothMessages==='function') window.refreshTroothMessages();
        })
        .on('postgres_changes',{event:'*',schema:'public',table:'news_stories'},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-news-update',{detail:payload}));
          if(payload.eventType==='INSERT') indicator('breaking','🔴 Breaking News — نئی خبر','news.html');
          if(location.pathname.toLowerCase().includes('news.html')) setTimeout(()=>location.reload(),250);
        })
        .on('postgres_changes',{event:'*',schema:'public',table:'sports_stories'},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-sports-update',{detail:payload}));
          if(payload.eventType==='INSERT') indicator('sports','🔵 Live Sports — نئی اپڈیٹ','sports.html');
          if(location.pathname.toLowerCase().includes('sports.html')) setTimeout(()=>location.reload(),250);
        })
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-post-update',{detail:payload}));
          if(!location.pathname.toLowerCase().includes('group.html')) indicator('social','🟢 Live Feed — نئی پوسٹ','index.html');
          if(location.pathname.toLowerCase().endsWith('index.html') || location.pathname.endsWith('/')) setTimeout(()=>location.reload(),350);
        })
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+user.id},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-friend-request',{detail:payload.new}));
          indicator('social','🟢 Friend Request — نئی درخواست','index.html');
        })
        .subscribe(status=>{
          window.troothLiveStatus=status;
          window.dispatchEvent(new CustomEvent('trooth-live-status',{detail:status}));
        });
      window.troothLiveChannel=channel;
    });
  }
  if(window.troothSupabase) boot(); else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
