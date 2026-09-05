// Trooth — Groups -> Notifications realtime bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothGroupNotificationsBooted)return;
    window.troothGroupNotificationsBooted=true;
    var uid=null,ch=null;
    function notify(kind,body,actorId,postId){
      if(!uid||!body)return;
      var row={user_id:uid,actor_id:actorId||uid,kind:kind,body:body,is_read:false};
      if(postId)row.post_id=postId;
      sb.from('notifications').insert(row).then(function(){});
    }
    async function subscribe(){
      var r=await sb.auth.getUser();uid=r.data&&r.data.user?r.data.user.id:null;
      if(!uid)return;
      if(ch)try{sb.removeChannel(ch)}catch(e){}
      ch=sb.channel('trooth-group-notifications-'+uid)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'group_join_requests'},async function(p){
          var x=p.new;if(!x||x.user_id===uid)return;
          var g=await sb.from('groups').select('name,created_by').eq('id',x.group_id).maybeSingle();
          if(g.data&&g.data.created_by===uid)notify('group_join_request','📨 New join request for '+g.data.name,x.user_id);
        })
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'group_announcements'},async function(p){
          var x=p.new;if(!x)return;
          var g=await sb.from('groups').select('name,created_by').eq('id',x.group_id).maybeSingle();
          if(!g.data)return;
          var m=await sb.from('group_members').select('user_id').eq('group_id',x.group_id).neq('user_id',x.created_by||uid);
          (m.data||[]).filter(function(v){return v.user_id!==uid}).forEach(function(v){
            notify('group_announcement','📢 New announcement in '+g.data.name,x.created_by||uid);
          });
        })
        .subscribe();
    }
    subscribe();
    sb.auth.onAuthStateChange(function(e){if(e==='SIGNED_IN'||e==='TOKEN_REFRESHED'||e==='USER_UPDATED')subscribe();});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
