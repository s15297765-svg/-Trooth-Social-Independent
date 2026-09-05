// Trooth Social Independent — real Profile/Friends persistence bridge v1
(function(){
  if(window.__troothProfileFriendsPersistenceV1)return;window.__troothProfileFriendsPersistenceV1=true;
  function toast(msg){var t=document.getElementById('trooth-persistence-toast');if(!t){t=document.createElement('div');t.id='trooth-persistence-toast';t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#1f7a4d;color:#fff;padding:10px 16px;border-radius:999px;font:600 14px system-ui;box-shadow:0 8px 24px rgba(0,0,0,.18)';document.body.appendChild(t)}t.textContent=msg;t.style.display='block';clearTimeout(t.__x);t.__x=setTimeout(function(){t.style.display='none'},2200)}
  async function auth(){if(!window.troothSupabase)return null;var r=await window.troothSupabase.auth.getUser();return r.data&&r.data.user?r.data.user:null}
  async function request(target){var u=await auth();if(!u||!target||target===u.id)return;
    var sb=window.troothSupabase;
    var existing=await sb.from('friend_requests').select('id,status').eq('sender_id',u.id).eq('receiver_id',target).maybeSingle();
    if(existing.data){toast(existing.data.status==='accepted'?'✓ پہلے ہی دوست ہیں':'⏳ Request پہلے ہی موجود ہے');return existing.data;}
    var reverse=await sb.from('friend_requests').select('id,status').eq('sender_id',target).eq('receiver_id',u.id).maybeSingle();
    if(reverse.data&&reverse.data.status==='pending'){var up=await sb.from('friend_requests').update({status:'accepted',updated_at:new Date().toISOString()}).eq('id',reverse.data.id).select().maybeSingle();toast(up.error?'⚠️ Request update نہیں ہوئی':'🤝 Friendship accepted');window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));return up.data;}
    var ins=await sb.from('friend_requests').insert({sender_id:u.id,receiver_id:target,status:'pending'}).select().maybeSingle();
    if(ins.error){toast('⚠️ Friend request save نہیں ہوئی');console.warn(ins.error);return null}
    try{await sb.from('notifications').insert({user_id:target,actor_id:u.id,kind:'friend_request',body:'You received a new friend request.',is_read:false})}catch(e){}
    toast('🤝 Friend request محفوظ ہوگئی');window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));window.dispatchEvent(new CustomEvent('trooth-network-activity',{detail:{kind:'friend_request',targetId:target}}));return ins.data;
  }
  async function follow(target){var u=await auth();if(!u||!target||target===u.id)return;
    var sb=window.troothSupabase;
    var row=await sb.from('connections').select('follower_id,following_id').eq('follower_id',u.id).eq('following_id',target).maybeSingle();
    if(row.data){var del=await sb.from('connections').delete().eq('follower_id',u.id).eq('following_id',target);toast(del.error?'⚠️ Follow update نہیں ہوئی':'✓ Following ختم');window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));return !del.error}
    var ins=await sb.from('connections').insert({follower_id:u.id,following_id:target}).select().maybeSingle();
    if(ins.error){toast('⚠️ Follow save نہیں ہوا');console.warn(ins.error);return false}
    try{await sb.from('notifications').insert({user_id:target,actor_id:u.id,kind:'follow',body:'You have a new follower.',is_read:false})}catch(e){}
    toast('✅ Follow محفوظ ہوگیا');window.dispatchEvent(new CustomEvent('trooth-friends-refresh'));return true;
  }
  function boot(){
    document.addEventListener('click',function(e){
      var b=e.target.closest('[data-action="add-friend"],[data-action="follow"],[data-trooth-action="add-friend"],[data-trooth-action="follow"]');if(!b)return;
      var target=b.dataset.userId||b.dataset.profileId||b.dataset.targetId;if(!target)return;
      var action=b.getAttribute('data-action')||b.getAttribute('data-trooth-action');
      if(action==='add-friend'){e.preventDefault();e.stopImmediatePropagation();b.disabled=true;request(target).then(function(){b.textContent='Request Sent'});}
      if(action==='follow'){e.preventDefault();e.stopImmediatePropagation();follow(target).then(function(ok){if(ok){b.classList.toggle('is-following');b.textContent=b.classList.contains('is-following')?'Following':'Follow'}});}
    },true);
    window.troothSendFriendRequest=request;window.troothToggleFollow=follow;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
