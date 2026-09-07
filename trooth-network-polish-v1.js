// Trooth Social Independent — Network surface polish v1
(function(){
  if(window.__troothNetworkPolishV1)return;window.__troothNetworkPolishV1=true;
  function boot(){
    if(document.getElementById('trooth-network-polish-style'))return;
    var s=document.createElement('style');s.id='trooth-network-polish-style';s.textContent=`
      :root{--trooth-green:#69c79a;--trooth-deep:#145238;--trooth-soft:#e9f8ef;--trooth-line:#dfeee5}
      body{background:#f4faf6}.nav,.card,.biz,.post{transition:box-shadow .18s,border-color .18s,transform .18s}
      .nav{border:1px solid var(--trooth-line)}.nav a{display:inline-block;padding:8px 11px;border-radius:999px;transition:.16s}.nav a:hover{background:var(--trooth-soft);color:var(--trooth-deep);transform:translateY(-1px)}
      .biz{border:1px solid var(--trooth-line);box-shadow:0 5px 20px rgba(20,82,56,.06)}.biz:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(20,82,56,.1);border-color:#cfe8da}
      .biz .actions button,.biz .actions a button{min-height:40px}.file{transition:.16s}.file:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(20,82,56,.08)}
      .modalbox{border:1px solid var(--trooth-line);box-shadow:0 22px 60px rgba(20,82,56,.22)}
      @media(max-width:600px){header{gap:10px;flex-wrap:wrap}header b{font-size:19px}.nav{display:flex;overflow-x:auto;flex-wrap:nowrap;white-space:nowrap}.nav a{flex:none}.biz .actions button{width:100%}.biz .actions a{flex:1}.biz .actions a button{width:100%}}
      @media(prefers-reduced-motion:reduce){.nav,.card,.biz,.post,.file,.nav a{transition:none!important}}
    `;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
