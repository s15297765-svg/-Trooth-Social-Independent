// Trooth Social Independent — live activity feed bridge v3
(function(){
  function boot(){
    if(window.__troothActivityFeedLiveV3)return;window.__troothActivityFeedLiveV3=true;
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
    // Social interactions update Activity, but should not announce "new posts".
    ['trooth-activity-live','trooth-notification-live','trooth-post-liked','trooth-comment-added','trooth-post-shared']
      .forEach(function(name){window.addEventListener(name,activityRefresh)});
    // Only a genuine activity/live feed event may trigger the smart new-post refresh bridge.
    window.addEventListener('trooth-activity-live',feedRefresh);
    window.addEventListener('pageshow',function(){activityRefresh()});
    window.addEventListener('focus',activityRefresh);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
