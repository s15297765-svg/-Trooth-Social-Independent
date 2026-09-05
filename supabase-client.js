// Trooth Social Independent — Supabase bootstrap + live modules
(function(){
  var scripts=[
    'trooth-green-theme.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'feed-enhancements.js','trooth-live-sync.js','trooth-stories-live.js','trooth-notifications-messages.js',
    'trooth-content-hub.js','trooth-groups-home.js','trooth-groups-enhancement.js','trooth-friends-live.js',
    'trooth-social-connect.js','trooth-content-live.js','trooth-market-live.js','trooth-market-interactions-live.js',
    'trooth-home-unified.js','trooth-home-content.js','trooth-home-notifications.js','trooth-home-v2.js',
    'trooth-auth-social-v2.js','trooth-auth-profile-v2.js','trooth-messaging-notifications-v2.js','trooth-navigation-live.js'
  ];
  var i=0;function load(){if(i>=scripts.length){window.dispatchEvent(new CustomEvent('trooth-supabase-ready'));return}var s=document.createElement('script');s.src=scripts[i++];s.async=false;s.onload=load;s.onerror=load;document.head.appendChild(s)}load();
})();
