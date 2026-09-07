// Trooth Social Independent — Friends + Profile + Chat connected flow v1
(function(){
  if(window.__troothSocialConnectionFlowV1)return;
  window.__troothSocialConnectionFlowV1=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    var qs=new URLSearchParams(location.search);
    function goChat(id){if(!id)return;location.href='chat.html?user='+encodeURIComponent(id)}
    function goFriends(id){location.href=id?'friends.html?chat='+encodeURIComponent(id):'friends.html'}
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-trooth-chat-user],[data-trooth-friend-user]');
      if(!el)return;
      var id=el.getAttribute('data-trooth-chat-user')||el.getAttribute('data-trooth-friend-user');
      if(!id)return;
      e.preventDefault();
      if(path==='chat.html')return;
      if(path==='friends.html')goFriends(id);else goChat(id);
    },true);
    if(path==='friends.html'&&qs.get('chat')&&typeof window.selectFriend==='function'){
      var id=qs.get('chat');setTimeout(function(){try{window.selectFriend(id);var tabs=document.querySelectorAll('.tab');if(tabs[4]&&typeof window.showTab==='function')window.showTab('chat',tabs[4])}catch(e){}},350);
    }
    window.TroothSocialFlow={openChat:goChat,openFriendsChat:goFriends};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
