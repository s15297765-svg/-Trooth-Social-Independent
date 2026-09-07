// Trooth Social Independent — Network surface consistency v2
(function(){
  if(window.__troothNetworkSurfaceV2)return;window.__troothNetworkSurfaceV2=true;
  function boot(){
    if(document.getElementById('trooth-network-surface-v2-style'))return;
    var s=document.createElement('style');s.id='trooth-network-surface-v2-style';s.textContent=`
      :root{--trooth-green:#69c79a;--trooth-deep:#145238;--trooth-soft:#e9f8ef;--trooth-line:#dfeee5}
      body{background:#f4faf6;color:#173b29}
      header{box-shadow:0 2px 14px rgba(20,82,56,.08)}
      main{max-width:1120px}
      .card,.story,.store,.platform,.biz,.post{border-color:var(--trooth-line);box-shadow:0 7px 24px rgba(20,82,56,.06)}
      input,textarea,select{border-color:#d5e9dc!important;background:#fff}
      button,.btn,.button{border-radius:10px;transition:transform .16s,box-shadow .16s,background .16s}
      button:hover,.btn:hover,.button:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(20,82,56,.10)}
      a{transition:.16s}
      @media(max-width:700px){main{padding:12px}.card,.story,.store,.platform,.biz,.post{border-radius:16px}.nav{overflow-x:auto;flex-wrap:nowrap!important;white-space:nowrap}.nav a{flex:none}.grid{grid-template-columns:1fr}.toolbar{grid-template-columns:1fr!important}}
      @media(prefers-reduced-motion:reduce){*,*:before,*:after{transition:none!important;animation:none!important}}
    `;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
