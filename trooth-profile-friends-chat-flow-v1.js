// Trooth Social Independent — Profile/Friends/Chat connected flow v2
(function(){
  if(window.__troothProfileFriendsChatFlowV2)return;window.__troothProfileFriendsChatFlowV2=true;
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
  function remember(id){if(id)try{sessionStorage.setItem('trooth-open-user',id)}catch(e){}}
  function go(url,id){remember(id);window.location.href=url}
  function wire(){
    document.addEventListener('click',function(e){
      var el=e.target.closest&&e.target.closest('[data-trooth-profile],[data-trooth-message],[data-trooth-friends]');if(!el)return;
      var profile=el.dataset.troothProfile,message=el.dataset.troothMessage;
      if(profile){e.preventDefault();go('auth.html?user='+encodeURIComponent(profile),profile);emit('trooth-profile-open',{userId:profile});return}
      if(message){e.preventDefault();go('friends.html?chat='+encodeURIComponent(message),message);emit('trooth-chat-open',{userId:message});return}
      if(el.dataset.troothFriends){e.preventDefault();go('friends.html');emit('trooth-friends-open',{})}
    },true);
    var qs=new URLSearchParams(location.search),user=qs.get('user'),chat=qs.get('chat');
    if(user)remember(user);if(chat)remember(chat);
    emit('trooth-profile-friends-chat-ready',{userId:user||chat||null,chat:!!chat});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
})();
