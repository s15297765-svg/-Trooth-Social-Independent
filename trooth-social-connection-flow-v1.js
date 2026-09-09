// Trooth Social Independent — Friends + Profile + Chat connected flow v8
(function(){
  if(window.__troothSocialConnectionFlowV8)return;
  window.__troothSocialConnectionFlowV8=true;
  function boot(){
    if(window.__troothSocialConnectionBootedV8)return;
    window.__troothSocialConnectionBootedV8=true;
    var path=(location.pathname||'').split('/').pop().toLowerCase(),qs=new URLSearchParams(location.search);
    function profile(id){if(id)location.href='auth.html?profile='+encodeURIComponent(id)}
    function chat(id){if(id)location.href='chat.html?user='+encodeURIComponent(id)}
    function friends(id){location.href=id?'friends.html?chat='+encodeURIComponent(id):'friends.html'}
    function route(el){var id=el.getAttribute('data-trooth-chat-user')||el.getAttribute('data-trooth-friend-user')||el.getAttribute('data-user-id')||el.getAttribute('data-actor-id');if(!id)return false;var action=el.getAttribute('data-trooth-action')||el.getAttribute('data-action')||'';if(action==='profile')profile(id);else if(action==='friend'||el.hasAttribute('data-trooth-friend-user'))friends(id);else chat(id);return true}
    document.addEventListener('click',function(e){var el=e.target&&e.target.closest&&e.target.closest('[data-trooth-chat-user],[data-trooth-friend-user],[data-trooth-action="profile"]');if(!el||!route(el))return;e.preventDefault()},true);
    function openFriendChat(id){
      if(!id)return;
      try{
        if(typeof window.selectFriend==='function')window.selectFriend(id);
        var tabs=Array.from(document.querySelectorAll('.tab'));
        var tab=tabs.find(function(x){return /chat/i.test((x.textContent||'').trim())});
        if(tab&&typeof window.showTab==='function')window.showTab('chat',tab);
      }catch(e){console.warn('Trooth friend chat route',e)}
    }
    if(path==='friends.html'&&qs.get('chat')){var id=qs.get('chat');setTimeout(function(){openFriendChat(id)},350);setTimeout(function(){openFriendChat(id)},1000)}
    if(path==='chat.html'&&qs.get('user')){var chatId=qs.get('user');function openDirect(){try{if(typeof window.openChatWithUser==='function')window.openChatWithUser(chatId);else if(typeof window.selectUser==='function')window.selectUser(chatId)}catch(e){console.warn('Trooth direct chat route',e)}}setTimeout(openDirect,350);setTimeout(openDirect,1000)}
    window.TroothSocialFlow={openChat:chat,openFriendsChat:friends,openProfile:profile};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('trooth-supabase-ready',function(){setTimeout(boot,80)},{once:true});
})();
