// Trooth Home Feed Upgrade — realtime UX, counters, refresh and safe navigation v2
(function(){
  function ready(){return window.troothSupabase||null}
  function toast(msg){let x=document.getElementById('troothLiveToast');if(!x){x=document.createElement('div');x.id='troothLiveToast';x.style.cssText='position:fixed;right:16px;bottom:16px;z-index:9999;background:#2d6a4f;color:#fff;padding:11px 15px;border-radius:12px;font:700 13px Arial;box-shadow:0 4px 18px #0002;opacity:0;transform:translateY(8px);transition:.2s';document.body.appendChild(x)}x.textContent=msg;x.style.opacity='1';x.style.transform='translateY(0)';clearTimeout(x._t);x._t=setTimeout(()=>{x.style.opacity='0';x.style.transform='translateY(8px)'},2200)}
  function addLiveBadge(){let h=document.querySelector('.hero');if(!h||document.getElementById('troothLiveBadge'))return;let b=document.createElement('span');b.id='troothLiveBadge';b.className='tag';b.style.marginLeft='6px';b.textContent='● LIVE';h.querySelector('.tag')?.after(b)}
  function enhanceSearch(){let s=document.getElementById('search');if(!s||s.dataset.upgraded)return;s.dataset.upgraded='1';s.placeholder='Search posts, news, sports & more…';s.addEventListener('keydown',e=>{if(e.key==='Enter'){document.getElementById('feed')?.scrollIntoView({behavior:'smooth',block:'start'})}})}
  function refresh(){if(typeof window.loadPosts==='function')window.loadPosts();[['news_stories','newsHub'],['sports_stories','sportsHub'],['store_listings','storesHub'],['properties','propertyHub']].forEach(a=>{if(typeof window.loadHub==='function')window.loadHub(a[0],a[1])});toast('Trooth Feed refreshed ✓')}
  function init(){let s=ready();if(!s){setTimeout(init,300);return}if(window.__troothHomeFeedUpgradeV2)return;window.__troothHomeFeedUpgradeV2=true;addLiveBadge();enhanceSearch();
    // Realtime ownership stays with the dedicated Home Feed / Dashboard bridges.
    // This module only handles UX refresh hooks and must not create another channel.
    var timer=null;
    function schedule(delay){clearTimeout(timer);timer=setTimeout(function(){if(document.visibilityState==='visible'&&navigator.onLine!==false)refresh()},delay||300)}
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(350)});
    window.addEventListener('online',()=>schedule(400));
    window.addEventListener('trooth-feed-refresh',()=>schedule(180));
    window.addEventListener('trooth-home-hub-refresh',()=>schedule(220));
    window.addEventListener('beforeunload',()=>clearTimeout(timer),{once:true});
    setInterval(()=>{if(document.visibilityState==='visible'&&navigator.onLine) schedule(50)},120000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
