// Trooth Social Independent — notification action routing v3
(function(){
  if(window.__troothNotificationActionFlowV3)return;
  window.__troothNotificationActionFlowV3=true;
  function boot(){
    function route(action,id){
      if(!action||!id)return false;
      var map={chat:'chat.html?user=',friend:'friends.html?chat=',profile:'profile.html?user=',post:'index.html?post=',group:'group.html?id='};
      if(!map[action])return false;
      location.href=map[action]+encodeURIComponent(id);return true;
    }
    function getId(el,action){
      if(action==='post')return el.getAttribute('data-post-id')||el.getAttribute('data-content-id')||'';
      if(action==='group')return el.getAttribute('data-group-id')||'';
      if(action==='chat'||action==='friend'||action==='profile')return el.getAttribute('data-user-id')||el.getAttribute('data-actor-id')||'';
      return el.getAttribute('data-user-id')||el.getAttribute('data-actor-id')||el.getAttribute('data-post-id')||el.getAttribute('data-group-id')||'';
    }
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-notification-action],[data-trooth-notification-action],[data-trooth-action]');
      if(!el)return;
      var action=el.getAttribute('data-notification-action')||el.getAttribute('data-trooth-notification-action')||el.getAttribute('data-trooth-action');
      var id=getId(el,action);
      if(route(action,id))e.preventDefault();
    },true);
    window.TroothNotificationFlow={
      route:route,
      openChat:function(id){return route('chat',id)},
      openFriend:function(id){return route('friend',id)},
      openProfile:function(id){return route('profile',id)},
      openPost:function(id){return route('post',id)},
      openGroup:function(id){return route('group',id)}
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
