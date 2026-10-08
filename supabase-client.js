// Trooth Social Independent — stable Supabase bootstrap
(function(){
  if(window.__troothSupabaseBootstrapStableV5)return;
  window.__troothSupabaseBootstrapStableV5=true;

  var SUPABASE_URL='https://tmshuyvtmbumtrlbhdjq.supabase.co';
  var SUPABASE_KEY='sb_publishable_AU3U8fFpSCi9ifFwQpAkVA_GTSnhpkz';
  var RELEASE='20261008-v37';
  var scripts=[
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js',
    'https://unpkg.com/@supabase/supabase-js@2.117.2/dist/umd/supabase.js'
  ];
  var i=0,readySent=false,startedAt=Date.now();

  window.troothLoadedModules=window.troothLoadedModules||[];

  function dispatch(n,d){
    try{window.dispatchEvent(new CustomEvent(n,{detail:d||{}}))}catch(e){}
  }
  function signalReady(){
    if(readySent||!window.troothSupabase)return;
    readySent=true;
    dispatch('trooth-supabase-ready',{client:window.troothSupabase,loaded:window.troothLoadedModules||[]});
  }
  function fail(src,message){
    dispatch('trooth-supabase-error',{src:src,error:new Error(message||'Supabase could not be loaded')});
  }
  function loadNext(){
    if(i>=scripts.length){
      fail('all','Supabase client could not be loaded. Network/CDN access is unavailable.');
      return;
    }
    var src=scripts[i++],s=document.createElement('script');
    s.src=src+'?trooth='+RELEASE;
    s.async=false;
    s.dataset.troothRelease=RELEASE;
    s.onload=function(){
      if(window.supabase&&window.supabase.createClient&&!window.troothSupabase){
        try{
          window.troothSupabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
            auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
          });
          window.troothLoadedModules.push(src);
          dispatch('trooth-supabase-client-ready',{client:window.troothSupabase,src:src});
          signalReady();
          return;
        }catch(e){
          fail(src,e.message||'Supabase client initialization failed');
        }
      }
      dispatch('trooth-module-error',{src:src,release:RELEASE,error:'Supabase CDN did not expose createClient'});
      loadNext();
    };
    s.onerror=function(){
      dispatch('trooth-module-error',{src:src,release:RELEASE,error:'Supabase CDN request failed'});
      loadNext();
    };
    document.head.appendChild(s);
  }

  document.addEventListener('input',function(e){
    var el=e.target;if(!el||el.id!=='phone')return;
    var v=(el.value||'').replace(/[()\s-]/g,'');
    if(/^03\d{9}$/.test(v))el.value='+92'+v.slice(1);
    else if(/^3\d{9}$/.test(v))el.value='+92'+v;
  },true);

  loadNext();
})();