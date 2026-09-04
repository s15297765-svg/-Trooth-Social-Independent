/* Trooth Social Independent — unified live Stories / News / Sports bridge */
(function(){
  const path=location.pathname.toLowerCase();
  function boot(){
    const sb=window.troothSupabase;if(!sb)return;
    const stamp=()=>{window.troothContentLiveAt=new Date().toISOString();};
    const channel=sb.channel('trooth-content-live-bridge')
      .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},p=>{
        stamp();window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'story',payload:p}}));
        if(typeof window.loadStories==='function')setTimeout(()=>window.loadStories(),150);
      })
      .on('postgres_changes',{event:'*',schema:'public',table:'news_stories'},p=>{
        stamp();window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'news',payload:p}}));
      })
      .on('postgres_changes',{event:'*',schema:'public',table:'sports_stories'},p=>{
        stamp();window.dispatchEvent(new CustomEvent('trooth-content-live-update',{detail:{type:'sports',payload:p}}));
      })
      .subscribe(status=>{window.troothContentLiveStatus=status;});
    window.troothContentLiveChannel=channel;

    window.addEventListener('trooth-content-live-update',e=>{
      const d=e.detail||{};
      if(d.type==='news'&&path.endsWith('news.html'))setTimeout(()=>location.reload(),300);
      if(d.type==='sports'&&path.endsWith('sports.html'))setTimeout(()=>location.reload(),300);
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
