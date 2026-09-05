// Trooth Social Independent — Smart Home Feed Refresh compatibility bridge v2
(function(){
  function boot(){
    if(window.troothFeedSmartRefreshReadyV2)return;
    window.troothFeedSmartRefreshReadyV2=true;
    var stopped=false;
    function stop(){stopped=true;}
    function resume(){stopped=false;}
    // Home Feed Realtime v3 owns the visible new-post banner and refresh action.
    // This bridge intentionally avoids creating a second banner.
    function onSmartRefresh(){
      if(stopped)return;
      window.dispatchEvent(new CustomEvent('trooth-feed-smart-refresh-available',{detail:{source:'smart-refresh-v2'}}));
    }
    window.addEventListener('trooth-home-feed-refresh',onSmartRefresh);
    window.addEventListener('trooth-feed-smart-refresh-stop',stop);
    window.addEventListener('trooth-feed-smart-refresh-start',resume);
    window.addEventListener('trooth-auth-profile-ready',resume);
    window.addEventListener('beforeunload',stop,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
