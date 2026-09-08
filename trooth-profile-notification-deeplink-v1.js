// Trooth Social Independent — notification actor/profile deep-link v1
(function(){
  if(window.__troothProfileNotificationDeepLinkV1)return;
  window.__troothProfileNotificationDeepLinkV1=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    if(path!=='notifications.html')return;
    function profileUrl(id){return id?'profile.html?user='+encodeURIComponent(id):null}
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest&&e.target.closest('[data-trooth-actor-id],[data-actor-id]');
      if(!el)return;
      var id=el.getAttribute('data-trooth-actor-id')||el.getAttribute('data-actor-id');
      var url=profileUrl(id);
      if(!url)return;
      e.preventDefault();e.stopPropagation();location.href=url;
    },true);
    window.TroothNotificationProfile={open: function(id){var u=profileUrl(id);if(u)location.href=u}};
    function decorate(){
      var cards=document.querySelectorAll('[data-notification-id],.notice,.notification-item,.notification');
      Array.prototype.forEach.call(cards,function(card){
        var id=card.getAttribute('data-actor-id')||card.getAttribute('data-trooth-actor-id');
        if(!id||card.querySelector('[data-trooth-actor-link]'))return;
        var target=card.querySelector('.actor,.notification-actor,.notice-actor');
        if(target){target.setAttribute('data-trooth-actor-id',id);target.setAttribute('data-trooth-actor-link','1');target.style.cursor='pointer';}
      });
    }
    decorate();
    new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
