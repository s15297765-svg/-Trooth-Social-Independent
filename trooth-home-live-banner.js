// Trooth Social Independent — live home banner v4
(()=>{
  if(window.__troothHomeLiveBannerV4)return;window.__troothHomeLiveBannerV4=true;
  let timer=null;
  const remove=()=>{clearTimeout(timer);timer=null;const b=document.getElementById('troothLiveBanner');if(b&&b.parentNode)b.remove()};
  const show=msg=>{
    let b=document.getElementById('troothLiveBanner');
    if(!b){
      b=document.createElement('button');b.id='troothLiveBanner';b.type='button';
      b.setAttribute('aria-live','polite');b.setAttribute('aria-atomic','true');
      b.setAttribute('aria-label','Live update available. Tap to refresh.');
      b.style.cssText='position:fixed;top:68px;left:50%;transform:translateX(-50%);z-index:9999;background:#2d6a4f;color:#fff;padding:9px 14px;border:0;border-radius:22px;box-shadow:0 5px 18px #173b2940;font:700 13px system-ui;cursor:pointer;max-width:calc(100vw - 24px);text-align:center;line-height:1.35;touch-action:manipulation;min-height:42px';
      b.onclick=()=>{remove();if(window.troothHomeFeedRefresh)window.troothHomeFeedRefresh();else if(window.loadPosts)window.loadPosts()};
      document.body.appendChild(b);
    }
    b.textContent=msg||'🟢 New activity on Trooth — tap to refresh';
    b.setAttribute('aria-label',(msg||'New activity on Trooth')+' Tap to refresh.');
    clearTimeout(timer);timer=setTimeout(remove,6500);
  };
  const boot=()=>{
    if(window.__troothHomeLiveBannerBootedV4)return;window.__troothHomeLiveBannerBootedV4=true;
    window.addEventListener('trooth-feed-refreshed',()=>show('🟢 Trooth Feed updated live'));
    window.addEventListener('trooth-home-hub-refresh',()=>show('🟢 New content available — tap to refresh'));
    window.addEventListener('trooth-post-shared',()=>show('↗ Post shared successfully'));
    window.addEventListener('beforeunload',remove,{once:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
