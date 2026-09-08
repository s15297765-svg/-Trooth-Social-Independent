// Trooth Notifications Live v2 — realtime unread/read synchronization for notifications, friend requests and messages
(function(){
  if(window.__troothNotificationLiveV2)return;
  window.__troothNotificationLiveV2=true;
  var channel=null,clientRef=null,timer=null;
  function client(){return window.troothSupabase||null;}
  function refresh(kind){
    clearTimeout(timer);
    timer=setTimeout(function(){
      try{window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'realtime',kind:kind||'notification'}}));}catch(e){}
      try{window.dispatchEvent(new CustomEvent('trooth-unread-refresh',{detail:{source:'realtime',kind:kind||'notification'}}));}catch(e){}
      if(kind==='message')try{window.dispatchEvent(new CustomEvent('trooth-messages-refresh',{detail:{source:'realtime'}}));}catch(e){}
    },180);
  }
  function subscribe(){
    var sb=client();
    if(!sb)return;
    if(channel&&clientRef===sb)return;
    try{if(channel&&clientRef)clientRef.removeChannel(channel);}catch(e){}
    channel=null;clientRef=sb;
    try{
      channel=sb.channel('trooth-notifications-live-v2')
        .on('postgres_changes',{event:'*',schema:'public',table:'notifications'},function(){refresh('notification')})
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(){refresh('friend_request')})
        .on('postgres_changes',{event:'*',schema:'public',table:'messages'},function(){refresh('message')})
        .subscribe();
    }catch(e){channel=null;}
  }
  function start(){
    subscribe();
    window.addEventListener('trooth-supabase-ready',subscribe);
    window.addEventListener('online',function(){subscribe();refresh('connection');});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){subscribe();refresh('visibility');}});
    window.addEventListener('pageshow',function(){subscribe();refresh('pageshow');});
    window.addEventListener('beforeunload',function(){try{if(channel&&clientRef)clientRef.removeChannel(channel);}catch(e){}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
