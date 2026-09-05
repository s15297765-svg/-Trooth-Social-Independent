// Trooth Social Independent — unified live activity hub v2
(function(){
  function boot(){
    if(window.__troothLiveActivityHubV2)return;window.__troothLiveActivityHubV2=true;
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    var channel=null,refreshTimer=null,reconnectTimer=null,connecting=false,lastEvent={};
    function fire(name,detail){window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}
    function refresh(names){
      clearTimeout(refreshTimer);refreshTimer=setTimeout(function(){(names||[]).forEach(function(name){fire(name,{source:'live-activity-hub-v2'})})},90);
    }
    function emit(table,payload){
      var row=payload.new||payload.old||{},id=row.id||row.post_id||row.message_id||'general',k=table+':'+id+':'+(payload.eventType||'change'),now=Date.now();
      if(lastEvent[k]&&now-lastEvent[k]<250)return;lastEvent[k]=now;
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
    function clearChannel(){if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}}
    function connect(){
      clearTimeout(reconnectTimer);if(channel||connecting)return;connecting=true;
      try{
        channel=sb.channel('trooth-live-activity-hub-v2')
          .on('postgres_changes',{event:'*',schema:'public',table:'notifications'},p=>emit('notifications',p))
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},p=>emit('messages',p))
          .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},p=>emit('friend_requests',p))
          .on('postgres_changes',{event:'*',schema:'public',table:'connections'},p=>emit('connections',p))
          .subscribe(function(status){
            connecting=false;
            if(status==='SUBSCRIBED'){fire('trooth-live-activity-ready',{source:'live-activity-hub-v2'})}
            else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){clearChannel();reconnectTimer=setTimeout(connect,900)}
          });
      }catch(e){connecting=false;clearChannel();reconnectTimer=setTimeout(connect,1200)}
    }
    function refreshVisible(){
      refresh(['trooth-activity-refresh','trooth-notifications-refresh','trooth-unread-refresh','trooth-friends-refresh','trooth-messages-refresh','trooth-profile-social-refresh']);
    }
    window.addEventListener('trooth-realtime-reconnect',function(){clearChannel();setTimeout(connect,250)});
    window.addEventListener('online',function(){setTimeout(connect,350);refreshVisible()});
    window.addEventListener('visibilitychange',function(){if(!document.hidden){setTimeout(connect,180);refreshVisible()}});
    window.addEventListener('beforeunload',function(){clearTimeout(refreshTimer);clearTimeout(reconnectTimer);clearChannel()},{once:true});
    connect();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
