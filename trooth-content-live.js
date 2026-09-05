/* Trooth Social Independent — lightweight live Stories / News / Sports bridge */
(function(){
  const path=location.pathname.toLowerCase();
  function boot(){
    const sb=window.troothSupabase;if(!sb||!sb.auth||!sb.channel)return;
    if(window.troothContentLiveReady)return;
    window.troothContentLiveReady=true;
    let channel=null,authSub=null,reloadTimer=null,reconnectTimer=null,starting=false,stopped=false;
    const stamp=()=>{window.troothContentLiveAt=new Date().toISOString();};
    const scheduleReload=()=>{
      clearTimeout(reloadTimer);
      reloadTimer=setTimeout(()=>{reloadTimer=null;if(!stopped&&(path.endsWith('news.html')||path.endsWith('sports.html')))location.reload();},300);
    };
    const clearChannel=()=>{
      clearTimeout(reloadTimer);clearTimeout(reconnectTimer);
      reloadTimer=null;reconnectTimer=null;starting=false;
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothContentLiveChannel=null;
      window.troothContentLiveStatus='CLOSED';
    };
    const cleanup=(full)=>{
      clearChannel();
      if(full&&authSub&&authSub.unsubscribe){try{authSub.unsubscribe()}catch(e){}authSub=null;}
    };
    const subscribe=()=>{
      if(stopped||starting||channel)return;
      starting=true;
      const ch=sb.channel('trooth-content-live-stories-'+Date.now())
        .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},p=>{
          stamp();window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'story',payload:p}}));
          if(typeof window.loadStories==='function')setTimeout(()=>{if(!stopped)window.loadStories()},150);
        })
        .subscribe(status=>{
          starting=false;window.troothContentLiveStatus=status;
          if(status==='SUBSCRIBED'){if(channel!==ch)return;window.troothContentLiveChannel=ch;}
          else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
            try{sb.removeChannel(ch)}catch(e){}if(channel===ch)channel=null;
            if(!stopped){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(()=>{reconnectTimer=null;subscribe()},700);}
          }
        });
      channel=ch;
    };
    subscribe();
    window.addEventListener('trooth-news-refresh',e=>{
      if(stopped)return;stamp();window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'news',payload:e&&e.detail||null}}));scheduleReload();
    });
    window.addEventListener('trooth-sports-refresh',e=>{
      if(stopped)return;stamp();window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'sports',payload:e&&e.detail||null}}));scheduleReload();
    });
    authSub=sb.auth.onAuthStateChange(event=>{
      if(event==='SIGNED_OUT'||event==='USER_DELETED'){stopped=true;clearChannel();return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        stopped=false;clearChannel();window.troothContentLiveReady=false;setTimeout(()=>boot(),80);
      }
    });
    window.addEventListener('beforeunload',()=>cleanup(true),{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
