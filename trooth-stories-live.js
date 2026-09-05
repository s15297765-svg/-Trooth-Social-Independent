/* Trooth Social Independent — Stories & Reels live interactions */
(function(){
  function boot(){
    const sb=window.troothSupabase;
    if(!sb||!sb.auth||!sb.channel)return;
    if(window.troothStoriesLiveBooted)return;
    window.troothStoriesLiveBooted=true;
    let channel=null,authSub=null,reconnectTimer=null,refreshTimer=null,stopped=false,starting=false;
    const clearChannel=()=>{
      clearTimeout(reconnectTimer);clearTimeout(refreshTimer);
      reconnectTimer=null;refreshTimer=null;starting=false;
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothStoriesChannel=null;
      window.troothStoriesLiveStatus='CLOSED';
    };
    const cleanup=(full)=>{
      stopped=true;clearChannel();
      if(full&&authSub&&authSub.unsubscribe){try{authSub.unsubscribe()}catch(e){}authSub=null;}
    };
    const scheduleRefresh=()=>{
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(()=>{
        refreshTimer=null;
        if(!stopped&&typeof window.loadStories==='function')window.loadStories();
      },180);
    };
    const showNotice=()=>{
      let el=document.getElementById('trooth-story-live');
      if(!el){
        el=document.createElement('div');el.id='trooth-story-live';
        el.style.cssText='position:fixed;top:72px;left:14px;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:999px;font:700 13px system-ui;box-shadow:0 5px 18px #0002;cursor:pointer';
        document.body.appendChild(el);
      }
      el.textContent='🟢 نئی Story / Reel';
      el.onclick=()=>location.href='index.html';
      clearTimeout(el._t);el._t=setTimeout(()=>el.remove(),7000);
    };
    const subscribe=()=>{
      if(stopped||starting||channel)return;
      starting=true;
      const ch=sb.channel('trooth-stories-live-'+Date.now())
        .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-story-update',{detail:payload}));
          const p=payload.new||{};
          if(payload.eventType==='INSERT'&&p.user_id!==window.troothStoriesLiveUserId)showNotice();
          scheduleRefresh();
        })
        .subscribe(status=>{
          starting=false;window.troothStoriesLiveStatus=status;
          if(status==='SUBSCRIBED')window.troothStoriesChannel=ch;
          if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
            try{sb.removeChannel(ch)}catch(e){}
            if(channel===ch)channel=null;
            if(!stopped){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(()=>{reconnectTimer=null;subscribe()},700);}
          }
        });
      channel=ch;
    };
    const connect=async()=>{
      try{
        const {data}=await sb.auth.getUser();
        const user=data&&data.user;
        if(!user){stopped=true;clearChannel();return;}
        stopped=false;window.troothStoriesLiveUserId=user.id;clearChannel();subscribe();
      }catch(e){
        if(!stopped){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(()=>{reconnectTimer=null;connect()},1000);}
      }
    };
    connect();
    authSub=sb.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT'||event==='USER_DELETED'){stopped=true;clearChannel();window.troothStoriesLiveUserId=null;return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        stopped=false;window.troothStoriesLiveUserId=session&&session.user?session.user.id:null;clearChannel();setTimeout(connect,80);
      }
    });
    window.addEventListener('beforeunload',()=>cleanup(true),{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
