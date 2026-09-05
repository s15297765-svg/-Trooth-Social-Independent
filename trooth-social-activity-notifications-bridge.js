// Trooth Social Independent — Live Social Activity → Notifications bridge v2
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    if(window.troothSocialActivityNotificationsV2)return;window.troothSocialActivityNotificationsV2=true;
    var user=null,channel=null,timer=null,last=0,busy=false;
    function emitRefresh(delay){
      clearTimeout(timer);timer=setTimeout(function(){
        var now=Date.now();if(busy||now-last<650)return;last=now;busy=true;
        try{
          window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'social-activity-v2'}}));
          window.dispatchEvent(new CustomEvent('trooth-activity-refresh',{detail:{source:'social-activity-v2'}}));
        }finally{setTimeout(function(){busy=false},120)}
      },delay||180);
    }
    async function loadUser(){var r=await sb.auth.getUser();user=r.data&&r.data.user||null;return user}
    function subscribe(){
      if(channel||!user||!sb.channel)return;
      channel=sb.channel('trooth-social-notifications-'+user.id)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},function(e){
          window.dispatchEvent(new CustomEvent('trooth-notification-live',{detail:e.new}));
          emitRefresh(90);
        }).subscribe();
    }
    async function bootUser(){await loadUser();if(user)subscribe();emitRefresh(220)}
    bootUser();
    sb.auth.onAuthStateChange(function(_e,s){
      user=s?.user||null;
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}
      if(user)subscribe();
      emitRefresh(240);
    });
    ['trooth-post-liked','trooth-comment-added','trooth-post-shared'].forEach(function(name){
      window.addEventListener(name,function(){emitRefresh(180)});
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
