// Trooth Social Independent — Supabase bootstrap + live modules
(function(){
  var scripts=[
    'trooth-green-theme.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'feed-enhancements.js','trooth-live-sync.js','trooth-stories-live.js','trooth-notifications-messages.js',
    'trooth-content-hub.js','trooth-groups-home.js','trooth-groups-enhancement.js','trooth-friends-live.js','trooth-friends-live-enhancement.js',
    'trooth-social-connect.js','trooth-content-live.js','trooth-market-live.js','trooth-market-interactions-live.js',
    'trooth-home-unified.js','trooth-home-content.js','trooth-home-notifications.js','trooth-home-v2.js',
    'trooth-auth-social-v2.js','trooth-auth-profile-v2.js','trooth-auth-signup-live.js','trooth-messaging-notifications-v2.js','trooth-realtime-messenger-bridge.js','trooth-content-hubs-realtime.js','trooth-content-hub-interactions-live.js','trooth-navigation-live.js','trooth-profile-notifications-live.js','trooth-profile-home-sync.js','trooth-profile-live.js','trooth-home-feed-realtime.js','trooth-feed-smart-refresh.js','trooth-post-interactions-live.js','trooth-share-activity-live.js','trooth-comments-live.js','trooth-feed-actions-live.js','trooth-feed-mobile-polish.js','trooth-mobile-polish-v2.js','trooth-post-deeplink-live.js','trooth-friend-realtime-chain.js','trooth-saved-posts-live.js','trooth-unified-navigation.js','trooth-profile-unified.js','trooth-profile-social-live.js','trooth-profile-people-live.js','trooth-notification-links-live.js','trooth-social-actions-live.js','trooth-profile-social-actions.js','trooth-profile-page-realtime.js','trooth-groups-admin-live.js','trooth-group-live-notice.js','trooth-home-dashboard-live.js','trooth-home-feed-upgrade.js','trooth-home-network-upgrade.js'
  ];
  var i=0;function load(){if(i>=scripts.length){window.dispatchEvent(new CustomEvent('trooth-supabase-ready'));return}var s=document.createElement('script');s.src=scripts[i++];s.async=false;s.onload=load;s.onerror=load;document.head.appendChild(s)}load();
})();