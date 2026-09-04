// Trooth Social Independent — Supabase client configuration
// Safe for frontend use: this is the public/publishable key. Never put a service_role/secret key here.
const TROOTH_SUPABASE_URL='https://tmshuyvtmbumtrlbhdjq.supabase.co';
const TROOTH_SUPABASE_PUBLISHABLE_KEY='sb_publishable_AU3U8fFpSCi9ifFwQpAkVA_GTSnhpkz';
(function(){
 const theme=document.createElement('script');theme.src='trooth-green-theme.js';document.head.appendChild(theme);
 const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
 script.onload=function(){
  window.troothSupabase=window.supabase.createClient(TROOTH_SUPABASE_URL,TROOTH_SUPABASE_PUBLISHABLE_KEY);
  const files=['feed-enhancements.js','trooth-live-sync.js','trooth-stories-live.js','trooth-notifications-messages.js','trooth-content-hub.js','trooth-groups-home.js','trooth-groups-enhancement.js','trooth-friends-live.js','trooth-social-connect.js','trooth-content-live.js'];let i=0;
  function next(){if(i>=files.length){window.dispatchEvent(new Event('trooth-supabase-ready'));return}const s=document.createElement('script');s.src=files[i++];s.onload=next;s.onerror=next;document.body.appendChild(s)}next();
 };script.onerror=function(){console.error('Trooth: Supabase client could not be loaded.')};document.head.appendChild(script);
})();