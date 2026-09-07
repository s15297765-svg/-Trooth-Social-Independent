// Trooth Social Independent — Friends + Profile + Chat connected flow v2
(function(){
  if(window.__troothSocialConnectionFlowV2)return;
  window.__troothSocialConnectionFlowV2=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    var qs=new URLSearchParams(location.search);
    function goChat(id){if(id)location.href='chat.html?user='+encodeURIComponent(id)}
    function goFriends(id){location.href=id?'friends.html?chat='+encodeURIComponent(id):'friends.html'}
    function routeAction(el){
      var id=el.getAttribute('data-trooth-chat-user')||el.getAttribute('data-trooth-friend-user')||el.getAttribute('data-user-id');
      if(!id)return false;
      var action=el.getAttribute('data-trooth-action')||el.getAttribute('data-action')||'';
      if(action==='profile'){location.href='profile.html?user='+encodeURIComponent(id);return true}
      if(action==='friend'||el.hasAttribute('data-trooth-friend-user')){goFriends(id);return true}
      goChat(id);return true;
    }
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-trooth-chat-user],[data-trooth-friend-user],[data-trooth-action="profile"]');
      if(!el)return;
      if(!routeAction(el))return;
      e.preventDefault();
    },true);
    if(path==='friends.html'&&qs.get('chat')&&typeof window.selectFriend==='function'){
      var id=qs.get('chat');setTimeout(function(){try{window.selectFriend(id);var tabs=document.querySelectorAll('.tab');if(tabs[4]&&typeof window.showTab==='function')window.showTab('chat',tabs[4])}catch(e){}},350);
    }
    window.TroothSocialFlow={openChat:goChat,openFriendsChat:goFriends,openProfile:function(id){if(id)location.href='profile.html?user='+encodeURIComponent(id)}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
