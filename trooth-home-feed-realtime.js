// Trooth Social Independent — Home Feed Realtime / Smart Refresh
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb) return setTimeout(boot,300);
    if(window.troothHomeFeedRealtimeReady) return;
    window.troothHomeFeedRealtimeReady=true;

    var feed=document.getElementById('feed');
    var pending=0,channel=null,authSub=null,subscribing=false,lastRefresh=0,refreshTimer=null;
    function emit(detail){window.dispatchEvent(new CustomEvent('trooth-home-feed-refresh',{detail:detail||{}}))}
    function hideBanner(){var el=document.getElementById('trooth-new-posts-banner');if(el)el.remove();pending=0}
    function refreshNow(){
      var now=Date.now();
      if(now-lastRefresh<900)return;
      lastRefresh=now;hideBanner();
      if(typeof window.loadPosts==='function')window.loadPosts();
      emit({source:'smart-refresh'});
    }
    function scheduleRefresh(){
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(function(){
        if(document.visibilityState==='visible')refreshNow();
      },1200);
    }
    function showNewPostsBanner(){
      pending++;if(!feed)return;
      var el=document.getElementById('trooth-new-posts-banner');
      if(!el){
        el=document.createElement('button');el.id='trooth-new-posts-banner';el.type='button';el.setAttribute('aria-live','polite');el.setAttribute('aria-label','Show new posts');el.onclick=refreshNow;
        (feed.parentNode||feed).insertBefore(el,feed);
      }
      el.textContent='🌿 '+pending+' new post'+(pending===1?'':'s')+' available · Refreshing…';
      scheduleRefresh();
    }
    var style=document.createElement('style');style.textContent=`
      #trooth-new-posts-banner{display:block;width:100%;margin:8px 0;padding:11px 14px;border:1px solid #b7dfc7;border-radius:13px;background:#e8f5ed;color:#245c3a;font-weight:800;cursor:pointer;box-shadow:0 3px 12px #245c3a18;transition:transform .18s ease,box-shadow .18s ease}
      #trooth-new-posts-banner:hover{transform:translateY(-1px);box-shadow:0 5px 16px #245c3a22}
      @media(max-width:650px){#trooth-new-posts-banner{position:sticky;top:62px;z-index:20;font-size:12px;padding:10px 12px}}
      @media(prefers-reduced-motion:reduce){#trooth-new-posts-banner{transition:none}}
    `;document.head.appendChild(style);
    function cleanup(){clearTimeout(refreshTimer);hideBanner();if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}window.troothHomeFeedRealtimeChannel=null}
    function subscribe(){
      if(subscribing)return;
      subscribing=true;cleanup();
      channel=sb.channel('trooth-home-feed-realtime-'+Date.now())
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},function(e){showNewPostsBanner();emit({source:'new-post',post:e&&e.new||null})})
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'posts'},function(e){emit({source:'post-update',post:e&&e.new||null});scheduleRefresh()})
        .on('postgres_changes',{event:'DELETE',schema:'public',table:'posts'},function(e){emit({source:'post-delete',post:e&&e.old||null});scheduleRefresh()})
        .subscribe(function(status){
          subscribing=false;
          if(status==='SUBSCRIBED')window.troothHomeFeedRealtimeChannel=channel;
        });
    }
    subscribe();
    var auth=sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||!session){cleanup();return}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')subscribe();
    });
    authSub=auth&&auth.data&&auth.data.subscription?auth.data.subscription:null;
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&pending)refreshNow()});
    window.addEventListener('focus',function(){if(pending)refreshNow()});
    window.addEventListener('beforeunload',function(){
      cleanup();
      if(authSub){try{authSub.unsubscribe()}catch(e){}}
    },{once:true});
    window.troothHomeFeedRefresh=refreshNow;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
