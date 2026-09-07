// Trooth Social Independent — Profile/Friends/Chat connected flow v1
(function(){
  if(window.__troothProfileFriendsChatFlowV1)return;window.__troothProfileFriendsChatFlowV1=true;
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
  function go(url,id){if(id)try{sessionStorage.setItem('trooth-open-user',id)}catch(e){};window.location.href=url}
  function wire(){
    document.addEventListener('click',function(e){
      var el=e.target.closest&&e.target.closest('[data-trooth-profile],[data-trooth-message],[data-trooth-friends]');if(!el)return;
      var id=el.dataset.troothProfile||el.dataset.troothMessage||'';
      if(el.dataset.troothProfile){e.preventDefault();go('auth.html?user='+encodeURIComponent(id),id);emit('trooth-profile-open',{userId:id})}
      else if(el.dataset.troothMessage){e.preventDefault();go('friends.html?chat='+encodeURIComponent(id),id);emit('trooth-chat-open',{userId:id})}
      else if(el.dataset.troothFriends){e.preventDefault();go('friends.html');emit('trooth-friends-open',{})}
    },true);
    window.addEventListener('trooth-network-ui-synced',function(){emit('trooth-profile-friends-chat-ready')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
})();
