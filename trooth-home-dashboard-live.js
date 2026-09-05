// Trooth Social Independent — Home Dashboard realtime hardening v2
(function(){
  'use strict';
  function boot(){
    var s=window.troothSupabase;
    if(!s)return;
    if(window.__troothHomeDashboardLiveV2)return;
    window.__troothHomeDashboardLiveV2=true;
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
    if(hero&&!document.getElementById('troothLiveStatus'))hero.parentNode.insertBefore(badge,hero.nextSibling);
    var timers={};
    function refresh(fn){try{var r=typeof fn==='function'?fn():window[fn]&&window[fn]();if(r&&typeof r.catch==='function')r.catch(function(){});}catch(e){}}
    function schedule(item,delay){
      var key=item[0];
      clearTimeout(timers[key]);
      timers[key]=setTimeout(function(){delete timers[key];refresh(item[2]);},delay||180);
    }
    function refreshAll(delay){tables.forEach(function(item){schedule(item,delay||220);});}
    var channel=s.channel('trooth-home-dashboard-live');
    tables.forEach(function(item){
      channel.on('postgres_changes',{event:'*',schema:'public',table:item[0]},function(){schedule(item,220);});
    });
    channel.subscribe(function(status){
      if(!badge)return;
      if(status==='SUBSCRIBED'){badge.textContent='● Live';badge.style.opacity='1';}
      else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){badge.textContent='● Reconnecting';badge.style.opacity='.75';}
    });
    var visibilityTimer=null;
    document.addEventListener('visibilitychange',function(){
      if(document.visibilityState==='visible'){
        clearTimeout(visibilityTimer);
        visibilityTimer=setTimeout(function(){refreshAll(120);},250);
      }
    });
    window.addEventListener('online',function(){refreshAll(150);});
    window.addEventListener('trooth-home-refresh',function(){refreshAll(100);});
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
