// Trooth Social Independent — reference-led home visual system v1
(function(){
  if(window.__troothHomeVisualV1)return;window.__troothHomeVisualV1=true;
  function boot(){
    if(document.getElementById('trooth-home-visual-v1'))return;
    var s=document.createElement('style');s.id='trooth-home-visual-v1';s.textContent=`
      :root{--tv-mint:#bff1d5;--tv-light:#ecfff4;--tv-green:#58bd8d;--tv-deep:#15583a;--tv-ink:#173b2b}
      body{background:radial-gradient(900px 420px at 50% -40px,#d9f9e7 0,#f5fcf7 58%,#edf7f1 100%);color:var(--tv-ink)}
      .top{background:rgba(236,255,244,.88)!important;color:var(--tv-deep)!important;border-bottom:1px solid rgba(78,177,128,.2)!important;box-shadow:0 8px 30px rgba(30,100,65,.08)!important}
      .logo{font-size:30px!important;color:var(--tv-deep)!important;letter-spacing:-1.4px!important}.ind{background:#d5f6e3!important;color:var(--tv-deep)!important}
      .circle{background:#fff!important;border-color:#d7eee1!important}.search{box-shadow:0 8px 24px rgba(31,104,67,.07)!important}
      .layout{max-width:1380px!important;grid-template-columns:236px minmax(0,760px) 260px!important;gap:24px!important;padding-top:24px!important}
      .menu{background:rgba(255,255,255,.78)!important;border:1px solid #d8eee1!important;border-radius:26px!important;box-shadow:0 14px 38px rgba(31,104,67,.07)!important}
      .nav{padding:12px 14px!important;border-radius:15px!important}.nav.active{background:linear-gradient(90deg,#d9f8e5,#effff5)!important}
      .hero{min-height:300px!important;padding:32px!important;border-radius:30px!important;background:linear-gradient(135deg,#bcefd2 0%,#e9fff2 48%,#fff 100%)!important;box-shadow:0 18px 45px rgba(38,125,81,.12)!important}
      .hero:before{content:'';position:absolute;width:250px;height:250px;border-radius:50%;right:-70px;top:-80px;background:rgba(88,189,141,.13);box-shadow:0 0 0 55px rgba(88,189,141,.06)}
      .hero:after{content:'T';right:42px!important;bottom:-55px!important;font-size:190px!important;color:rgba(21,88,58,.055)!important}
      .hero h1{font-size:38px!important;max-width:600px;line-height:1.08!important}.hero p{font-size:16px!important;max-width:560px;line-height:1.6}
      .tag{background:#d5f6e3!important;color:#17623f!important}
      .chips{gap:9px!important}.chip{padding:10px 14px!important;border-radius:14px!important;background:rgba(255,255,255,.86)!important;box-shadow:0 5px 14px rgba(30,100,65,.05)}
      .card{border-radius:24px!important;border-color:#dceee4!important;box-shadow:0 12px 34px rgba(31,104,67,.065)!important}
      .stories{padding-bottom:9px!important}.story,.story-add{border-radius:21px!important}.story{min-width:142px!important;height:194px!important}.story-add{min-width:142px!important;height:194px!important}
      .composer{padding:3px}.postinput{border-radius:20px!important;background:#f7fcf9!important}
      .btn{background:linear-gradient(135deg,#329d69,#65c998)!important;border-radius:14px!important}
      .hubgrid{grid-template-columns:repeat(3,1fr)!important}.hubitem{min-height:120px!important;border-radius:18px!important;padding:17px!important;background:linear-gradient(145deg,#fff,#f1fbf5)!important}
      .quick a{border-radius:16px!important;padding:13px!important;background:#f7fcf9!important}
      .side{top:92px!important}.menu{top:92px!important}
      @media(max-width:1100px){.layout{grid-template-columns:205px minmax(0,1fr)!important}.hero h1{font-size:32px!important}.hubgrid{grid-template-columns:1fr 1fr!important}}
      @media(max-width:700px){.layout{display:block!important;padding:10px 9px!important}.hero{min-height:250px!important;padding:22px!important;border-radius:23px!important}.hero h1{font-size:27px!important}.hero:before{width:180px;height:180px}.story,.story-add{min-width:116px!important;height:166px!important}.hubgrid{grid-template-columns:1fr 1fr!important}.card{border-radius:19px!important}}
      @media(max-width:430px){.hero h1{font-size:24px!important}.hubgrid{grid-template-columns:1fr!important}.chip{padding:9px 12px!important}}
    `;document.head.appendChild(s);
    document.body.classList.add('trooth-reference-home');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
