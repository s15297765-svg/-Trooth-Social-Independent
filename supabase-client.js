// Trooth Social Independent — Supabase client configuration
// Safe for frontend use: this is the public/publishable key. Never put a service_role/secret key here.
const TROOTH_SUPABASE_URL = 'https://tmshuyvtmbumtrlbhdjq.supabase.co';
const TROOTH_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_AU3U8fFpSCi9ifFwQpAkVA_GTSnhpkz';

(function () {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = function () {
    window.troothSupabase = window.supabase.createClient(TROOTH_SUPABASE_URL,TROOTH_SUPABASE_PUBLISHABLE_KEY);
    const enhancement = document.createElement('script');
    enhancement.src = 'feed-enhancements.js';
    enhancement.onload = function () {
      const liveSync = document.createElement('script');
      liveSync.src = 'trooth-live-sync.js';
      liveSync.onload = function () {
        const hub = document.createElement('script');
        hub.src = 'trooth-content-hub.js';
        hub.onload = function () { window.dispatchEvent(new Event('trooth-supabase-ready')); };
        hub.onerror = function () { window.dispatchEvent(new Event('trooth-supabase-ready')); };
        document.body.appendChild(hub);
      };
      liveSync.onerror = function () {
        console.error('Trooth: live sync could not be loaded.');
        const hub = document.createElement('script');
        hub.src = 'trooth-content-hub.js';
        hub.onload = function () { window.dispatchEvent(new Event('trooth-supabase-ready')); };
        hub.onerror = function () { window.dispatchEvent(new Event('trooth-supabase-ready')); };
        document.body.appendChild(hub);
      };
      document.body.appendChild(liveSync);
    };
    enhancement.onerror = function () {
      console.error('Trooth: feed enhancements could not be loaded.');
      const liveSync = document.createElement('script');
      liveSync.src = 'trooth-live-sync.js';
      liveSync.onload = function () { window.dispatchEvent(new Event('trooth-supabase-ready')); };
      liveSync.onerror = function () { window.dispatchEvent(new Event('trooth-supabase-ready')); };
      document.body.appendChild(liveSync);
    };
    document.body.appendChild(enhancement);
  };
  script.onerror = function () { console.error('Trooth: Supabase client could not be loaded.'); };
  document.head.appendChild(script);
})();
