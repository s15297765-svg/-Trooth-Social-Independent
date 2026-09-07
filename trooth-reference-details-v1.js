// Trooth Social Independent — reference details v1
(function(){
  if(window.__troothReferenceDetailsV1)return;window.__troothReferenceDetailsV1=true;
  function boot(){
    if(document.getElementById('trooth-reference-details-v1'))return;
    var s=document.createElement('style');s.id='trooth-reference-details-v1';s.textContent=`
      body.trooth-reference-home .layout{gap:18px!important}
      body.trooth-reference-home .leftnav{padding:10px!important;background:rgba(255,255,255,.72);border:1px solid #dcefe4;border-radius:24px;box-shadow:0 10px 28px rgba(30,105,66,.045)}
      body.trooth-reference-home .leftnav a{border-radius:15px!important;margin:3px 0;transition:transform .18s ease,background .18s ease,box-shadow .18s ease}
      body.trooth-reference-home .leftnav a:hover{transform:translateX(3px);background:#effbf4;box-shadow:0 5px 14px rgba(30,105,66,.06)}
      body.trooth-reference-home .hero{overflow:hidden;box-shadow:0 18px 42px rgba(30,105,66,.09)!important}
      body.trooth-reference-home .hero h1{position:relative;z-index:3}
      body.trooth-reference-home .hero p{position:relative;z-index:3}
      body.trooth-reference-home .hero .chips{margin-top:18px!important}
      body.trooth-reference-home .stories{padding-bottom:2px}
      body.trooth-reference-home .story,body.trooth-reference-home .story-add{box-shadow:0 8px 22px rgba(30,105,66,.055)!important;border:1px solid #dcefe4!important}
      body.trooth-reference-home .sectionhead{margin-bottom:11px!important}
      body.trooth-reference-home .hubitem{background:linear-gradient(145deg,#fff,#f2fbf5)!important}
      body.trooth-reference-home .hubitem:hover{transform:translateY(-2px);box-shadow:0 12px 25px rgba(30,105,66,.08)!important}
      @media(max-width:900px){body.trooth-reference-home .leftnav{display:none}}
      @media(max-width:700px){body.trooth-reference-home .layout{gap:10px!important}body.trooth-reference-home .hero{box-shadow:0 12px 28px rgba(30,105,66,.07)!important}}
    `;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
