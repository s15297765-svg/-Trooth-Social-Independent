// Trooth Social Independent — Notifications flow polish v1
(function(){
  if(window.__troothNotificationFlowPolishV1)return;
  window.__troothNotificationFlowPolishV1=true;
  function boot(){
    if(document.getElementById('trooth-notification-flow-polish-style'))return;
    var s=document.createElement('style');s.id='trooth-notification-flow-polish-style';s.textContent=`
      :root{--trooth-green:#69c79a;--trooth-deep:#145238;--trooth-soft:#e9f8ef;--trooth-line:#dfeee5}
      .notice{transition:background .16s,transform .16s,box-shadow .16s;border-left:3px solid transparent}
      .notice:hover{transform:translateX(2px);box-shadow:0 4px 14px rgba(20,82,56,.06);border-left-color:var(--trooth-green)}
      .notice.unread{border-left-color:var(--trooth-green)}
      .filter{min-height:38px;touch-action:manipulation;transition:.16s}
      .filter:focus-visible,.notice:focus-visible{outline:3px solid rgba(105,199,154,.28);outline-offset:2px}
      .search:focus{border-color:var(--trooth-green)!important;box-shadow:0 0 0 3px rgba(105,199,154,.12);outline:none}
      @media(max-width:600px){.top{padding:11px 4%}.logo{font-size:21px}.top .btn{min-height:40px}.notice{align-items:flex-start}.notice:hover{transform:none}.filters{padding:10px 12px;gap:6px}.filter{padding:8px 10px}.search{height:42px}.body b{font-size:14px}.body div:nth-child(2){line-height:1.4}.dot{margin-top:5px}}
      @media(prefers-reduced-motion:reduce){.notice,.filter{transition:none!important}}
    `;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();