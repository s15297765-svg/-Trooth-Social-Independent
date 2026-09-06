// Trooth Social Independent — Profile/Friends action bridge v3
(function(){
  if(window.__troothProfileFriendsActionsV3)return;window.__troothProfileFriendsActionsV3=true;
  function toast(msg){var t=document.getElementById('trooth-action-toast');if(!t){t=document.createElement('div');t.id='trooth-action-toast';t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#1f7a4d;color:#fff;padding:10px 16px;border-radius:999px;font:600 14px system-ui;box-shadow:0 8px 24px rgba(0,0,0,.18)';document.body.appendChild(t)}t.textContent=msg;t.style.display='block';clearTimeout(t.__x);t.__x=setTimeout(function(){t.style.display='none'},2200)}
  function targetId(b){return b.dataset.userId||b.dataset.profileId||b.dataset.targetId||b.getAttribute('data-user')||b.getAttribute('data-id')||null}
  async function me(){try{var r=await window.troothSupabase.auth.getUser();return r.data&&r.data.user||null}catch(e){return null}}
  async function follow(id,b){
    var sb=window.troothSupabase,u=await me();
    if(!u){toast('🔐 پہلے Login کریں');return}
    if(u.id===id){toast('⚠️ اپنے آپ کو Follow نہیں کر سکتے');return}
    b.disabled=true;
    try{
      var q=await sb.from('connections').select('follower_id').eq('follower_id',u.id).eq('following_id',id).limit(1);
      if(q.error)throw q.error;
      if(q.data&&q.data.length){var d=await sb.from('connections').delete().eq('follower_id',u.id).eq('following_id',id);if(d.error)throw d.error;b.classList.remove('is-following');b.textContent='Follow';toast('Follow ختم کر دیا گیا')}
      else{var i=await sb.from('connections').insert({follower_id:u.id,following_id:id});if(i.error)throw i.error;b.classList.add('is-following');b.textContent='Following';toast('✅ Follow کر دیا گیا')}
      window.dispatchEvent(new CustomEvent('trooth-social-graph-refresh',{detail:{source:'profile-follow',targetId:id}}));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'profile-follow',targetId:id}}));
    }catch(err){console.warn('Trooth follow:',err);toast('⚠️ Follow محفوظ نہیں ہو سکا')}
    finally{b.disabled=false}
  }
  async function friend(id,b){
    var sb=window.troothSupabase,u=await me();
    if(!u){toast('🔐 پہلے Login کریں');return}
    if(u.id===id){toast('⚠️ اپنے آپ کو Friend نہیں بنا سکتے');return}
    b.disabled=true;
    try{
      var q=await sb.from('friend_requests').select('id,status').eq('sender_id',u.id).eq('receiver_id',id).limit(1);
      if(q.error)throw q.error;
      var row=q.data&&q.data[0];
      if(row&&row.status==='accepted'){b.classList.add('is-friend');b.textContent='Friends';toast('🤝 آپ پہلے ہی Friends ہیں')}
      else if(row&&row.status==='pending'){b.classList.add('is-requested');b.textContent='Request Sent';toast('⏳ Friend request پہلے ہی بھیجی جا چکی ہے')}
      else{
        var i=await sb.from('friend_requests').insert({sender_id:u.id,receiver_id:id,status:'pending'});if(i.error)throw i.error;
        b.classList.add('is-requested');b.textContent='Request Sent';toast('🤝 Friend request بھیج دی گئی');
        window.dispatchEvent(new CustomEvent('trooth-friend-request-sent',{detail:{targetId:id}}));
        window.dispatchEvent(new CustomEvent('trooth-friend-request',{detail:{targetId:id}}));
      }
      window.dispatchEvent(new CustomEvent('trooth-social-graph-refresh',{detail:{source:'profile-friend',targetId:id}}));
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'profile-friend',targetId:id}}));
    }catch(err){console.warn('Trooth friend request:',err);toast('⚠️ Friend request محفوظ نہیں ہو سکی')}
    finally{b.disabled=false}
  }
  function boot(){
    document.addEventListener('click',async function(e){
      var b=e.target.closest('[data-action="add-friend"],[data-action="follow"],[data-action="message"],[data-trooth-action="add-friend"],[data-trooth-action="follow"],[data-trooth-action="message"]');
      if(!b)return;
      var action=b.getAttribute('data-action')||b.getAttribute('data-trooth-action'),id=targetId(b);
      if(!id){toast('⚠️ User ID نہیں ملا');return}
      if(action==='message'){e.preventDefault();toast('💬 Messenger کھولا جا رہا ہے');if(typeof window.troothOpenChat==='function')window.troothOpenChat(id);else location.href='chat.html?user='+encodeURIComponent(id);return}
      e.preventDefault();
      if(action==='follow'){await follow(id,b);return}
      if(action==='add-friend'){await friend(id,b);return}
    });
  }
  function start(){if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
