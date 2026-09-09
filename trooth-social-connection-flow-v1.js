// Trooth Social Independent — Friends + Profile + Chat connected flow v5
(function(){
  if(window.__troothSocialConnectionFlowV5)return;
  window.__troothSocialConnectionFlowV5=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase(),qs=new URLSearchParams(location.search);
    function profile(id){if(id)location.href='auth.html?profile='+encodeURIComponent(id)}
    function chat(id){if(id)location.href='chat.html?user='+encodeURIComponent(id)}
    function friends(id){location.href=id?'friends.html?chat='+encodeURIComponent(id):'friends.html'}
    function route(el){
      var id=el.getAttribute('data-trooth-chat-user')||el.getAttribute('data-trooth-friend-user')||el.getAttribute('data-user-id')||el.getAttribute('data-actor-id');
      if(!id)return false;
      var action=el.getAttribute('data-trooth-action')||el.getAttribute('data-action')||'';
      if(action==='profile')profile(id);else if(action==='friend'||el.hasAttribute('data-trooth-friend-user'))friends(id);else chat(id);
      return true;
    }
    document.addEventListener('click',function(e){var el=e.target&&e.target.closest&&e.target.closest('[data-trooth-chat-user],[data-trooth-friend-user],[data-trooth-action="profile"]');if(!el||!route(el))return;e.preventDefault()},true);
    if(path==='friends.html'&&qs.get('chat')){
      var id=qs.get('chat');
      function open(){
        try{
          if(typeof window.selectFriend==='function')window.selectFriend(id);
          var tab=document.querySelector('.tab[onclick*="showTab(\'chat\'"]')||Array.from(document.querySelectorAll('.tab')).find(function(x){return /chat/i.test(x.textContent||'')});
          if(tab&&typeof window.showTab==='function')window.showTab('chat',tab);
        }catch(e){}
      }
      setTimeout(open,350);setTimeout(open,1000);
    }
    window.TroothSocialFlow={openChat:chat,openFriendsChat:friends,openProfile:profile};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
