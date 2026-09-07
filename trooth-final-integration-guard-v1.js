// Trooth Social Independent — final integration readiness guard v1
(function(){
  if(window.__troothFinalIntegrationGuardV1)return;
  window.__troothFinalIntegrationGuardV1=true;
  var started=Date.now(),ready=false,errors=[];
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
  function mark(){
    if(!document.documentElement)return;
    document.documentElement.setAttribute('data-trooth-integration',ready?'ready':'waiting');
    if(ready)document.documentElement.setAttribute('data-trooth-supabase','ready');
  }
  function onReady(e){ready=!!(e&&e.detail&&e.detail.client)||!!window.troothSupabase;mark();emit('trooth-integration-ready',{client:window.troothSupabase,elapsed:Date.now()-started})}
  function onError(e){var src=e&&e.detail&&e.detail.src;if(src&&errors.indexOf(src)===-1)errors.push(src);emit('trooth-integration-module-error',{src:src||null,errors:errors.slice()})}
  function boot(){
    mark();
    window.addEventListener('trooth-supabase-ready',onReady,{once:true});
    window.addEventListener('trooth-module-error',onError);
    if(window.troothSupabase){onReady({detail:{client:window.troothSupabase}});return}
    setTimeout(function(){
      if(!ready){mark();emit('trooth-integration-timeout',{elapsed:Date.now()-started,errors:errors.slice()})}
    },12000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
