// Trooth Social Independent — notification action routing v1
(function(){
  if(window.__troothNotificationActionFlowV1)return;
  window.__troothNotificationActionFlowV1=true;
  function boot(){
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-notification-action],[data-trooth-notification-action]');
      if(!el)return;
      var action=el.getAttribute('data-notification-action')||el.getAttribute('data-trooth-notification-action');
      var id=el.getAttribute('data-user-id')||el.getAttribute('data-actor-id')||el.getAttribute('data-post-id');
      if(!action)return;
      if(action==='chat'&&id){e.preventDefault();location.href='chat.html?user='+encodeURIComponent(id);return}
      if((action==='friend'||action==='profile')&&id){e.preventDefault();location.href='friends.html?user='+encodeURIComponent(id);return}
      if(action==='post'&&id){e.preventDefault();location.href='index.html?post='+encodeURIComponent(id);return}
      if(action==='group'&&id){e.preventDefault();location.href='group.html?id='+encodeURIComponent(id)}
    },true);
    window.TroothNotificationFlow={
      openChat:function(id){if(id)location.href='chat.html?user='+encodeURIComponent(id)},
      openFriend:function(id){if(id)location.href='friends.html?user='+encodeURIComponent(id)},
      openPost:function(id){if(id)location.href='index.html?post='+encodeURIComponent(id)},
      openGroup:function(id){if(id)location.href='group.html?id='+encodeURIComponent(id)}
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
