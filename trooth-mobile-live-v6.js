// Trooth mobile live polish v6 — safe final touch layer
(function(){
  if(window.__troothMobileLiveV6)return;
  window.__troothMobileLiveV6=true;
  var css='@media(max-width:700px){html{scroll-behavior:smooth}body{-webkit-tap-highlight-color:transparent}.top{position:sticky;top:0;z-index:100}.card,.hero{contain:layout paint}.postactions .action,.bottomnav a,.btn,.filelabel,.circle{user-select:none;-webkit-user-select:none}.bottomnav{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}input,textarea,button{font-size:16px}}@media(max-width:430px){.layout{padding-left:8px;padding-right:8px}.card{padding:13px}.hero{padding:16px}.story,.story-add{min-width:104px;height:150px}.bottomnav{height:calc(64px + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom)}.bottomnav a{font-size:11px}.postactions .action{font-size:11px;min-height:40px}.search{height:38px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.postactions .action:active,.btn:active,.filelabel:active{transform:none}}';
  var s=document.createElement('style');s.id='trooth-mobile-live-v6';s.textContent=css;document.head.appendChild(s);
  document.documentElement.setAttribute('data-trooth-mobile-live','v6');
})();
