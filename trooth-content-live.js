/* Trooth Social Independent — lightweight live Stories / News / Sports bridge */
(function(){
  const path=location.pathname.toLowerCase();
  function boot(){
    const sb=window.troothSupabase;if(!sb)return;
    if(window.troothContentLiveReady)return;
    window.troothContentLiveReady=true;
    const stamp=()=>{window.troothContentLiveAt=new Date().toISOString();};
    // Stories/Reels keeps its own realtime channel because it is also used
    // by the home stories carousel and live notification UI.
    const channel=sb.channel('trooth-content-live-stories')
      .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},p=>{
        stamp();
        window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'story',payload:p}}));
        if(typeof window.loadStories==='function')setTimeout(()=>window.loadStories(),150);
      })
      .subscribe(status=>{window.troothContentLiveStatus=status;});
    window.troothContentLiveChannel=channel;

    // News/Sports already have a unified realtime bridge. Listen to its
    // browser events instead of opening duplicate Postgres Changes channels.
    window.addEventListener('trooth-news-refresh',e=>{
      stamp();
      window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'news',payload:e&&e.detail||null}}));
      if(path.endsWith('news.html'))setTimeout(()=>location.reload(),300);
    });
    window.addEventListener('trooth-sports-refresh',e=>{
      stamp();
      window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'sports',payload:e&&e.detail||null}}));
      if(path.endsWith('sports.html'))setTimeout(()=>location.reload(),300);
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
