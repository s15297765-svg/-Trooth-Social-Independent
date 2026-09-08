// Trooth Live Feed v2 — realtime feed refresh layer, visual design unchanged
(function(){
  if(window.__troothLiveFeedV2)return;
  window.__troothLiveFeedV2=true;
  var channel=null,started=false,timer=null;
  function sb(){return window.troothSupabase||null;}
  function refresh(){
    clearTimeout(timer);
    timer=setTimeout(function(){
      try{window.dispatchEvent(new CustomEvent('trooth-feed-refresh',{detail:{source:'realtime'}}));}catch(e){}
      try{window.dispatchEvent(new CustomEvent('trooth-live-feed-refresh',{detail:{source:'realtime'}}));}catch(e){}
    },180);
  }
  function subscribe(){
    var client=sb();
    if(!client||channel)return;
    try{
      channel=client.channel('trooth-live-feed-v2')
        .on('postgres_changes',{event:'*',schema:'public',table:'posts'},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'comments'},refresh)
        .subscribe();
    }catch(e){channel=null;}
  }
  function start(){
    if(started)return;
    started=true;
    subscribe();
    window.addEventListener('trooth-supabase-ready',subscribe);
    window.addEventListener('online',refresh);
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){subscribe();refresh();}});
    window.addEventListener('beforeunload',function(){try{if(channel&&sb())sb().removeChannel(channel);}catch(e){}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
