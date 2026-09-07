// Trooth Social Independent — Global premium UI polish v1
(function(){
  if(window.__troothGlobalPolishV1)return;window.__troothGlobalPolishV1=true;
  function boot(){
    if(document.getElementById('trooth-global-polish-style'))return;
    var s=document.createElement('style');s.id='trooth-global-polish-style';s.textContent=`
      :root{--trooth-green:#69c79a;--trooth-deep:#145238;--trooth-soft:#e9f8ef;--trooth-line:#dfeee5}
      *{box-sizing:border-box}html{scroll-behavior:smooth}body{background:#f4faf6}
      button,a,input,textarea,select{font-family:inherit}button{touch-action:manipulation}
      button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:3px solid rgba(105,199,154,.35);outline-offset:2px}
      .card,.post,.panel,.box{transition:box-shadow .18s,transform .18s,border-color .18s}
      .card:hover,.post:hover{border-color:#cfe8da}
      .btn,.button,.primary,.publish,button[type="submit"]{transition:transform .16s,box-shadow .16s,background .16s}
      .btn:hover,.button:hover,.primary:hover,.publish:hover,button[type="submit"]:hover{transform:translateY(-1px)}
      img{max-width:100%;height:auto}.media img,.post img{border-radius:14px}
      ::selection{background:#bfead0;color:#145238}
      @media(max-width:700px){body{padding-bottom:max(8px,env(safe-area-inset-bottom))}.card,.post{border-radius:16px}.btn,.button,.primary,.publish,button[type="submit"]{min-height:42px}}
      @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
