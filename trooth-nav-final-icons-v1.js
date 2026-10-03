// Trooth Social Independent — final three-line icon navigation
(function(){
  if(window.__troothFinalIconNavV1)return;
  window.__troothFinalIconNavV1=true;

  const svg = (body) => '<svg class="trooth-nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+body+'</svg>';
  const icons = {
    menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>'),
    messenger: svg('<path d="M4 5.5A5.5 5.5 0 0 1 9.5 0h5A5.5 5.5 0 0 1 20 5.5v5a5.5 5.5 0 0 1-5.5 5.5H10l-5 3v-3.2A5.48 5.48 0 0 1 4 10.5z" transform="translate(0 2)"/><path d="m8 10 3-2 2 2 3-2"/>'),
    news: svg('<path d="M5 4h14v15H5z"/><path d="M8 8h8M8 11h8M8 14h5"/>'),
    sports: svg('<path d="M7 4h10v3H7zM9 7v5a3 3 0 0 0 6 0V7M8 20h8M12 15v5"/>'),
    globe: svg('<circle cx="12" cy="12" r="8.5"/><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5z"/>'),
    stores: svg('<path d="M4 9h16l-1-5H5z"/><path d="M5 9v10h14V9M9 19v-6h6v6"/>'),
    film: svg('<path d="M4 5h16v14H4z"/><path d="m8 5 2 4m4-4 2 4M8 15l2 4m4-4 2 4M4 10h16"/>'),
    property: svg('<path d="m3 11 9-7 9 7v8H3z"/><path d="M9 19v-5h6v5"/>'),
    home: svg('<path d="m3 11 9-8 9 8"/><path d="M5 10v9h14v-9M9 19v-5h6v5"/>'),
    friends: svg('<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.5a4.5 4.5 0 0 1 5 4.5"/>'),
    videos: svg('<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>'),
    dashboard: svg('<path d="M5 19V10M12 19V5M19 19v-7"/><path d="M3 19h18"/>'),
    notifications: svg('<path d="M6 17h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v5z"/><path d="M10 20h4"/>'),
    profile: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>')
  };

  function setIcon(el, key, label){
    if(!el)return;
    el.innerHTML=icons[key];
    el.setAttribute('aria-label',label);
    el.setAttribute('title',label);
    el.classList.add('trooth-final-icon');
  }

  function apply(){
    const wrap=document.querySelector('.trooth-unified-nav');
    if(!wrap)return false;

    setIcon(wrap.querySelector('.trooth-menu'),'menu','Menu');
    setIcon(wrap.querySelector('.trooth-plus'),'plus','Create');
    setIcon(wrap.querySelector('.trooth-search-trigger'),'search','Search');
    setIcon(wrap.querySelector('.trooth-messenger'),'messenger','Messenger');

    const secondary=[
      ['news','News'],['sports','Sports'],['globe','International'],
      ['stores','Stores'],['film','Film / Fashion'],['property','Property']
    ];
    const tertiary=[
      ['home','Home'],['friends','Friends'],['videos','Videos'],
      ['dashboard','Dashboard'],['notifications','Notifications'],['profile','Profile']
    ];
    [secondary,tertiary].forEach((items,row)=>{
      const links=wrap.querySelectorAll(row===0?'.trooth-nav-secondary a':'.trooth-nav-tertiary a');
      items.forEach((item,i)=>setIcon(links[i],item[0],item[1]));
    });

    let style=document.getElementById('trooth-final-icon-nav-css-v1');
    if(!style){
      style=document.createElement('style');
      style.id='trooth-final-icon-nav-css-v1';
      document.head.appendChild(style);
    }
    style.textContent=String.raw`
      /* Final locked three-line header: compact, stable, no horizontal overflow */
      .trooth-unified-nav{width:100%!important;overflow:visible!important}
      .trooth-topbar,.trooth-toprow{width:100%!important;box-sizing:border-box!important}
.trooth-topbar{background:#18a957!important;color:#fff!important;border-bottom:0!important}
      .trooth-toprow{gap:5px!important;padding:5px 7px!important;overflow:hidden!important}
      .trooth-menu,.trooth-icon{width:36px!important;height:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important;display:grid!important;place-items:center!important;flex:none!important;background:transparent!important;color:#fff!important}
      .trooth-nav-svg{width:22px;height:22px;display:block;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
      .trooth-menu .trooth-nav-svg{width:24px;height:24px}
      .trooth-plus .trooth-nav-svg{width:25px;height:25px}
      .trooth-search-trigger .trooth-nav-svg{width:24px;height:24px}
      .trooth-messenger .trooth-nav-svg{width:23px;height:23px}
      .trooth-top-logo{flex:1 1 auto!important;min-width:0!important;margin:0!important;overflow:hidden!important;color:#fff!important}
.trooth-top-logo .trooth-logo-3d{filter:grayscale(1) brightness(0) invert(1)!important}
      .trooth-top-logo .trooth-logo-3d{width:min(150px,100%)!important;height:42px!important;max-width:100%!important;object-fit:contain!important;object-position:left center!important}
      .trooth-nav-secondary,.trooth-nav-tertiary{width:100%!important}.trooth-nav-row{width:100%!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:3px!important;height:42px!important;min-height:42px!important;max-height:42px!important;padding:4px 6px!important;overflow:hidden!important;white-space:normal!important}
      .trooth-nav-row a{width:auto!important;min-width:0!important;max-width:none!important;height:34px!important;padding:0!important;margin:0!important;border:0!important;border-radius:9px!important;background:transparent!important;display:grid!important;place-items:center!important;flex:none!important;color:#14532d!important;overflow:hidden!important}
      .trooth-nav-row a:hover,.trooth-nav-row a:focus,.trooth-nav-row a.active{background:#e8f7ed!important;color:#15803d!important}
      .trooth-nav-row .trooth-nav-svg{width:21px;height:21px}
      .trooth-nav-row a:focus-visible,.trooth-menu:focus-visible,.trooth-icon:focus-visible{outline:2px solid #15803d;outline-offset:1px}
      @media(max-width:600px){
        .trooth-topbar{height:56px!important;min-height:56px!important;max-height:56px!important}
        .trooth-toprow{height:56px!important;min-height:56px!important;padding:4px 5px!important;gap:2px!important}
        .trooth-menu,.trooth-icon{width:37px!important;height:37px!important;min-width:37px!important;max-width:37px!important}
        .trooth-top-logo .trooth-logo-3d{width:min(150px,100%)!important;height:44px!important}
        .trooth-nav-row{height:40px!important;min-height:40px!important;max-height:40px!important;padding:3px 5px!important;gap:2px!important}
        .trooth-nav-row a{height:34px!important}
        .trooth-nav-row .trooth-nav-svg{width:20px;height:20px}
      }
    `;
    return true;
  }

  function start(){
    apply();
    if(window.__troothFinalIconNavObserver)return;
    const observer=new MutationObserver(function(){
      if(document.querySelector('.trooth-unified-nav'))apply();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.__troothFinalIconNavObserver=observer;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
