/* Trooth Social Independent — Stories & Reels live interactions */
(function(){
  function boot(){
    const sb=window.troothSupabase;
    if(!sb||!sb.auth)return;
    sb.auth.getUser().then(({data})=>{
      const user=data&&data.user;
      if(!user)return;
      const ch=sb.channel('trooth-stories-live-'+user.id)
        .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},payload=>{
          window.dispatchEvent(new CustomEvent('trooth-story-update',{detail:payload}));
          const p=payload.new||{};
          if(payload.eventType==='INSERT'&&p.user_id!==user.id){
            let el=document.getElementById('trooth-story-live');
            if(!el){el=document.createElement('div');el.id='trooth-story-live';el.style.cssText='position:fixed;top:72px;left:14px;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:999px;font:700 13px system-ui;box-shadow:0 5px 18px #0002;cursor:pointer';document.body.appendChild(el)}
            el.textContent='🟢 نئی Story / Reel';el.onclick=()=>location.href='index.html';clearTimeout(el._t);el._t=setTimeout(()=>el.remove(),7000);
          }
          if(typeof window.loadStories==='function')setTimeout(()=>window.loadStories(),200);
        }).subscribe();
      window.troothStoriesChannel=ch;
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
