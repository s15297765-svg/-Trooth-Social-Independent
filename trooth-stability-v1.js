// Trooth Social Independent — core stability guard v1
(function(){
  if(window.__troothStabilityV1)return;
  window.__troothStabilityV1=true;

  function run(){
    try{
      var sb=window.troothSupabase;
      if(!sb)return;
      window.troothSafeRefresh=function(fn){
        try{ return Promise.resolve(fn()).catch(function(err){ console.warn('[Trooth]',err); return null; }); }
        catch(err){ console.warn('[Trooth]',err); return Promise.resolve(null); }
      };
      window.troothNormalizePhone=function(value){
        var v=String(value||'').replace(/[()\s-]/g,'');
        if(/^03\d{9}$/.test(v))return '+92'+v.slice(1);
        if(/^3\d{9}$/.test(v))return '+92'+v;
        return v;
      };
      window.dispatchEvent(new CustomEvent('trooth-stability-ready'));
    }catch(e){ console.warn('[Trooth stability]',e); }
  }

  if(window.troothSupabase)run();
  window.addEventListener('trooth-supabase-client-ready',run);
  window.addEventListener('trooth-supabase-ready',run);
})();
