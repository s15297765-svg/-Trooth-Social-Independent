// Trooth — live profile notification bridge
(function(){
  var start=function(){
    var sb=window.troothSupabase;if(!sb)return;
    sb.auth.getUser().then(function(r){
      var user=r.data&&r.data.user;if(!user)return;
      var channel=sb.channel('trooth-profile-notifications')
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},function(e){
          window.dispatchEvent(new CustomEvent('trooth-profile-notification',{detail:e.new}));
          var n=document.querySelector('[data-trooth-notification-count]');
          if(n){var v=parseInt(n.textContent||'0',10)||0;n.textContent=String(v+1);n.hidden=false;}
        }).subscribe();
      window.troothProfileNotificationChannel=channel;
    });
  };
  if(window.troothSupabase)start();else window.addEventListener('trooth-supabase-ready',start,{once:true});
})();
