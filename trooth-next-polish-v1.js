// Trooth Next Polish v1 — stronger social UX, mobile-safe controls, and active navigation
(function(){
  if(window.__troothNextPolishV1)return;window.__troothNextPolishV1=true;
  function css(){
    if(document.getElementById('trooth-next-polish-style'))return;
    var s=document.createElement('style');s.id='trooth-next-polish-style';s.textContent=`
      :root{--tn-green:#74c69d;--tn-dark:#2d6a4f;--tn-soft:#d8f3dc;--tn-bg:#f3fbf6;--tn-border:#dceee3}
      html{scroll-behavior:smooth}body{background:var(--tn-bg)!important;color:#183b2a!important}
      a,button{ -webkit-tap-highlight-color:transparent }
      button,.btn{border-radius:12px!important;font-weight:800!important;cursor:pointer}
      .nav.active,.nav[aria-current="page"]{background:var(--tn-soft)!important;color:var(--tn-dark)!important;font-weight:900!important}
      .top .search input:focus,.search input:focus{outline:0;border-color:var(--tn-green)!important;box-shadow:0 0 0 3px rgba(116,198,157,.16)!important}
      .card,.menu,.post,.panel,.box{scroll-margin-top:84px}
      .postactions .action{border:1px solid var(--tn-border)!important;min-height:40px;transition:transform .15s ease,background .15s ease}
      .postactions .action:hover{background:var(--tn-soft)!important;color:var(--tn-dark)!important;transform:translateY(-1px)}
      .quick a,.hubitem,.tile,.friend-card,.conversation,.notification{border-color:var(--tn-border)!important}
      .quick a:focus,.hubitem:focus,.tile:focus,.friend-card:focus,.conversation:focus,.notification:focus{outline:2px solid var(--tn-green);outline-offset:2px}
      .trooth-ux-toast{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:100000;background:#081b32;color:#fff;padding:10px 16px;border-radius:999px;font:800 13px system-ui;box-shadow:0 8px 28px #0003;opacity:0;animation:tnIn .2s ease forwards}
      @keyframes tnIn{to{opacity:1}}
      @media(max-width:650px){body{padding-bottom:82px}.top{position:sticky;top:0;z-index:9000}.postactions{display:grid!important;grid-template-columns:repeat(3,1fr);gap:5px!important}.postactions .action{min-width:0!important;padding:9px 3px!important}.quick a{min-height:44px;display:flex;align-items:center}.top .search{max-width:none}.card,.post{border-radius:16px!important}}
    `;document.head.appendChild(s)}
  function mark(){var path=(location.pathname.split('/').pop()||'index.html').toLowerCase();document.querySelectorAll('a[href]').forEach(function(a){var h=(a.getAttribute('href')||'').split('#')[0].split('?')[0].toLowerCase();if(h===path)a.classList.add('active');if(h==='notifications-messages.html'&&/message|chat|💬/i.test((a.textContent||'')+' '+(a.title||'')))a.setAttribute('href','chat.html');if(h==='auth.html'&&/profile|my profile/i.test((a.textContent||'')))a.setAttribute('href','profile.html')})}
  function toast(msg){var t=document.createElement('div');t.className='trooth-ux-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove()},1600)}
  function enhance(){css();mark();document.querySelectorAll('button,a').forEach(function(el){if(!el.getAttribute('aria-label')){var text=(el.textContent||'').trim();if(text&&text.length<50)el.setAttribute('aria-label',text)}});document.querySelectorAll('input,textarea').forEach(function(i){if(i.placeholder&&!i.getAttribute('aria-label'))i.setAttribute('aria-label',i.placeholder)});document.body.classList.add('trooth-next-polished')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();window.addEventListener('load',enhance);new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
})();
