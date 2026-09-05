(function () {
  'use strict';
  if (window.__troothHomePolishV3) return;
  window.__troothHomePolishV3 = true;

  const STYLE_ID = 'trooth-home-polish-v3-style';
  const NAV_ID = 'trooth-quick-explore-v3';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${NAV_ID}{display:flex;gap:8px;overflow-x:auto;padding:8px 2px 10px;margin:4px 0 10px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
      #${NAV_ID}::-webkit-scrollbar{display:none}
      #${NAV_ID} button{flex:0 0 auto;border:1px solid rgba(39,174,96,.22);background:#fff;border-radius:999px;padding:8px 13px;font:600 13px/1.1 system-ui,sans-serif;color:#247a49;box-shadow:0 2px 8px rgba(0,0,0,.05);cursor:pointer}
      #${NAV_ID} button:active{transform:scale(.97)}
      #${NAV_ID} button.is-active{background:#dff7e8;border-color:#62c889}
      @media(max-width:700px){
        body{padding-bottom:max(72px,calc(72px + env(safe-area-inset-bottom)))}
        #${NAV_ID}{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);margin-left:-4px;margin-right:-4px;padding-left:6px;padding-right:6px}
        #${NAV_ID} button{padding:9px 14px;font-size:12px}
      }
    `;
    document.head.appendChild(style);
  }

  function findHomeAnchor() {
    return document.querySelector('main, .feed, #feed, .home-feed, [data-feed], .posts, .content') || document.body.firstElementChild;
  }

  function scrollToMatch(words) {
    const nodes = document.querySelectorAll('h1,h2,h3,h4,button,a,[data-category],[data-section],section,article,.card');
    const needle = words.join(' ').toLowerCase();
    for (const el of nodes) {
      const text = (el.textContent || '').trim().toLowerCase();
      if (text && words.some(w => text.includes(w.toLowerCase())) && text.length < 180) {
        el.scrollIntoView({behavior:'smooth',block:'start'});
        return;
      }
    }
    const anchor = findHomeAnchor();
    if (anchor) anchor.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function buildNav() {
    if (document.getElementById(NAV_ID)) return;
    const nav = document.createElement('nav');
    nav.id = NAV_ID;
    nav.setAttribute('aria-label','Trooth quick explore');
    const items = [
      ['🏠','Home',['home']],
      ['📰','News',['news']],
      ['🏆','Sports',['sports']],
      ['🎬','Film & Fashion',['film','fashion']],
      ['🛍️','Stores',['store','market']],
      ['🏠','Property',['property','real estate']],
      ['👥','Groups',['group']]
    ];
    items.forEach(([icon,label,words], index) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = icon + ' ' + label;
      if (index === 0) b.classList.add('is-active');
      b.addEventListener('click', () => {
        nav.querySelectorAll('button').forEach(x => x.classList.remove('is-active'));
        b.classList.add('is-active');
        if (label === 'Home') window.scrollTo({top:0,behavior:'smooth'});
        else scrollToMatch(words);
      });
      nav.appendChild(b);
    });

    const anchor = document.querySelector('header, .topbar, .navbar, nav') || findHomeAnchor();
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(nav, anchor.nextSibling);
  }

  function init() {
    addStyles();
    buildNav();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
  window.addEventListener('load', init, {once:true});
})();
