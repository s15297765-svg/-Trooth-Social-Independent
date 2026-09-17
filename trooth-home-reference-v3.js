// Trooth Social Independent — Home Feed reference polish v3
(function(){
  if(document.getElementById('trooth-home-reference-v3'))return;
  if(!location.pathname.endsWith('/index.html')&&!location.pathname.endsWith('/'))return;
  var s=document.createElement('style');
  s.id='trooth-home-reference-v3';
  s.textContent=`
    body{background:#f0f3f1!important}
    .layout{align-items:start!important;padding-top:12px!important}
    .hero{margin-bottom:10px!important;background:#fff!important;padding:14px 16px!important}
    .hero .badge{font-size:8px!important;padding:4px 8px!important}
    .hero h1{font-size:19px!important;margin:5px 0 3px!important}
    .hero p{font-size:12px!important}
    .tabs{margin-top:9px!important}
    .tabs a{padding:6px 10px!important;font-size:10px!important}
    .card{border-color:#e2e8e4!important}
    section>.card:nth-of-type(2){padding-bottom:10px!important}
    .stories{gap:8px!important}
    .story{min-width:112px!important;height:158px!important;border-radius:14px!important}
    .story.add{background:linear-gradient(180deg,#f3fff7,#e8f8ee)!important}
    .story.add span{box-shadow:0 4px 12px rgba(24,169,87,.22)}
    .composer{gap:9px!important}
    .mini{box-shadow:0 0 0 3px #eef8f2!important}
    .postbox{font-size:13px!important;min-height:42px!important}
    .tools{align-items:center!important}
    .tool{padding:8px 10px!important;background:#f7f9f8!important}
    .postbtn{min-width:60px!important}
    #feed .post{padding:13px 14px 9px!important}
    .posthead{padding-bottom:2px!important}
    .posthead .mini{width:40px!important;height:40px!important}
    .postbody{margin:9px 0 10px!important}
    .postmedia{border-radius:12px!important;max-height:480px!important}
    .actions{margin-top:9px!important}
    .actions .action{background:transparent!important;border-radius:7px!important}
    .right .card{padding:13px!important}
    .quick a{padding:9px 10px!important}
    @media(max-width:700px){
      .layout{padding:5px 5px 8px!important}
      .hero{margin-bottom:7px!important;padding:12px 12px 11px!important}
      .hero h1{font-size:18px!important}
      .tabs{margin-top:7px!important}
      .stories{padding-bottom:1px!important}
      .story{min-width:101px!important;height:144px!important;border-radius:13px!important}
      section>.card{margin-bottom:7px!important}
      #feed .post{padding:12px 11px 8px!important}
      .postbody{font-size:14px!important}
      .postmedia{border-radius:10px!important}
      .tools{gap:5px!important}
      .tool{padding:7px 8px!important;font-size:11px!important}
      .postbtn{padding:8px 13px!important}
    }
  `;
  document.head.appendChild(s);
})();
