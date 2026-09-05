// Trooth Social Independent — Live Social Activity → Notifications bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    if(window.troothSocialActivityNotificationsReady)return;window.troothSocialActivityNotificationsReady=true;
    var user=null,channel=null;
    async function sync(){var r=await sb.auth.getUser();user=r.data&&r.data.user||null;if(!user)return;
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-activity-refresh'));
    }
    function subscribe(){if(channel||!user||!sb.channel)return;channel=sb.channel('trooth-social-notifications-'+user.id).on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},function(e){
      window.dispatchEvent(new CustomEvent('trooth-notification-live',{detail:e.new}));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:e.new}));
      window.dispatchEvent(new CustomEvent('trooth-activity-refresh',{detail:e.new}));
    }).subscribe();}
    sb.auth.getUser().then(function(r){user=r.data&&r.data.user||null;subscribe();sync()});
    sb.auth.onAuthStateChange(function(_e,s){user=s?.user||null;if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}subscribe();sync()});
    ['trooth-post-liked','trooth-comment-added','trooth-post-shared'].forEach(function(name){window.addEventListener(name,function(e){window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:e.detail||{}}));});});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
