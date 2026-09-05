// Trooth Social Independent — Friends live presence bridge
(function(){
  function boot(){
    if(window.__troothFriendsPresenceBridge)return;window.__troothFriendsPresenceBridge=true;
    var online=new Set();
    function emit(){try{window.dispatchEvent(new CustomEvent('trooth-friends-presence-sync',{detail:{onlineIds:Array.from(online)}}))}catch(e){}}
    function add(id){if(!id)return;online.add(String(id));emit()}
    function remove(id){if(!id)return;online.delete(String(id));emit()}
    function sync(ids){online=new Set((ids||[]).map(String));emit()}
    window.addEventListener('trooth-presence-sync',function(e){sync((e.detail&&e.detail.onlineIds)||[]) });
    window.addEventListener('trooth-presence-online',function(e){add(e.detail&&e.detail.userId)});
    window.addEventListener('trooth-presence-join',function(e){add(e.detail&&e.detail.userId)});
    window.addEventListener('trooth-presence-leave',function(e){remove(e.detail&&e.detail.userId)});
    window.addEventListener('trooth-auth-changed',function(){online.clear();emit()});
    window.addEventListener('pageshow',emit);
    emit();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
