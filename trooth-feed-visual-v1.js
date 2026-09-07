// Trooth Social Independent — feed visual polish v1
(function(){
  if(window.__troothFeedVisualV1)return;window.__troothFeedVisualV1=true;
  function boot(){
    if(document.getElementById('trooth-feed-visual-v1'))return;
    var s=document.createElement('style');s.id='trooth-feed-visual-v1';s.textContent=`
      body.trooth-reference-home #feed .post{border:1px solid #dceee4!important;border-radius:22px!important;background:rgba(255,255,255,.97)!important;box-shadow:0 12px 30px rgba(31,104,67,.065)!important;margin-bottom:16px!important}
      body.trooth-reference-home #feed .posthead{padding:2px 2px 0}
      body.trooth-reference-home #feed .postbody{font-size:15.5px!important;line-height:1.65!important;color:#214936!important}
      body.trooth-reference-home #feed .postactions{gap:7px!important;border-top:1px solid #e2eee7!important}
      body.trooth-reference-home #feed .action{background:#f2faf5!important;border:1px solid #e1eee6!important;border-radius:13px!important;color:#286548!important}
      body.trooth-reference-home #feed .action:hover{background:#dff7e8!important}
      body.trooth-reference-home #feed .postmedia{border-radius:18px!important;box-shadow:0 7px 22px rgba(31,104,67,.08)!important}
      body.trooth-reference-home #feed .empty{border-style:dashed!important;background:linear-gradient(145deg,#fbfffc,#effaf4)!important;color:#60796b!important}
      body.trooth-reference-home #stories + .card{margin-top:2px}
      @media(max-width:700px){body.trooth-reference-home #feed .post{border-radius:18px!important;margin-bottom:12px!important}.postbody{font-size:15px!important}.postactions .action{padding:9px 4px!important;font-size:12px!important}}
    `;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
