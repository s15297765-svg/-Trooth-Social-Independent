// Trooth Vision v6 — safe premium interaction layer; preserves existing modules.
(function(){
  if(window.__troothVisionV6)return;
  window.__troothVisionV6=true;
  function addLiveBadge(){
    if(document.getElementById('troothLiveBadge'))return;
    var b=document.createElement('div'); b.id='troothLiveBadge'; b.textContent='● LIVE';
    b.style.cssText='position:fixed;right:14px;bottom:86px;z-index:180;background:#d8f3dc;color:#2d6a4f;border:1px solid #bde4cb;border-radius:999px;padding:7px 10px;font:800 11px system-ui;box-shadow:0 5px 16px rgba(24,91,57,.12)';
    document.body.appendChild(b);
  }
  function addTopButton(){
    if(document.getElementById('troothTop'))return;
    var b=document.createElement('button'); b.id='troothTop'; b.textContent='↑'; b.title='Back to top';
    b.style.cssText='position:fixed;right:14px;bottom:132px;z-index:180;width:40px;height:40px;border:1px solid #bde4cb;border-radius:50%;background:#fff;color:#2d6a4f;font:900 18px system-ui;box-shadow:0 5px 16px rgba(7,26,49,.14);cursor:pointer;display:none';
    b.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})}; document.body.appendChild(b);
    window.addEventListener('scroll',function(){b.style.display=window.scrollY>420?'grid':'none';b.style.placeItems='center'});
  }
  function addQuickActions(){
    if(document.getElementById('troothQuickActions'))return;
    var wrap=document.createElement('div'); wrap.id='troothQuickActions';
    wrap.style.cssText='position:fixed;left:14px;bottom:86px;z-index:180;display:flex;gap:7px;flex-wrap:wrap;max-width:calc(100vw - 90px)';
    var actions=[['📰','News','news.html'],['🏆','Sports','sports.html'],['🛍️','Shop','stores.html'],['👥','Friends','friends.html']];
    actions.forEach(function(x){var a=document.createElement('a');a.href=x[2];a.textContent=x[0]+' '+x[1];a.style.cssText='text-decoration:none;background:#fff;color:#2d6a4f;border:1px solid #bde4cb;border-radius:999px;padding:7px 10px;font:800 11px system-ui;box-shadow:0 5px 16px rgba(7,26,49,.10)';wrap.appendChild(a)});
    document.body.appendChild(wrap);
  }
  function markActive(){
    var path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('a.nav,a.dream-pill,a.dream-mobile-nav a').forEach(function(a){
      var href=(a.getAttribute('href')||'').split('#')[0].split('?')[0].toLowerCase();
      if(!href)return;
      if(href===path){a.classList.add('active')} else if(a.classList.contains('dream-mobile-nav')){a.classList.remove('active')}
    });
  }
  function boot(){addLiveBadge();addTopButton();addQuickActions();markActive();document.body.classList.add('trooth-vision-v6-active')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
