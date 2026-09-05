// Trooth Social Independent — Friends & Following live presence enhancer
(function(){
  function boot(){
    if(window.__troothFriendsPresenceLive)return;window.__troothFriendsPresenceLive=true;
    if(location.pathname.toLowerCase().indexOf('friends.html')===-1)return;
    var online={};
    function flatten(state){var out={};Object.keys(state||{}).forEach(function(k){(state[k]||[]).forEach(function(x){if(x&&x.user_id)out[x.user_id]=x})});return out}
    function paint(){document.querySelectorAll('[data-user-id]').forEach(function(el){var id=el.getAttribute('data-user-id');if(!id)return;var dot=el.querySelector('.trooth-friend-live-dot');if(!dot){dot=document.createElement('span');dot.className='trooth-friend-live-dot';dot.style='display:inline-block;width:9px;height:9px;border-radius:50%;margin-left:6px;vertical-align:middle;background:#b7c1ba;box-shadow:0 0 0 2px #fff;transition:.2s';el.appendChild(dot)}var on=!!online[id];dot.style.background=on?'#2ecc71':'#b7c1ba';dot.title=on?'Online now':'Offline'})}
    window.addEventListener('trooth-presence-sync',function(e){online=flatten(e.detail&&e.detail.state);paint()});
    window.addEventListener('trooth-presence-join',function(e){(e.detail&&e.detail.newPresences||[]).forEach(function(x){if(x.user_id)online[x.user_id]=x});paint()});
    window.addEventListener('trooth-presence-leave',function(e){(e.detail&&e.detail.leftPresences||[]).forEach(function(x){if(x.user_id)delete online[x.user_id]});paint()});
    window.addEventListener('trooth-friends-refresh',paint);
    new MutationObserver(paint).observe(document.body,{childList:true,subtree:true});
    setInterval(paint,5000);paint();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2400)},{once:true});else setTimeout(boot,2400);
})();
