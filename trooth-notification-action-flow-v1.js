// Trooth Social Independent — notification action routing v2
(function(){
  if(window.__troothNotificationActionFlowV2)return;
  window.__troothNotificationActionFlowV2=true;
  function boot(){
    function route(action,id){
      if(!action||!id)return false;
      var map={chat:'chat.html?user=',friend:'friends.html?chat=',profile:'profile.html?user=',post:'index.html?post=',group:'group.html?id='};
      if(!map[action])return false;
      location.href=map[action]+encodeURIComponent(id);return true;
    }
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-notification-action],[data-trooth-notification-action],[data-trooth-action]');
      if(!el)return;
      var action=el.getAttribute('data-notification-action')||el.getAttribute('data-trooth-notification-action')||el.getAttribute('data-trooth-action');
      var id=el.getAttribute('data-user-id')||el.getAttribute('data-actor-id')||el.getAttribute('data-post-id')||el.getAttribute('data-group-id');
      if(route(action,id))e.preventDefault();
    },true);
    window.TroothNotificationFlow={
      route:route,
      openChat:function(id){route('chat',id)},
      openFriend:function(id){route('friend',id)},
      openProfile:function(id){route('profile',id)},
      openPost:function(id){route('post',id)},
      openGroup:function(id){route('group',id)}
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
