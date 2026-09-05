// Trooth Social Independent — Home Dashboard realtime hardening
(function(){
  'use strict';
  function boot(){
    var s=window.troothSupabase;
    if(!s) return;
    var tables=[
      ['posts','feed','loadPosts'],
      ['stories_reels','stories','loadStories'],
      ['news_stories','newsHub',function(){return window.loadHub&&window.loadHub('news_stories','newsHub')}],
      ['sports_stories','sportsHub',function(){return window.loadHub&&window.loadHub('sports_stories','sportsHub')}],
      ['store_listings','storesHub',function(){return window.loadHub&&window.loadHub('store_listings','storesHub')}],
      ['properties','propertyHub',function(){return window.loadHub&&window.loadHub('properties','propertyHub')}]
    ];
    var badge=document.createElement('span');
    badge.id='troothLiveStatus';
    badge.textContent='● Live';
    badge.style.cssText='display:inline-block;margin-left:8px;background:#d8f3dc;color:#2d6a4f;padding:5px 9px;border-radius:20px;font-size:11px;font-weight:800;vertical-align:middle';
    var hero=document.querySelector('.hero .tag');
    if(hero&&!document.getElementById('troothLiveStatus')) hero.parentNode.insertBefore(badge,hero.nextSibling);
    function refresh(fn){try{var r=typeof fn==='function'?fn():window[fn]&&window[fn]();if(r&&typeof r.catch==='function')r.catch(function(){});}catch(e){}}
    var channel=s.channel('trooth-home-dashboard-live');
    tables.forEach(function(item){
      channel.on('postgres_changes',{event:'*',schema:'public',table:item[0]},function(){refresh(item[2]);});
    });
    channel.subscribe(function(status){
      if(!badge)return;
      if(status==='SUBSCRIBED'){badge.textContent='● Live';badge.style.opacity='1';}
      else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){badge.textContent='● Reconnecting';badge.style.opacity='.75';}
    });
    var timer=null;
    document.addEventListener('visibilitychange',function(){
      if(document.visibilityState==='visible'){
        clearTimeout(timer);
        timer=setTimeout(function(){
          tables.forEach(function(item){refresh(item[2]);});
        },250);
      }
    });
    window.addEventListener('online',function(){tables.forEach(function(item){refresh(item[2]);});});
    window.addEventListener('trooth-home-refresh',function(){tables.forEach(function(item){refresh(item[2]);});});
  }
  if(window.troothSupabase) boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
