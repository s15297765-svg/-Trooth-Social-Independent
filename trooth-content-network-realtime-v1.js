// Trooth Social Independent — unified content hubs realtime bridge v1
(function(){
  'use strict';
  let sb,channel;
  const tables={
    news_stories:'trooth-news-live',
    sports_stories:'trooth-sports-live',
    store_listings:'trooth-stores-live',
    properties:'trooth-property-live',
    film_fashion_stories:'trooth-film-fashion-live'
  };
  function boot(){
    if(window.troothSupabase){start(window.troothSupabase);return;}
    window.addEventListener('trooth-supabase-ready',()=>start(window.troothSupabase),{once:true});
  }
  function start(client){
    if(!client||channel)return;
    sb=client;
    channel=sb.channel('trooth-content-network-realtime')
      .on('postgres_changes',{event:'*',schema:'public',table:'news_stories'},()=>refresh('news_stories'))
      .on('postgres_changes',{event:'*',schema:'public',table:'sports_stories'},()=>refresh('sports_stories'))
      .on('postgres_changes',{event:'*',schema:'public',table:'store_listings'},()=>refresh('store_listings'))
      .on('postgres_changes',{event:'*',schema:'public',table:'properties'},()=>refresh('properties'))
      .on('postgres_changes',{event:'*',schema:'public',table:'film_fashion_stories'},()=>refresh('film_fashion_stories'))
      .subscribe(status=>{
        if(status==='SUBSCRIBED')window.dispatchEvent(new CustomEvent('trooth-content-network-connected'));
      });
  }
  function refresh(table){
    const name=tables[table];
    if(name)window.dispatchEvent(new CustomEvent(name,{detail:{table}}));
    window.dispatchEvent(new CustomEvent('trooth-content-network-refresh',{detail:{table}}));
  }
  window.addEventListener('beforeunload',()=>{if(channel&&sb)try{sb.removeChannel(channel)}catch(e){}});
  boot();
})();
