// Trooth Social Independent — social graph notification bridge v2
(function(){
  if(window.__troothSocialGraphNotifyV2)return;window.__troothSocialGraphNotifyV2=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var me=null,channel=null,seen={};
    async function who(){try{var r=await sb.auth.getUser();me=r.data&&r.data.user||null}catch(e){me=null}}
    async function push(row,kind,body,actor){
      if(!me||!actor||actor===me.id)return;
      var key=kind+':'+(row.id||'')+':'+me.id;if(seen[key])return;seen[key]=1;
      try{await sb.from('notifications').insert({user_id:me.id,actor_id:actor,kind:kind,body:body,is_read:false});window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'social-graph',kind:kind}}))}catch(e){console.warn('Trooth social graph notification:',e.message)}
    }
    function subscribe(){
      if(!me)return;
      if(channel)try{channel.unsubscribe()}catch(e){}
      channel=sb.channel('trooth-social-graph-notify-v2')
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'friend_requests'},function(p){var r=p.new||{};if(r.receiver_id===me.id)push(r,'friend_request','👥 Someone sent you a friend request',r.sender_id)})
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'friend_requests'},function(p){var old=p.old||{},r=p.new||{};if(r.status==='accepted'&&old.status!=='accepted'&&r.sender_id===me.id)push(r,'friend_accepted','🤝 Your friend request was accepted',r.receiver_id)})
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'connections'},function(p){var r=p.new||{};if(r.following_id===me.id)push(r,'follow','➤ Someone started following you',r.follower_id)})
        .subscribe();
    }
    who().then(subscribe);sb.auth.onAuthStateChange(function(){who().then(subscribe)});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
