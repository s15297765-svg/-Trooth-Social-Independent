// Trooth Social Independent — end-to-end flow guard v2
(function(){
  if(window.__troothE2EFlowGuardV2)return;
  window.__troothE2EFlowGuardV2=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    var qs=new URLSearchParams(location.search);
    var routes={
      signup:'auth.html',profile:'profile.html',friends:'friends.html',chat:'chat.html',
      notifications:'notifications-messages.html',news:'news.html',sports:'sports.html',
      business:'business.html',stores:'stores.html',property:'property.html',
      filmFashion:'film-fashion.html',groups:'groups.html',feed:'index.html'
    };
    function cleanId(id){return id==null?'':String(id).trim()}
    function go(key,id,param){
      var target=routes[key],value=cleanId(id);
      if(!target)return false;
      if(value){
        var p=param||'id';
        location.href=target+'?'+encodeURIComponent(p)+'='+encodeURIComponent(value);
      }else{
        location.href=target;
      }
      return true;
    }
    function current(key){return routes[key]===path}
    function safeOpen(key,id,param){
      if(current(key)&&!id)return false;
      return go(key,id,param)
    }
    window.TroothE2EFlow={
      routes:routes,page:path,query:qs,go:go,safeOpen:safeOpen,
      openProfile:function(id){return go('profile',id,'user')},
      openChat:function(id){return go('chat',id,'user')},
      openFriendChat:function(id){return go('friends',id,'chat')},
      openPost:function(id){return go('feed',id,'post')},
      openGroup:function(id){return go('groups',id,'id')},
      openBusiness:function(id){return go('business',id,'id')}
    };
    document.documentElement.setAttribute('data-trooth-e2e-ready','true');
    window.dispatchEvent(new CustomEvent('trooth-e2e-flow-ready',{detail:{page:path,routes:routes,version:2}}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
