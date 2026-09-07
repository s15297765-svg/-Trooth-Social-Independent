// Trooth Social Independent — profile visual polish v1
(function(){
  if(window.__troothProfileVisualV1)return;window.__troothProfileVisualV1=true;
  function boot(){
    if(document.getElementById('trooth-profile-visual-v1'))return;
    var s=document.createElement('style');s.id='trooth-profile-visual-v1';s.textContent=`
      body:has(#app) { background:radial-gradient(circle at top,#effcf3 0,#f5faf7 38%,#edf7f0 100%)!important; }
      body:has(#app) .top{background:rgba(247,255,250,.92)!important;color:#145238!important;border:1px solid #dcefe4!important;box-shadow:0 12px 34px rgba(30,105,66,.08)!important;backdrop-filter:blur(14px)}
      body:has(#app) .logo{color:#145238!important;font-weight:950!important;letter-spacing:-1px}
      body:has(#app) .home{background:#effbf4!important;color:#246b4a!important;border:1px solid #d5eee0!important}
      body:has(#app) .wrap{width:min(980px,94%)!important;margin:24px auto!important}
      body:has(#app) .card{border:1px solid #dcefe4!important;border-radius:25px!important;box-shadow:0 14px 38px rgba(30,105,66,.075)!important}
      body:has(#app) .cover{height:250px!important;border-radius:21px!important;background:linear-gradient(135deg,#b9efd0,#effcf4 72%,#fff)!important;box-shadow:inset 0 -60px 90px rgba(30,105,66,.06)}
      body:has(#app) .avatar{background:linear-gradient(135deg,#42ad79,#9be3bb)!important;border-color:#fff!important;box-shadow:0 8px 24px rgba(30,105,66,.16)!important}
      body:has(#app) .profileHead h1{color:#0f5536!important;letter-spacing:-.8px}
      body:has(#app) .stat{background:#effbf4!important;border:1px solid #dcefe4!important;border-radius:14px!important;min-width:105px}
      body:has(#app) .tabs button.active,.btn{background:linear-gradient(135deg,#27845b,#42ad79)!important;box-shadow:0 6px 16px rgba(39,132,91,.14)!important}
      body:has(#app) .tabs button{border:1px solid #dcefe4!important}
      body:has(#app) .mediaBtns label{border:1px solid #d5eee0!important;background:#effbf4!important}
      body:has(#app) .post,body:has(#app) .notice,body:has(#app) .item{border-color:#dcefe4!important;border-radius:16px!important;background:#fbfffc!important}
      body:has(#app) .quick a{border:1px solid #dcefe4!important;background:#effbf4!important;border-radius:14px!important}
      @media(max-width:650px){body:has(#app) .wrap{margin:12px auto!important}body:has(#app) .cover{height:205px!important}body:has(#app) .card{border-radius:20px!important}body:has(#app) .profileHead{padding-top:68px!important}.stat{min-width:calc(50% - 5px)!important}}
    `;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
