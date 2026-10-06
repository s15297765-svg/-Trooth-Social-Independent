// Trooth Social Independent — stable Supabase bootstrap
(function(){
  if(window.__troothSupabaseBootstrapStableV4)return;
  window.__troothSupabaseBootstrapStableV4=true;
  var SUPABASE_URL='https://tmshuyvtmbumtrlbhdjq.supabase.co';
  var SUPABASE_KEY='sb_publishable_AU3U8fFpSCi9ifFwQpAkVA_GTSnhpkz';
  var RELEASE='20261003-v35';
  window.troothLoadedModules=window.troothLoadedModules||[];var i=0,readySent=false;
  function dispatch(n,d){try{window.dispatchEvent(new CustomEvent(n,{detail:d||{}}))}catch(e){}}
  function signalReady(){if(readySent||!window.troothSupabase)return;readySent=true;dispatch('trooth-supabase-ready',{client:window.troothSupabase,loaded:window.troothLoadedModules||[]})}
  var scripts=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'];
  function cdn(src){return src.indexOf('cdn.jsdelivr.net')!==-1||src.indexOf('unpkg.com')!==-1}
  function loadNext(){if(i>=scripts.length){if(!window.troothSupabase)dispatch('trooth-supabase-error',{error:new Error('Supabase client could not be loaded')});return}var src=scripts[i++],s=document.createElement('script');s.src=cdn(src)?src:src+'?v='+RELEASE;s.async=false;s.dataset.troothRelease=RELEASE;s.onload=function(){if(cdn(src)&&window.supabase&&window.supabase.createClient&&!window.troothSupabase){try{window.troothSupabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});window.troothLoadedModules.push(src);dispatch('trooth-supabase-client-ready',{client:window.troothSupabase});signalReady()}catch(e){dispatch('trooth-supabase-error',{error:e})}}else if(cdn(src)&&!window.troothSupabase&&(!window.supabase||!window.supabase.createClient)){dispatch('trooth-module-error',{src:src,release:RELEASE,error:'Supabase CDN did not expose createClient'});loadNext();return}else if(window.troothLoadedModules.indexOf(src)===-1)window.troothLoadedModules.push(src);dispatch('trooth-module-loaded',{src:src,release:RELEASE});loadNext()};s.onerror=function(){dispatch('trooth-module-error',{src:src,release:RELEASE});loadNext()};document.head.appendChild(s)}
  document.addEventListener('input',function(e){var el=e.target;if(!el||el.id!=='phone')return;var v=(el.value||'').replace(/[()\s-]/g,'');if(/^03\d{9}$/.test(v))el.value='+92'+v.slice(1);else if(/^3\d{9}$/.test(v))el.value='+92'+v},true);
  loadNext();
})();
