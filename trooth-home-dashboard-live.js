// Trooth Social Independent — Home Dashboard realtime coordinator v4
(function(){
  'use strict';
  function boot(){
    var s=window.troothSupabase;
    if(!s||window.__troothHomeDashboardLiveV4)return;
    window.__troothHomeDashboardLiveV4=true;
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

    function demoCard(name,role,text,time){
      return '<article class="card post demo-post"><div class="posthead"><div class="smavatar">'+name.charAt(0)+'</div><div><b>'+name+'</b><br><small>'+role+' • '+time+'</small></div></div><div class="postbody">'+text+'</div><div class="postactions"><button class="action">👍 Like <span>24</span></button><button class="action">💬 Comment <span>6</span></button><button class="action">↗ Share</button></div></article>';
    }
    function addDemoContent(){
      var feed=document.getElementById('feed');
      if(feed&&!feed.querySelector('.post')){
        feed.innerHTML=demoCard('Ali Khan','Community','🌿 Welcome to Trooth! آج کمیونٹی کی نئی سرگرمیاں اور دوستوں کی تازہ پوسٹس یہاں نظر آئیں گی۔','5 min ago')+
          demoCard('Sara Ahmed','Business','💼 Business Network پر نئے مقامی کاروبار اور services discover کریں۔ اپنے بزنس کو Trooth پر grow کریں۔','18 min ago')+
          demoCard('Trooth Sports','Sports','🏆 آج کے sports highlights، match updates اور fan discussions ایک ہی جگہ۔','32 min ago')+
          demoCard('Trooth News','News','📰 National اور international news کے اہم updates آپ کی Home Feed میں۔','45 min ago');
      }
      var hubs=[
        ['newsHub',['Pakistan News','World News','Business Headlines','Tech & Digital']],
        ['sportsHub',['Cricket Update','Football','Tennis','Sports Talk']],
        ['storesHub',['Fashion Store','Tech Store','Home & Living','Local Business']],
        ['propertyHub',['Modern Family Home','City Apartment','Commercial Space','Plot Opportunity']]
      ];
      hubs.forEach(function(pair){
        var h=document.getElementById(pair[0]);
        if(h&&!h.querySelector('.hubitem'))h.innerHTML=pair[1].map(function(t){return '<article class="hubitem"><span class="tag">Demo</span><h3>'+t+'</h3><p>Trooth پر تازہ معلومات اور مزید تفصیل یہاں دکھائی جائے گی۔</p></article>';}).join('');
      });
      var stories=document.getElementById('stories');
      if(stories&&stories.children.length===1){
        ['Ali','Sara','Sports','News'].forEach(function(n){var d=document.createElement('div');d.className='story';d.style.background='linear-gradient(145deg,#74c69d,#1b4332)';d.innerHTML='<b>'+n+'</b>';stories.appendChild(d);});
      }
    }
    setTimeout(addDemoContent,1400);
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
