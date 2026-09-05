// Trooth Social Independent — live activity feed bridge v2
(function(){
  function boot(){
    if(window.__troothActivityFeedLiveV2)return;window.__troothActivityFeedLiveV2=true;
    var activityTimer=null,feedTimer=null;
    function activityRefresh(){
      clearTimeout(activityTimer);activityTimer=setTimeout(function(){
        window.dispatchEvent(new CustomEvent('trooth-activity-feed-refresh'));
      },180);
    }
    function feedRefresh(){
      clearTimeout(feedTimer);feedTimer=setTimeout(function(){
        window.dispatchEvent(new CustomEvent('trooth-feed-smart-refresh'));
      },260);
    }
    ['trooth-activity-live','trooth-notification-live','trooth-post-liked','trooth-comment-added','trooth-post-shared']
      .forEach(function(name){window.addEventListener(name,activityRefresh)});
    ['trooth-post-liked','trooth-comment-added','trooth-post-shared','trooth-activity-live']
      .forEach(function(name){window.addEventListener(name,feedRefresh)});
    window.addEventListener('pageshow',function(){activityRefresh();feedRefresh()});
    window.addEventListener('focus',activityRefresh);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
