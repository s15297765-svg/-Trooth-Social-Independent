// Trooth Social Independent — Friends + Profile + Chat connected flow v3
(function(){
  if(window.__troothSocialConnectionFlowV3)return;
  window.__troothSocialConnectionFlowV3=true;
  function boot(){
    function profile(id){if(id)location.href='auth.html?profile='+encodeURIComponent(id)}
    function chat(id){if(id)location.href='chat.html?user='+encodeURIComponent(id)}
    function friends(id){location.href=id?'friends.html?chat='+encodeURIComponent(id):'friends.html'}
    function route(el){
      var id=el.getAttribute('data-trooth-chat-user')||el.getAttribute('data-trooth-friend-user')||el.getAttribute('data-user-id')||el.getAttribute('data-actor-id');
      if(!id)return false;
      var action=el.getAttribute('data-trooth-action')||el.getAttribute('data-action')||'';
      if(action==='profile')profile(id);
      else if(action==='friend'||el.hasAttribute('data-trooth-friend-user'))friends(id);
      else chat(id);
      return true;
    }
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-trooth-chat-user],[data-trooth-friend-user],[data-trooth-action="profile"]');
      if(!el||!route(el))return;
      e.preventDefault();
    },true);
    window.TroothSocialFlow={openChat:chat,openFriendsChat:friends,openProfile:profile};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
