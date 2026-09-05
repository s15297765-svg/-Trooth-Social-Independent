// Trooth Social Independent — Home Dashboard realtime coordinator v3
(function(){
  'use strict';
  function boot(){
    var s=window.troothSupabase;
    if(!s||window.__troothHomeDashboardLiveV3)return;
    window.__troothHomeDashboardLiveV3=true;
    var tables=[
      ['posts','feed','loadPosts'],
      ['stories_reels','stories','loadStories'],
      ['news_stories','newsHub',function(){return window.loadHub&&window.loadHub('news_stories','newsHub')}],
      ['sports_stories','sportsHub',function(){return window.loadHub&&window.loadHub('sports_stories','sportsHub')}],
      ['store_listings','storesHub',function(){return window.loadHub&&window.loadHub('store_listings','storesHub')}],
      ['properties','propertyHub',function(){return window.loadHub&&window.loadHub('properties','propertyHub')}],
      ['film_fashion_stories','filmFashionHub',function(){return window.loadHub&&window.loadHub('film_fashion_stories','filmFashionHub')}]
    ];
    var badge=document.createElement('span');
    badge.id='troothLiveStatus';
    badge.textContent='● Live';
    badge.style.cssText='display:inline-block;margin-left:8px;background:#d8f3dc;color:#2d6a4f;padding:5px 9px;border-radius:20px;font-size:11px;font-weight:800;vertical-align:middle';
    var hero=document.querySelector('.hero .tag');
    if(hero&&!document.getElementById('troothLiveStatus'))hero.parentNode.insertBefore(badge,hero.nextSibling);
    var timers={};
    function refresh(fn){try{var r=typeof fn==='function'?fn():window[fn]&&window[fn]();if(r&&typeof r.catch==='function')r.catch(function(){});}catch(e){}}
    function schedule(item,delay){
      var key=item[0];clearTimeout(timers[key]);
      timers[key]=setTimeout(function(){delete timers[key];refresh(item[2]);},delay||180);
    }
    function refreshAll(delay){tables.forEach(function(item){schedule(item,delay||220);});}
    function setBadge(text,opacity){if(!badge)return;badge.textContent=text;badge.style.opacity=opacity||'1';}
    // Reuse the existing Home Network realtime owner; do not open another Supabase channel.
    window.addEventListener('trooth-home-network-status',function(e){
      var d=e.detail||{},st=d.status;
      if(st==='CONNECTED')setBadge('● Live','1');
      else if(st==='RETRYING')setBadge('● Reconnecting','0.75');
      else if(st==='OFFLINE')setBadge('● Offline','0.65');
      if(st==='FEED_REFRESH'||st==='STORIES_REFRESH'||st==='HUB_REFRESH')refreshAll(120);
    });
    window.addEventListener('trooth-home-hub-refresh',function(){refreshAll(120);});
    window.addEventListener('trooth-feed-refreshed',function(){schedule(tables[0],100);});
    window.addEventListener('trooth-home-refresh',function(){refreshAll(100);});
    var visibilityTimer=null;
    document.addEventListener('visibilitychange',function(){
      if(document.visibilityState==='visible'){
        clearTimeout(visibilityTimer);visibilityTimer=setTimeout(function(){refreshAll(120);},250);
      }
    });
    window.addEventListener('online',function(){setBadge('● Live','1');refreshAll(150);});
    window.addEventListener('offline',function(){setBadge('● Offline','0.65');});
    window.addEventListener('beforeunload',function(){clearTimeout(visibilityTimer);Object.keys(timers).forEach(function(k){clearTimeout(timers[k]);});},{once:true});
    if(navigator.onLine===false)setBadge('● Offline','0.65');
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
