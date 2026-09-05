// Trooth Social Independent — Home Network Live Upgrade
(function(){
  function start(){
    var s=window.troothSupabase;
    if(!s) return;
    var tables=[
      ['news_stories','newsHub'],
      ['sports_stories','sportsHub'],
      ['store_listings','storesHub'],
      ['properties','propertyHub']
    ];
    function refreshHub(table,id){
      if(typeof window.loadHub==='function') return window.loadHub(table,id);
    }
    function toast(msg){
      var el=document.getElementById('troothLiveToast');
      if(!el){el=document.createElement('div');el.id='troothLiveToast';el.style.cssText='position:fixed;right:16px;bottom:16px;background:#2d6a4f;color:#fff;padding:11px 15px;border-radius:12px;box-shadow:0 5px 18px #0002;z-index:99;font-weight:800;opacity:0;transition:.25s';document.body.appendChild(el)}
      el.textContent=msg;el.style.opacity='1';clearTimeout(el._t);el._t=setTimeout(function(){el.style.opacity='0'},2200);
    }
    var hero=document.querySelector('.hero');
    if(hero && !document.getElementById('troothLiveBadge')){
      var b=document.createElement('span');b.id='troothLiveBadge';b.className='tag';b.textContent='● LIVE NETWORK';b.style.marginLeft='6px';hero.querySelector('.tag')?.after(b);
    }
    s.channel('trooth-home-network-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'posts'},function(){ if(typeof window.loadPosts==='function') window.loadPosts(); toast('Live feed updated ✓'); })
      .on('postgres_changes',{event:'*',schema:'public',table:'stories_reels'},function(){ if(typeof window.loadStories==='function') window.loadStories(); })
      .on('postgres_changes',{event:'*',schema:'public',table:'news_stories'},function(){refreshHub('news_stories','newsHub')})
      .on('postgres_changes',{event:'*',schema:'public',table:'sports_stories'},function(){refreshHub('sports_stories','sportsHub')})
      .on('postgres_changes',{event:'*',schema:'public',table:'store_listings'},function(){refreshHub('store_listings','storesHub')})
      .on('postgres_changes',{event:'*',schema:'public',table:'properties'},function(){refreshHub('properties','propertyHub')})
      .subscribe(function(status){
        if(status==='SUBSCRIBED') toast('Trooth Live Network connected ✓');
      });
    s.auth.onAuthStateChange(function(event){
      if(event==='SIGNED_IN' || event==='SIGNED_OUT') setTimeout(function(){location.reload()},250);
    });
    window.addEventListener('focus',function(){
      if(typeof window.loadPosts==='function') window.loadPosts();
      tables.forEach(function(x){refreshHub(x[0],x[1])});
    });
  }
  if(window.troothSupabase) start();
  else window.addEventListener('trooth-supabase-ready',start,{once:true});
})();
