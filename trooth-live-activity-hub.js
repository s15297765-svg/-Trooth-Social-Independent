// Trooth Social Independent — unified live activity hub
(function(){
  function boot(){
    if(window.__troothLiveActivityHub)return;window.__troothLiveActivityHub=true;
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    var channel=null,refreshTimer=null;
    function fire(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function refresh(names){
      clearTimeout(refreshTimer);refreshTimer=setTimeout(function(){(names||[]).forEach(function(name){fire(name)})},60);
    }
    function emit(table,payload){
      var row=payload.new||payload.old||{};
      fire('trooth-activity-live',{table:table,event:payload.eventType,payload:payload});
      if(table==='notifications'){
        fire('trooth-notification-live',row);
        refresh(['trooth-activity-refresh','trooth-notifications-refresh','trooth-unread-refresh']);
      }else if(table==='messages'){
        fire('trooth-message-live',row);
        refresh(['trooth-activity-refresh','trooth-messages-refresh','trooth-unread-refresh']);
      }else if(table==='friend_requests'||table==='connections'){
        fire('trooth-friend-live',row);
        refresh(['trooth-activity-refresh','trooth-friends-refresh','trooth-notifications-refresh']);
      }
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
    function refreshVisible(){
      refresh(['trooth-activity-refresh','trooth-notifications-refresh','trooth-unread-refresh','trooth-friends-refresh','trooth-messages-refresh','trooth-profile-social-refresh']);
    }
    window.addEventListener('trooth-realtime-reconnect',()=>{try{if(channel)sb.removeChannel(channel)}catch(e){}channel=null;setTimeout(connect,300)});
    window.addEventListener('online',()=>setTimeout(connect,400));
    window.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshVisible()});
    connect();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
