// Trooth — Friends live enhancement
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothFriendsLiveEnhancementReady)return;
    window.troothFriendsLiveEnhancementReady=true;
    var stopped=false,channel=null,reconnectTimer=null,refreshTimer=null,authSub=null,busy=false,pending=false,lastRefresh=0;

    function scheduleRefresh(){
      if(stopped){pending=true;return;}
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(async function(){
        refreshTimer=null;
        if(stopped){pending=true;return;}
        if(busy){pending=true;return;}
        busy=true;pending=false;
        try{
          var r=await sb.auth.getUser(),u=r.data&&r.data.user;
          if(!u)return;
          var q=await sb.from('friend_requests').select('id').eq('receiver_id',u.id).eq('status','pending');
          if(q.error)throw q.error;
          var count=(q.data||[]).length;
          if(stopped)return;
          document.querySelectorAll('[data-trooth-friend-request-count]').forEach(function(el){el.textContent=String(count);el.hidden=count===0});
          window.dispatchEvent(new CustomEvent('trooth-friend-requests-refresh',{detail:{count:count,source:'friends-live-enhancement'}}));
          lastRefresh=Date.now();
        }catch(e){console.warn('Trooth friends badge:',e)}
        finally{busy=false;if(pending&&!stopped)scheduleRefresh()}
      },120);
    }

    function clearChannel(){
      clearTimeout(reconnectTimer);reconnectTimer=null;
      var ch=channel||window.troothFriendsRequestBadgeChannel;
      if(ch)try{sb.removeChannel(ch)}catch(e){}
      channel=null;window.troothFriendsRequestBadgeChannel=null;
    }

    function subscribe(){
      if(stopped||!sb.channel)return;
      clearChannel();
      var ch=sb.channel('trooth-friends-request-badge-'+Date.now())
        .on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},function(){scheduleRefresh()})
        .subscribe(function(state){
          if((state==='CHANNEL_ERROR'||state==='TIMED_OUT')&&!stopped){
            clearChannel();
            reconnectTimer=setTimeout(subscribe,800);
          }
        });
      channel=ch;window.troothFriendsRequestBadgeChannel=ch;
    }

    function resume(){
      stopped=false;
      subscribe();
      if(pending||Date.now()-lastRefresh>500)scheduleRefresh();
    }

    function stop(){
      stopped=true;pending=false;
      clearTimeout(refreshTimer);refreshTimer=null;
      clearChannel();
      document.querySelectorAll('[data-trooth-friend-request-count]').forEach(function(el){el.textContent='0';el.hidden=true});
    }

    scheduleRefresh();subscribe();
    if(sb.auth&&sb.auth.onAuthStateChange){
      authSub=sb.auth.onAuthStateChange(function(event){
        if(event==='SIGNED_OUT'||event==='USER_DELETED')stop();
        else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')resume();
      });
    }
    window.addEventListener('beforeunload',function(){
      stop();
      try{if(authSub&&authSub.data&&authSub.data.subscription)authSub.data.subscription.unsubscribe()}catch(e){}
    },{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
