// Trooth Social Independent — stable Supabase bootstrap
(function(){
  if(window.__troothSupabaseBootstrapStableV4)return;
  window.__troothSupabaseBootstrapStableV4=true;
  var SUPABASE_URL='https://tmshuyvtmbumtrlbhdjq.supabase.co';
  var SUPABASE_KEY='sb_publishable_AU3U8fFpSCi9ifFwQpAkVA_GTSnhpkz';
  var RELEASE='20260908-v7';
  var scripts=[
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js',
    'trooth-mobile-live-v4.js','trooth-mobile-live-v5.js','trooth-mobile-live-v6.js',
    'trooth-stability-v1.js','trooth-globe-logo-v1.js','trooth-network-flow-v2.js','trooth-network-ux-v3.js','trooth-network-ui-sync-v1.js','trooth-global-unread-badges-v1.js','trooth-profile-friends-chat-flow-v1.js','trooth-friends-deeplink-v1.js','trooth-friends-ui-polish-v1.js','trooth-network-action-guard-v1.js','trooth-mobile-nav-polish-v1.js','trooth-profile-identity-sync-v1.js','trooth-feed-activity-bridge-v1.js','trooth-feed-ux-v1.js','feed-enhancements.js','trooth-feed-modern-v1.js','trooth-global-polish-v1.js','trooth-network-polish-v1.js','trooth-network-surface-v2.js','trooth-final-integration-v1.js','trooth-final-integration-guard-v1.js','trooth-business-ux-v1.js','trooth-business-follow-v1.js','trooth-business-owner-v1.js','trooth-business-analytics-v1.js','trooth-business-posts-v1.js','trooth-unified-navigation.js','trooth-profile-mobile-polish-v1.js','trooth-notifications-mobile-polish-v1.js','trooth-chat-flow-polish-v1.js','trooth-social-connection-flow-v1.js','trooth-notification-flow-polish-v1.js','trooth-notification-action-flow-v1.js','trooth-post-deeplink-v1.js','trooth-e2e-flow-guard-v1.js','trooth-demo-data-v1.js','trooth-auth-ux-v1.js','trooth-composer-ux-v1.js','trooth-auth-ux-v2.js','trooth-profile-completion-v1.js','trooth-home-visual-v1.js','trooth-reference-shell-v2.js','trooth-reference-details-v1.js','trooth-profile-access-polish-v1.js','trooth-profile-visual-v1.js','trooth-feed-visual-v1.js','trooth-resilience-ux-v1.js','trooth-auth-phone-v3.js','trooth-feed-endpoint-v1.js','trooth-feed-groups-v1.js','trooth-profile-deeplink-v2.js','trooth-profile-notification-deeplink-v1.js','trooth-profile-social-actions-v1.js','trooth-next-polish-v1.js','trooth-live-feed-v1.js'
  ];
  window.troothLoadedModules=window.troothLoadedModules||[];
  var i=0,readySent=false;
  function dispatch(n,d){try{window.dispatchEvent(new CustomEvent(n,{detail:d||{}}));}catch(e){}}
  function signalReady(){if(readySent||!window.troothSupabase)return;readySent=true;dispatch('trooth-supabase-ready',{client:window.troothSupabase,loaded:window.troothLoadedModules||[]});}
  function isSupabaseCdn(src){return src.indexOf('cdn.jsdelivr.net')!==-1||src.indexOf('unpkg.com')!==-1;}
  function releaseSrc(src){return isSupabaseCdn(src)?src:src+'?v='+RELEASE;}
  function loadNext(){
    if(i>=scripts.length){if(!window.troothSupabase)dispatch('trooth-supabase-error',{error:new Error('Supabase client could not be loaded from the available CDNs')});return;}
    var src=scripts[i++],loadSrc=releaseSrc(src),s=document.createElement('script');s.src=loadSrc;s.async=false;s.dataset.troothRelease=RELEASE;
    s.onload=function(){
      if(isSupabaseCdn(src)&&window.supabase&&window.supabase.createClient&&!window.troothSupabase){try{window.troothSupabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});window.troothLoadedModules.push(src);dispatch('trooth-supabase-client-ready',{client:window.troothSupabase});signalReady();}catch(e){dispatch('trooth-supabase-error',{error:e});}}
      else if(window.troothLoadedModules.indexOf(src)===-1)window.troothLoadedModules.push(src);
      dispatch('trooth-module-loaded',{src:src,release:RELEASE});loadNext();
    };
    s.onerror=function(){dispatch('trooth-module-error',{src:src,release:RELEASE});loadNext();};document.head.appendChild(s);
  }
  document.addEventListener('input',function(e){var el=e.target;if(!el||el.id!=='phone')return;var v=(el.value||'').replace(/[()\s-]/g,'');if(/^03\d{9}$/.test(v))el.value='+92'+v.slice(1);else if(/^3\d{9}$/.test(v))el.value='+92'+v;},true);
  loadNext();
})();
