// Trooth Social Independent — live activity feed bridge
(function(){
  function boot(){
    if(window.__troothActivityFeedLive)return;window.__troothActivityFeedLive=true;
    var timer=null;
    function refresh(){
      clearTimeout(timer);timer=setTimeout(function(){
        window.dispatchEvent(new CustomEvent('trooth-activity-feed-refresh'));
        window.dispatchEvent(new CustomEvent('trooth-feed-smart-refresh'));
      },180);
    }
    ['trooth-activity-live','trooth-notification-live','trooth-message-live','trooth-friend-live',
     'trooth-notifications-refresh','trooth-friends-refresh','trooth-messages-refresh','trooth-unread-refresh',
     'trooth-post-liked','trooth-comment-added','trooth-post-shared'].forEach(function(name){window.addEventListener(name,refresh)});
    window.addEventListener('pageshow',refresh);
    window.addEventListener('focus',refresh);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
