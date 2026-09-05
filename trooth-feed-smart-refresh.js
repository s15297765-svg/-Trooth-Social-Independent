// Trooth Social Independent — Smart Home Feed Refresh
(function(){
  function boot(){
    if(window.troothFeedSmartRefreshReady)return;
    window.troothFeedSmartRefreshReady=true;
    var pending=false,timer=null,stopped=false;
    function style(){
      if(document.getElementById('trooth-smart-refresh-style'))return;
      var s=document.createElement('style');s.id='trooth-smart-refresh-style';s.textContent='.trooth-new-posts{position:sticky;top:66px;z-index:10;display:none;width:max-content;max-width:calc(100% - 20px);margin:8px auto;padding:9px 15px;border:1px solid #b7dec5;border-radius:22px;background:#fff;color:#2d6a4f;box-shadow:0 4px 16px #245c3a22;font-weight:800;cursor:pointer}.trooth-new-posts.show{display:block}@media(max-width:650px){.trooth-new-posts{top:58px;font-size:12px}}';document.head.appendChild(s);
    }
    function mount(){
      if(stopped)return;
      style();
      var feed=document.getElementById('feed');if(!feed||document.querySelector('.trooth-new-posts'))return;
      var b=document.createElement('button');b.type='button';b.className='trooth-new-posts';b.textContent='🌿 New posts available · Tap to refresh';
      b.setAttribute('aria-label','Refresh the home feed with new posts');
      b.onclick=function(){if(stopped)return;pending=false;b.classList.remove('show');if(typeof window.loadPosts==='function')window.loadPosts();window.dispatchEvent(new CustomEvent('trooth-home-feed-manual-refresh'));};
      feed.parentNode.insertBefore(b,feed);
    }
    function announce(){
      if(stopped)return;
      mount();
      var b=document.querySelector('.trooth-new-posts');if(!b)return;
      pending=true;b.classList.add('show');
      clearTimeout(timer);timer=setTimeout(function(){if(!stopped&&pending)b.classList.remove('show')},30000);
    }
    function stop(){
      stopped=true;pending=false;clearTimeout(timer);timer=null;
      var b=document.querySelector('.trooth-new-posts');if(b)b.classList.remove('show');
    }
    function resume(){stopped=false;mount();}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
    window.addEventListener('trooth-home-feed-refresh',announce);
    window.addEventListener('trooth-feed-smart-refresh-stop',stop);
    window.addEventListener('trooth-feed-smart-refresh-start',resume);
    window.addEventListener('trooth-auth-profile-ready',resume);
    window.addEventListener('beforeunload',stop,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
