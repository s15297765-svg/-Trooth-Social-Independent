// Trooth mobile live polish v1 — additive only, safe on desktop
(function(){
  if(window.__troothMobileLiveV1)return;
  window.__troothMobileLiveV1=true;
  var css='@media(max-width:700px){html,body{width:100%;max-width:100%;overflow-x:hidden}.top{min-height:58px}.layout{width:100%;max-width:100%;margin:0;padding:10px 9px 14px}.hero,.card{max-width:100%;overflow:hidden}.searchwrap{min-width:0}.search{min-width:0}.composer{min-width:0}.postinput{min-width:0;width:100%}.uploadbar{width:100%}.postactions .action{min-width:0}.hubgrid,.grid{width:100%}.bottomnav{padding-bottom:env(safe-area-inset-bottom);height:calc(64px + env(safe-area-inset-bottom))}}@media(max-width:430px){.brand{flex:0 0 auto}.logo{font-size:24px}.top{gap:7px}.search{height:38px}.circle{width:36px;height:36px}.hero h1{line-height:1.2}.postbody{overflow-wrap:anywhere}}';
  var s=document.createElement('style');s.id='trooth-mobile-live-v1';s.textContent=css;document.head.appendChild(s);
  document.documentElement.setAttribute('data-trooth-mobile-live','v1');
})();
