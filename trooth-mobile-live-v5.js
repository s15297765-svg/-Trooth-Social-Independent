// Trooth mobile live polish v5 — final touch layer
(function(){
  if(window.__troothMobileLiveV5)return;
  window.__troothMobileLiveV5=true;
  var css='@media(max-width:700px){*{-webkit-tap-highlight-color:transparent}.top{position:sticky;top:0;z-index:100}.bottomnav{z-index:120}.bottomnav a,.action,.btn,.filelabel,.circle{user-select:none;-webkit-user-select:none}.postinput{box-sizing:border-box}.uploadbar{flex-wrap:wrap}.chips{overflow-x:auto;scrollbar-width:none}.chips::-webkit-scrollbar{display:none}.stories{overflow-x:auto;scrollbar-width:none}.stories::-webkit-scrollbar{display:none}}@media(max-width:430px){.layout{padding-left:8px;padding-right:8px}.card{padding:13px}.bottomnav{gap:2px}.bottomnav a{font-size:11px}.bottomnav .create{flex-basis:43px}.hero{padding:16px}.postactions .action{min-height:38px}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}';
  var s=document.createElement('style');s.id='trooth-mobile-live-v5';s.textContent=css;document.head.appendChild(s);
  document.documentElement.setAttribute('data-trooth-mobile-live','v5');
})();
