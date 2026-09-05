// Trooth Social Independent — unified live activity hub
(function(){
  function boot(){
    if(window.__troothLiveActivityHub)return;window.__troothLiveActivityHub=true;
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    var channel=null;
    function fire(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function refreshAll(){
      fire('trooth-activity-refresh');
      fire('trooth-notifications-refresh');
      fire('trooth-unread-refresh');
      fire('trooth-friends-refresh');
      fire('trooth-messages-refresh');
      fire('trooth-profile-social-refresh');
    }
    function emit(table,payload){
      fire('trooth-activity-live',{table:table,event:payload.eventType,payload:payload});
      if(table==='notifications')fire('trooth-notification-live',{detail:payload.new||{}});
      if(table==='messages')fire('trooth-message-live',{detail:payload.new||{}});
      if(table==='friend_requests'||table==='connections')fire('trooth-friend-live',{detail:payload.new||payload.old||{}});
      refreshAll();
    }
    function connect(){
      if(channel)return;
      channel=sb.channel('trooth-live-activity-hub')
        .on('postgres_changes',{event:'*',schema:'public',table:'notifications'},p=>emit('notifications',p))
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},p=>emit('messages',p))
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},p=>emit('friend_requests',p))
        .on('postgres_changes',{event:'*',schema:'public',table:'connections'},p=>emit('connections',p))
        .subscribe();
    }
    window.addEventListener('trooth-realtime-reconnect',()=>{try{if(channel)sb.removeChannel(channel)}catch(e){}channel=null;setTimeout(connect,300)});
    window.addEventListener('online',()=>setTimeout(connect,400));
    window.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshAll()});
    connect();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
