// Trooth Social Independent — Friends + Groups unified realtime activity v1
(function(){
  if(window.__troothSocialNetworkRealtimeV1)return;window.__troothSocialNetworkRealtimeV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var uid=null,ch=null,retry=null,busy=false;
    function emit(type,detail){window.dispatchEvent(new CustomEvent(type,{detail:Object.assign({source:'social-network-realtime-v1'},detail||{})}))}
    function cleanup(){clearTimeout(retry);retry=null;if(ch){try{sb.removeChannel(ch)}catch(e){}ch=null}}
    async function subscribe(){
      cleanup();if(!navigator.onLine)return;
      try{var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null}catch(e){uid=null}
      if(!uid)return;
      ch=sb.channel('trooth-network-live-'+uid+'-'+Date.now())
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+uid},function(p){emit('trooth-friends-refresh',{event:p.eventType});emit('trooth-network-activity',{kind:'friend_request',event:p.eventType})})
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'sender_id=eq.'+uid},function(p){emit('trooth-friends-refresh',{event:p.eventType});emit('trooth-network-activity',{kind:'friend_request',event:p.eventType})})
        .on('postgres_changes',{event:'*',schema:'public',table:'group_members',filter:'user_id=eq.'+uid},function(p){emit('trooth-groups-refresh',{event:p.eventType});emit('trooth-network-activity',{kind:'group_member',event:p.eventType})})
        .on('postgres_changes',{event:'*',schema:'public',table:'group_join_requests',filter:'user_id=eq.'+uid},function(p){emit('trooth-groups-refresh',{event:p.eventType});emit('trooth-network-activity',{kind:'group_join_request',event:p.eventType})})
        .on('postgres_changes',{event:'*',schema:'public',table:'group_announcements'},function(p){emit('trooth-groups-refresh',{event:p.eventType});emit('trooth-network-activity',{kind:'group_announcement',event:p.eventType})})
        .subscribe(function(status){
          emit('trooth-network-realtime-status',{status:status});
          if((status==='CHANNEL_ERROR'||status==='TIMED_OUT')&&!busy){busy=true;retry=setTimeout(function(){busy=false;subscribe()},1600)}
        });
    }
    window.troothRefreshSocialNetworkRealtime=subscribe;
    subscribe();
    sb.auth.onAuthStateChange(function(e){if(e==='SIGNED_OUT'){uid=null;cleanup()}else if(e==='SIGNED_IN'||e==='TOKEN_REFRESHED'||e==='USER_UPDATED')setTimeout(subscribe,100)});
    window.addEventListener('online',function(){setTimeout(subscribe,120)});
    window.addEventListener('beforeunload',cleanup,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
