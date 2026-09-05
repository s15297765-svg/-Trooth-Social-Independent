// Trooth — profile social actions bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    async function getUser(){return (await sb.auth.getUser()).data.user||null}
    async function getState(uid,target){
      const [f,c]=await Promise.all([
        sb.from('friend_requests').select('id,sender_id,receiver_id,status').or(`and(sender_id.eq.${uid},receiver_id.eq.${target}),and(sender_id.eq.${target},receiver_id.eq.${uid})`),
        sb.from('connections').select('follower_id,following_id').or(`and(follower_id.eq.${uid},following_id.eq.${target}),and(follower_id.eq.${target},following_id.eq.${uid})`)
      ]);return {requests:f.data||[],connections:c.data||[]}
    }
    window.troothProfileSocialActions=async function(targetId,host){
      var uid=await getUser();if(!uid||uid.id===targetId)return;
      var state=await getState(uid.id,targetId);
      var following=state.connections.some(x=>x.follower_id===uid.id&&x.following_id===targetId);
      var request=state.requests.find(x=>x.status==='pending'&&x.sender_id===uid.id&&x.receiver_id===targetId);
      var friend=state.requests.some(x=>x.status==='accepted');
      var box=host||document.querySelector('[data-trooth-social-actions]');if(!box)return;
      box.innerHTML=`<button class="btn" data-act="follow">${following?'✓ Following':'Follow'}</button><button class="btn" data-act="friend">${friend?'✓ Friends':request?'⏳ Request Sent':'＋ Add Friend'}</button><button class="btn" data-act="message">💬 Message</button>`;
      box.querySelector('[data-act=follow]').onclick=async()=>{var r=following?await sb.from('connections').delete().eq('follower_id',uid.id).eq('following_id',targetId):await sb.from('connections').insert({follower_id:uid.id,following_id:targetId});if(r.error)alert(r.error.message);await window.troothProfileSocialActions(targetId,box)};
      box.querySelector('[data-act=friend]').onclick=async()=>{if(friend||request)return;var r=await sb.from('friend_requests').insert({sender_id:uid.id,receiver_id:targetId,status:'pending'});if(r.error)alert(r.error.message);await window.troothProfileSocialActions(targetId,box)};
      box.querySelector('[data-act=message]').onclick=()=>location.href='chat.html?user='+encodeURIComponent(targetId);
    };
    var target=new URLSearchParams(location.search).get('id')||new URLSearchParams(location.search).get('user');
    if(target){var host=document.querySelector('[data-trooth-social-actions]');if(host)window.troothProfileSocialActions(target,host)}
    window.addEventListener('trooth-social-refresh',function(){var h=document.querySelector('[data-trooth-social-actions]');if(target&&h)window.troothProfileSocialActions(target,h)});
    window.addEventListener('trooth-profile-social-refresh',function(){var h=document.querySelector('[data-trooth-social-actions]');if(target&&h)window.troothProfileSocialActions(target,h)});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();