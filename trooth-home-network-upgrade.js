// Trooth Social Independent — Home Network Live Upgrade v2
(function(){
  function start(){
    var s=window.troothSupabase;
    if(!s || window.__troothHomeNetworkUpgrade)return;
    window.__troothHomeNetworkUpgrade=true;
    var tables=[
      ['news_stories','newsHub'],
      ['sports_stories','sportsHub'],
      ['store_listings','storesHub'],
      ['properties','propertyHub'],
      ['film_fashion_stories','filmFashionHub']
    ];
    function refreshHub(table,id){
      if(typeof window.loadHub==='function') return window.loadHub(table,id);
    }
    function toast(msg){
      var el=document.getElementById('troothLiveToast');
      if(!el){el=document.createElement('div');el.id='troothLiveToast';el.style.cssText='position:fixed;right:16px;bottom:16px;background:#2d6a4f;color:#fff;padding:11px 15px;border-radius:12px;box-shadow:0 5px 18px #0002;z-index:99;font-weight:800;opacity:0;transition:.25s';document.body.appendChild(el)}
      el.textContent=msg;el.style.opacity='1';clearTimeout(el._t);el._t=setTimeout(function(){el.style.opacity='0'},2200);
    }
    function status(type,detail){try{window.dispatchEvent(new CustomEvent('trooth-home-network-status',{detail:{status:type,message:detail||''}}))}catch(e){}}
    var hero=document.querySelector('.hero');
    if(hero && !document.getElementById('troothLiveBadge')){
      var b=document.createElement('span');b.id='troothLiveBadge';b.className='tag';b.textContent='● LIVE NETWORK';b.style.marginLeft='6px';var tag=hero.querySelector('.tag');if(tag&&tag.parentNode)tag.after(b);else hero.appendChild(b);
    }
    var channel=s.channel('trooth-home-network-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(){if(typeof window.loadPosts==='function')window.loadPosts();toast('Live feed updated ✓');status('FEED_REFRESH','posts');})
      .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},function(){if(typeof window.loadStories==='function')window.loadStories();status('STORIES_REFRESH','stories_reels');})
      .on('postgres_changes',{event:'*',schema:'public',table:'news_stories'},function(){refreshHub('news_stories','newsHub');status('HUB_REFRESH','news_stories')})
      .on('postgres_changes',{event:'*',schema:'public',table:'sports_stories'},function(){refreshHub('sports_stories','sportsHub');status('HUB_REFRESH','sports_stories')})
      .on('postgres_changes',{event:'*',schema:'public',table:'store_listings'},function(){refreshHub('store_listings','storesHub');status('HUB_REFRESH','store_listings')})
      .on('postgres_changes',{event:'*',schema:'public',table:'properties'},function(){refreshHub('properties','propertyHub');status('HUB_REFRESH','properties')})
      .on('postgres_changes',{event:'*',schema:'public',table:'film_fashion_stories'},function(){refreshHub('film_fashion_stories','filmFashionHub');status('HUB_REFRESH','film_fashion_stories')});
    channel.subscribe(function(subStatus){
      if(subStatus==='SUBSCRIBED'){toast('Trooth Live Network connected ✓');status('CONNECTED','Live network connected');window.dispatchEvent(new CustomEvent('trooth-realtime-connected'));}
      else if(subStatus==='CHANNEL_ERROR'||subStatus==='TIMED_OUT'){status('RETRYING',subStatus);window.dispatchEvent(new CustomEvent('trooth-realtime-status',{detail:{status:'RETRYING',source:'home-network'}}));}
    });
    s.auth.onAuthStateChange(function(event){
      if(event==='SIGNED_IN' || event==='SIGNED_OUT') setTimeout(function(){location.reload()},250);
    });
    window.addEventListener('focus',function(){
      if(typeof window.loadPosts==='function')window.loadPosts();
      tables.forEach(function(x){refreshHub(x[0],x[1])});
    });
  }
  if(window.troothSupabase)start();else window.addEventListener('trooth-supabase-ready',start,{once:true});
})();
