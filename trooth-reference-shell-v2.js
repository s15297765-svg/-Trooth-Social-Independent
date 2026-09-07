// Trooth Social Independent — reference-led visual shell v2
(function(){
  if(window.__troothReferenceShellV2)return;window.__troothReferenceShellV2=true;
  function boot(){
    if(document.getElementById('trooth-reference-shell-v2'))return;
    var s=document.createElement('style');s.id='trooth-reference-shell-v2';s.textContent=`
      :root{--tr-mint:#c8f5dc;--tr-soft:#effcf4;--tr-green:#42ad79;--tr-deep:#0f5536;--tr-border:#d4eee0}
      body.trooth-reference-home{background:linear-gradient(180deg,#effcf4 0,#f8fcf9 32%,#eef8f2 100%)}
      body.trooth-reference-home .top{margin:10px auto 0;max-width:1380px;width:calc(100% - 24px);border-radius:22px;padding:9px 13px!important;position:sticky;top:8px!important;border:1px solid rgba(93,180,135,.22)!important;background:rgba(247,255,250,.9)!important;box-shadow:0 14px 38px rgba(22,93,57,.1)!important}
      body.trooth-reference-home .layout{padding-top:18px!important}
      body.trooth-reference-home .brand{min-width:190px}
      body.trooth-reference-home .logo{font-size:30px!important;font-weight:950!important;color:var(--tr-deep)!important}
      body.trooth-reference-home .searchwrap{max-width:600px}
      body.trooth-reference-home .search{height:43px!important;background:#fff!important;border:1px solid #dcefe4!important}
      body.trooth-reference-home .hero{min-height:320px!important;display:flex;flex-direction:column;justify-content:center;padding:36px 38px!important;border-radius:32px!important;background:linear-gradient(120deg,#b9efd0 0,#dcf9e7 42%,#fff 100%)!important;border:1px solid #c5ead6!important}
      body.trooth-reference-home .hero:before{content:'';position:absolute;right:-80px;top:-110px;width:340px;height:340px;border-radius:50%;border:1px solid rgba(50,151,102,.15);box-shadow:0 0 0 55px rgba(71,176,119,.045),0 0 0 110px rgba(71,176,119,.035)}
      body.trooth-reference-home .hero:after{content:'TROOTH';right:20px!important;bottom:-38px!important;font-size:118px!important;letter-spacing:-7px!important;transform:rotate(-7deg);color:rgba(15,85,54,.045)!important}
      body.trooth-reference-home .hero h1{font-size:42px!important;max-width:650px!important;letter-spacing:-1.6px!important}
      body.trooth-reference-home .hero p{font-size:17px!important;max-width:610px!important}
      body.trooth-reference-home .hero .chips{position:relative;z-index:4;max-width:760px}
      body.trooth-reference-home .hero .chip{border-radius:999px!important;padding:10px 15px!important;border-color:#cce9d9!important}
      body.trooth-reference-home .card{border-radius:25px!important}
      body.trooth-reference-home .sectionhead h2{font-size:19px!important}
      body.trooth-reference-home .stories{gap:14px!important}
      body.trooth-reference-home .story,body.trooth-reference-home .story-add{border-radius:22px!important}
      body.trooth-reference-home .composer{background:linear-gradient(135deg,#fbfffc,#f0faf4);border:1px solid #e0f0e6;border-radius:21px;padding:12px!important}
      body.trooth-reference-home .postinput{background:#fff!important;border-color:#dceee4!important}
      body.trooth-reference-home #feed .post{border-radius:25px!important}
      body.trooth-reference-home .hubgrid{gap:14px!important}
      body.trooth-reference-home .hubitem{min-height:132px!important;border-radius:21px!important;border-color:#dcefe4!important;box-shadow:0 7px 20px rgba(30,105,66,.045)}
      body.trooth-reference-home .side .card,body.trooth-reference-home .side{border-radius:24px!important}
      @media(max-width:1100px){body.trooth-reference-home .hero h1{font-size:35px!important}}
      @media(max-width:700px){body.trooth-reference-home .top{margin:6px 7px 0;width:calc(100% - 14px);border-radius:18px;top:4px!important}.layout{padding-top:10px!important}body.trooth-reference-home .hero{min-height:270px!important;padding:25px 21px!important;border-radius:25px!important}body.trooth-reference-home .hero h1{font-size:28px!important;letter-spacing:-.8px!important}body.trooth-reference-home .hero p{font-size:14px!important}body.trooth-reference-home .hero:after{font-size:70px!important;right:8px!important;bottom:-18px!important}.hero:before{width:210px!important;height:210px!important;right:-70px!important;top:-60px!important}}
      @media(max-width:430px){body.trooth-reference-home .hero h1{font-size:25px!important}.brand{min-width:auto!important}.searchwrap{min-width:0}.search{height:39px!important}}
    `;document.head.appendChild(s);document.body.classList.add('trooth-reference-shell');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
