// Trooth Social Independent — end-to-end flow guard v1
(function(){
  if(window.__troothE2EFlowGuardV1)return;
  window.__troothE2EFlowGuardV1=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    var qs=new URLSearchParams(location.search);
    var routes={
      signup:'auth.html',profile:'profile.html',friends:'friends.html',chat:'chat.html',
      notifications:'notifications-messages.html',news:'news.html',sports:'sports.html',
      business:'business.html',stores:'stores.html',property:'property.html',
      filmFashion:'film-fashion.html',groups:'groups.html'
    };
    function go(key,id,param){
      var target=routes[key];
      if(!target)return false;
      location.href=target+(id?'?'+(param||'id')+'='+encodeURIComponent(id):'');
      return true;
    }
    window.TroothE2EFlow={routes:routes,go:go,page:path,query:qs};
    document.documentElement.setAttribute('data-trooth-e2e-ready','true');
    window.dispatchEvent(new CustomEvent('trooth-e2e-flow-ready',{detail:{page:path,routes:routes}}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
