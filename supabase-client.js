// Trooth Social Independent — Supabase client bootstrap
(function(){
  if(window.__troothSupabaseBootstrapStableV4)return;window.__troothSupabaseBootstrapStableV4=true;
  var SUPABASE_URL='https://tmshuyvtmbumtrlbhdjq.supabase.co';
  var SUPABASE_KEY='';
  function load(src){return new Promise(function(resolve,reject){var s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  function ready(){if(window.troothSupabase)window.dispatchEvent(new CustomEvent('trooth-supabase-ready'));}
  (async function(){try{if(!window.supabase||!window.supabase.createClient)await load('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');if(!window.supabase||!window.supabase.createClient)await load('https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js');if(!window.supabase||!window.supabase.createClient)return;window.troothSupabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});ready()}catch(e){window.dispatchEvent(new CustomEvent('trooth-supabase-error',{detail:e}))}})();
})();
