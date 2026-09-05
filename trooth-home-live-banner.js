// Trooth Social Independent — live home banner v2
(()=>{
  if(window.__troothHomeLiveBannerV2)return;window.__troothHomeLiveBannerV2=true;
  let timer=null;
  const show=msg=>{
    let b=document.getElementById('troothLiveBanner');
    if(!b){
      b=document.createElement('button');b.id='troothLiveBanner';b.type='button';b.setAttribute('aria-live','polite');b.setAttribute('aria-label','Live update available. Tap to refresh.');
      b.style.cssText='position:fixed;top:68px;left:50%;transform:translateX(-50%);z-index:9999;background:#2d6a4f;color:#fff;padding:9px 14px;border:0;border-radius:22px;box-shadow:0 5px 18px #173b2940;font:700 13px Arial;cursor:pointer;max-width:90%;text-align:center';
      b.onclick=()=>{clearTimeout(timer);b.remove();if(window.troothHomeFeedRefresh)window.troothHomeFeedRefresh();else if(window.loadPosts)window.loadPosts()};
      document.body.appendChild(b);
    }
    b.textContent=msg||'🟢 New activity on Trooth — tap to refresh';
    clearTimeout(timer);timer=setTimeout(()=>{if(b&&b.parentNode)b.remove()},6500);
  };
  const boot=()=>{
    if(window.__troothHomeLiveBannerBooted)return;window.__troothHomeLiveBannerBooted=true;
    window.addEventListener('trooth-feed-refreshed',()=>show('🟢 Trooth Feed updated live'));
    window.addEventListener('trooth-home-hub-refresh',()=>show('🟢 New content available — tap to refresh'));
    window.addEventListener('trooth-post-shared',()=>show('↗ Post shared successfully'));
  };
  window.addEventListener('trooth-supabase-ready',boot);document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();
})();
