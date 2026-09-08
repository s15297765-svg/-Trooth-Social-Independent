// Trooth Notifications Live v1 — realtime unread/read synchronization, visual design unchanged
(function(){
  if(window.__troothNotificationLiveV1)return;
  window.__troothNotificationLiveV1=true;
  var channel=null,clientRef=null,timer=null;
  function client(){return window.troothSupabase||null;}
  function refresh(){
    clearTimeout(timer);
    timer=setTimeout(function(){
      try{window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'realtime'}}));}catch(e){}
      try{window.dispatchEvent(new CustomEvent('trooth-unread-refresh',{detail:{source:'realtime'}}));}catch(e){}
    },180);
  }
  function subscribe(){
    var sb=client();
    if(!sb)return;
    if(channel&&clientRef===sb)return;
    try{if(channel&&clientRef)clientRef.removeChannel(channel);}catch(e){}
    channel=null;clientRef=sb;
    try{
      channel=sb.channel('trooth-notifications-live-v1')
        .on('postgres_changes',{event:'*',schema:'public',table:'notifications'},refresh)
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},refresh)
        .subscribe();
    }catch(e){channel=null;}
  }
  function start(){
    subscribe();
    window.addEventListener('trooth-supabase-ready',subscribe);
    window.addEventListener('online',function(){subscribe();refresh();});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){subscribe();refresh();}});
    window.addEventListener('pageshow',function(){subscribe();refresh();});
    window.addEventListener('beforeunload',function(){try{if(channel&&clientRef)clientRef.removeChannel(channel);}catch(e){}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
