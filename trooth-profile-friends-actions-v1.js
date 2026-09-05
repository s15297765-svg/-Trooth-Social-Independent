// Trooth Social Independent — Profile/Friends action bridge v2
(function(){
  if(window.__troothProfileFriendsActionsV2)return;window.__troothProfileFriendsActionsV2=true;
  function toast(msg){var t=document.getElementById('trooth-action-toast');if(!t){t=document.createElement('div');t.id='trooth-action-toast';t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#1f7a4d;color:#fff;padding:10px 16px;border-radius:999px;font:600 14px system-ui;box-shadow:0 8px 24px rgba(0,0,0,.18)';document.body.appendChild(t)}t.textContent=msg;t.style.display='block';clearTimeout(t.__x);t.__x=setTimeout(function(){t.style.display='none'},1800)}
  function targetId(b){return b.dataset.userId||b.dataset.profileId||b.dataset.targetId||b.getAttribute('data-user')||b.getAttribute('data-id')||null}
  function boot(){
    document.addEventListener('click',function(e){
      var b=e.target.closest('[data-action="add-friend"],[data-action="follow"],[data-action="message"],[data-trooth-action="add-friend"],[data-trooth-action="follow"],[data-trooth-action="message"]');
      if(!b)return;
      var action=b.getAttribute('data-action')||b.getAttribute('data-trooth-action'),id=targetId(b);
      if(action==='message'){
        if(id){e.preventDefault();toast('💬 Messenger کھولا جا رہا ہے');if(typeof window.troothOpenChat==='function')window.troothOpenChat(id);else location.href='chat.html?user='+encodeURIComponent(id)}
        return;
      }
      if(action==='follow'){b.classList.toggle('is-following');b.textContent=b.classList.contains('is-following')?'Following':'Follow';toast(b.classList.contains('is-following')?'✅ Follow کر دیا گیا':'Follow ختم کر دیا گیا');return}
      if(action==='add-friend'){b.disabled=true;b.classList.add('is-requested');b.textContent='Request Sent';toast('🤝 Friend request بھیج دی گئی');window.dispatchEvent(new CustomEvent('trooth-friend-request-sent',{detail:{targetId:id}}));window.dispatchEvent(new CustomEvent('trooth-friend-request',{detail:{targetId:id}}));}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
