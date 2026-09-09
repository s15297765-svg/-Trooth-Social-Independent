// Trooth Social Independent — notification action routing v6
(function(){
  if(window.__troothNotificationActionFlowV6)return;
  window.__troothNotificationActionFlowV6=true;
  function boot(){
    function route(action,id){
      if(!action||!id)return false;
      var map={chat:'chat.html?user=',friend:'friends.html?chat=',profile:'auth.html?profile=',post:'index.html?post=',group:'group.html?id=',business:'business.html?id='};
      if(!map[action])return false;
      location.href=map[action]+encodeURIComponent(id);return true;
    }
    function getId(el,action){
      if(action==='post')return el.getAttribute('data-post-id')||el.getAttribute('data-content-id')||'';
      if(action==='group')return el.getAttribute('data-group-id')||'';
      if(action==='business')return el.getAttribute('data-business-id')||'';
      if(action==='chat'||action==='friend'||action==='profile')return el.getAttribute('data-user-id')||el.getAttribute('data-actor-id')||'';
      return el.getAttribute('data-user-id')||el.getAttribute('data-actor-id')||el.getAttribute('data-post-id')||el.getAttribute('data-group-id')||el.getAttribute('data-business-id')||'';
    }
    async function markNotificationRead(el){
      var nid=el.getAttribute('data-notification-id');
      if(!nid||!window.troothSupabase)return;
      try{
        var user=(await window.troothSupabase.auth.getUser()).data.user;
        if(user)await window.troothSupabase.from('notifications').update({is_read:true}).eq('id',nid).eq('user_id',user.id);
      }catch(e){}
    }
    document.addEventListener('click',async function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-notification-action],[data-trooth-notification-action],[data-trooth-action]');
      if(!el)return;
      var action=el.getAttribute('data-notification-action')||el.getAttribute('data-trooth-notification-action')||el.getAttribute('data-trooth-action');
      var id=getId(el,action);
      if(!id)return;
      e.preventDefault();
      await markNotificationRead(el);
      route(action,id);
    },true);
    window.TroothNotificationFlow={route:route,openChat:function(id){return route('chat',id)},openFriend:function(id){return route('friend',id)},openProfile:function(id){return route('profile',id)},openPost:function(id){return route('post',id)},openGroup:function(id){return route('group',id)},openBusiness:function(id){return route('business',id)}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
