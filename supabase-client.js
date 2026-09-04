// Trooth Social Independent — Supabase client configuration
// Safe for frontend use: this is the public/publishable key. Never put a service_role/secret key here.
const TROOTH_SUPABASE_URL = 'https://tmshuyvtmbumtrlbhdjq.supabase.co';
const TROOTH_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_AU3U8fFpSCi9ifFwQpAkVA_GTSnhpkz';

(function () {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = function () {
    window.troothSupabase = window.supabase.createClient(
      TROOTH_SUPABASE_URL,
      TROOTH_SUPABASE_PUBLISHABLE_KEY
    );
    window.dispatchEvent(new Event('trooth-supabase-ready'));
  };
  script.onerror = function () {
    console.error('Trooth: Supabase client could not be loaded.');
  };
  document.head.appendChild(script);
})();
