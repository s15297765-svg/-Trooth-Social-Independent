// Trooth Social Independent — final integration guard v1
(function(){
  if(window.__troothFinalIntegrationV1)return;window.__troothFinalIntegrationV1=true;
  function boot(){
    if(document.getElementById('trooth-final-integration-style'))return;
    var s=document.createElement('style');s.id='trooth-final-integration-style';s.textContent=`
      :root{--trooth-green:#69c79a;--trooth-deep:#145238;--trooth-soft:#e9f8ef;--trooth-line:#dfeee5}
      html{scroll-behavior:smooth}body{background:#f4faf6}
      img{max-width:100%;height:auto}button,a,input,textarea,select{font-family:inherit}
      button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:3px solid rgba(105,199,154,.38);outline-offset:2px}
      .trooth-page-ready{opacity:1;transition:opacity .18s ease}
      @media(max-width:700px){body{padding-bottom:max(8px,env(safe-area-inset-bottom))}.card,.post,.story,.biz,.store,.platform{border-radius:16px}button{min-height:42px}}
      @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*:before,*:after{transition:none!important;animation:none!important}}
    `;document.head.appendChild(s);document.documentElement.classList.add('trooth-page-ready');
    window.dispatchEvent(new CustomEvent('trooth-final-integration-ready',{detail:{version:'v1'}}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
