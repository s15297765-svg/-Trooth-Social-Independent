// Trooth Social Independent — Friend request Accept / Reject / Unfriend sync v1
(function(){
  if(window.__troothFriendActionsSyncV1)return;window.__troothFriendActionsSyncV1=true;
  function toast(msg){var t=document.getElementById('trooth-action-toast');if(!t){t=document.createElement('div');t.id='trooth-action-toast';t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#1f7a4d;color:#fff;padding:10px 16px;border-radius:999px;font:600 14px system-ui;box-shadow:0 8px 24px rgba(0,0,0,.18)';document.body.appendChild(t)}t.textContent=msg;t.style.display='block';clearTimeout(t.__x);t.__x=setTimeout(function(){t.style.display='none'},2200)}
  function id(b){return b.dataset.userId||b.dataset.profileId||b.dataset.targetId||b.getAttribute('data-user')||b.getAttribute('data-id')||b.dataset.requestId||null}
  async function me(){try{var r=await window.troothSupabase.auth.getUser();return r.data&&r.data.user||null}catch(e){return null}}
  async function act(action,b){var sb=window.troothSupabase,u=await me();if(!u){toast('🔐 پہلے Login کریں');return}var target=id(b);if(!target){toast('⚠️ User/Request ID نہیں ملا');return}b.disabled=true;try{
    if(action==='accept'||action==='reject'){
      var q=await sb.from('friend_requests').select('id,sender_id,receiver_id,status').eq('id',target).limit(1);if(q.error)throw q.error;var r=q.data&&q.data[0];
      if(!r){toast('⚠️ Friend request نہیں ملی');return}if(r.receiver_id!==u.id){toast('⚠️ یہ request آپ کی نہیں');return}
      if(action==='accept'){var up=await sb.from('friend_requests').update({status:'accepted'}).eq('id',r.id);if(up.error)throw up.error;toast('✅ Friend request قبول کر لی گئی')}
      else{var de=await sb.from('friend_requests').delete().eq('id',r.id);if(de.error)throw de.error;toast('❌ Friend request رد کر دی گئی')}
    }else if(action==='unfriend'){
      var tid=target;if(tid===u.id){toast('⚠️ خود کو Unfriend نہیں کر سکتے');return}
      var q1=await sb.from('friend_requests').select('id,sender_id,receiver_id,status').eq('status','accepted').or('and(sender_id.eq.'+u.id+',receiver_id.eq.'+tid+'),and(sender_id.eq.'+tid+',receiver_id.eq.'+u.id+')');
      if(q1.error)throw q1.error;var rows=q1.data||[];
      if(rows.length){var ids=rows.map(function(x){return x.id});var de=await sb.from('friend_requests').delete().in('id',ids);if(de.error)throw de.error}
      var c=await sb.from('connections').delete().or('and(follower_id.eq.'+u.id+',following_id.eq.'+tid+'),and(follower_id.eq.'+tid+',following_id.eq.'+u.id+')');if(c.error)throw c.error;
      toast('👋 Friend relationship ختم کر دیا گیا')
    }
    window.dispatchEvent(new CustomEvent('trooth-social-graph-refresh',{detail:{source:'friend-actions-sync',action:action,targetId:target}}));
    window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'friend-actions-sync',action:action,targetId:target}}));
    window.dispatchEvent(new CustomEvent('trooth-friends-social-update',{detail:{source:'friend-actions-sync',action:action,targetId:target}}));
    setTimeout(function(){window.dispatchEvent(new CustomEvent('trooth-friends-social-update'))},120);
  }catch(e){console.warn('Trooth friend action:',e);toast('⚠️ کارروائی محفوظ نہیں ہو سکی')}finally{b.disabled=false}}
  function boot(){document.addEventListener('click',function(e){var b=e.target.closest('[data-action="accept-friend"],[data-action="reject-friend"],[data-action="unfriend"],[data-trooth-action="accept-friend"],[data-trooth-action="reject-friend"],[data-trooth-action="unfriend"]');if(!b)return;e.preventDefault();var a=b.getAttribute('data-action')||b.getAttribute('data-trooth-action');act(a==='accept-friend'?'accept':a==='reject-friend'?'reject':'unfriend',b)})}
  function start(){if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
