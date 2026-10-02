// Trooth Social Independent — stable three-line navigation
(function(){
  if(window.__troothUnifiedNavV2)return;
  window.__troothUnifiedNavV2=true;
  function cleanLegacyShell(){
    document.querySelectorAll('.reference-nav,.trooth-three-line-nav,main>nav,.bottom,#trooth-demo-banner,#trooth-demo-hub').forEach(function(el){el.remove();});
    document.body.style.paddingBottom='0';
  }
  function nav(){
    if(document.querySelector('.trooth-unified-nav'))return;
    var oldHeader=document.querySelector('body>header');
    var oldNavs=document.querySelectorAll('.reference-nav,.trooth-three-line-nav,main>nav');
    if(oldHeader)oldHeader.remove();
    oldNavs.forEach(function(el){el.remove()});

    var wrap=document.createElement('div');
    wrap.className='trooth-unified-nav';
    wrap.innerHTML=`
      <header class="trooth-topbar" aria-label="Trooth top bar">
        <div class="trooth-toprow">
          <button class="trooth-menu" type="button" aria-label="Menu" aria-expanded="false">☰</button>
          <a class="trooth-top-logo" href="index.html" aria-label="Trooth Social Independent">
            <img class="trooth-logo-3d" src="assets/trooth-logo-3d.svg?v=20260930-1" alt="Trooth">
          </a>
          <button class="trooth-icon trooth-plus" type="button" aria-label="Create" aria-expanded="false">＋</button>
          <button class="trooth-icon trooth-search-trigger" type="button" aria-label="Search">⌕</button>
          <a class="trooth-icon trooth-messenger" href="chat.html" aria-label="Messenger">💬</a>
          <input id="troothNavSearch" class="trooth-nav-search" type="search" placeholder="Search Trooth…" aria-label="Search Trooth">
        </div>
      </header>
      <nav class="trooth-nav-row trooth-nav-secondary" aria-label="Trooth sections">
        <a href="news.html">News</a><a href="sports.html">Sports</a><a href="news.html#international">International</a><a href="stores.html">Stores</a><a href="film-fashion.html">Film/Fashion</a><a href="property.html">Property</a>
      </nav>
      <nav class="trooth-nav-row trooth-nav-tertiary" aria-label="Trooth social navigation">
        <a href="index.html">Home</a><a href="friends.html">Friends</a><a href="index.html#feed">Videos</a><a href="dashboard.html">Dashboard</a><a href="notifications-messages.html">Notifications</a><a href="profile.html">Profile</a>
      </nav>`;
    document.body.insertBefore(wrap,document.body.firstChild);

    var menuBtn=wrap.querySelector('.trooth-menu');
    if(menuBtn)menuBtn.addEventListener('click',function(){
      var left=document.querySelector('.left');
      if(left){
        left.classList.toggle('trooth-mobile-open');
        menuBtn.setAttribute('aria-expanded',left.classList.contains('trooth-mobile-open')?'true':'false');
        return;
      }
      var fallback=wrap.querySelector('.trooth-mobile-menu');
      if(!fallback){
        fallback=document.createElement('div');
        fallback.className='trooth-mobile-menu';
        fallback.innerHTML='<div class="trooth-create-title">Trooth Menu</div>'+
          '<a href="index.html">🏠 Home</a><a href="friends.html">👥 Friends</a><a href="index.html#feed">🎞️ Videos</a>'+
          '<a href="dashboard.html">📊 Dashboard</a><a href="notifications-messages.html">🔔 Notifications</a><a href="profile.html">👤 Profile</a>'+
          '<a href="news.html">📰 News</a><a href="sports.html">🏏 Sports</a><a href="stores.html">🛍️ Stores — National + International</a>'+
          '<a href="film-fashion.html">🎬 Film/Fashion</a><a href="property.html">🏠 Property</a>';
        wrap.appendChild(fallback);
      }
      var open=fallback.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',open?'true':'false');
    });

    var plusBtn=wrap.querySelector('.trooth-plus');
    if(plusBtn){
      var createMenu=document.createElement('div');
      createMenu.className='trooth-create-menu';
      createMenu.innerHTML='<div class="trooth-create-title">Create</div><a href="post.html" data-create="post">📝 Post</a><a href="story.html" data-create="story">⭕ Story</a><a href="post.html?mode=video" data-create="reel">🎞️ Reel</a><a href="post.html?mode=video" data-create="video">🎥 Video</a><a href="index.html#live" data-create="live">🔴 Live Video</a><a href="post.html?mode=note" data-create="note">📒 Note</a>';
      wrap.querySelector('.trooth-toprow').appendChild(createMenu);
      plusBtn.addEventListener('click',function(){
        var open=createMenu.classList.toggle('open');
        plusBtn.setAttribute('aria-expanded',open?'true':'false');
      });
      createMenu.addEventListener('click',function(e){
        var a=e.target.closest('a[data-create]');
        if(!a)return;
        var type=a.getAttribute('data-create');
        if(type==='post'){ location.href='post.html'; return; }
        if(type==='story'){ location.href='story.html'; return; }
        if(type==='reel' || type==='video'){ location.href='post.html?mode=video'; return; }
        if(type==='live'){ if(window.TroothLive)window.TroothLive.open(); else alert('Trooth Live is still loading. Please try again.'); return; }
        if(type==='note'){ location.href='post.html?mode=note'; return; }
      });
      document.addEventListener('click',function(e){
        if(!wrap.contains(e.target)){createMenu.classList.remove('open');plusBtn.setAttribute('aria-expanded','false');}
      });
    }

    var searchBtn=wrap.querySelector('.trooth-search-trigger');
    if(searchBtn)searchBtn.addEventListener('click',function(){
      var input=document.getElementById('troothNavSearch');
      if(input){
        input.classList.toggle('open');
        if(input.classList.contains('open'))input.focus();
      }else{
        location.href='index.html#feed';
      }
    });

    var searchInput=wrap.querySelector('#troothNavSearch');
    if(searchInput)searchInput.addEventListener('input',function(){
      if(typeof window.filterPosts==='function')window.filterPosts(searchInput.value);
    });

    cleanLegacyShell();
    var style=document.createElement('style');
    style.id='trooth-unified-nav-css-v5';
    style.textContent=`
      .trooth-unified-nav{position:sticky!important;top:0!important;z-index:99999!important;display:block!important;width:100%!important;height:auto!important;min-height:0!important;background:#fff!important;box-shadow:0 2px 12px rgba(20,82,56,.12)!important;isolation:isolate;overflow:visible!important;contain:none!important;backface-visibility:visible!important;transform:none!important;will-change:auto!important}.trooth-unified-nav>*{box-sizing:border-box!important;flex:none!important;visibility:visible!important}.trooth-topbar,.trooth-nav-row{flex:none!important}.trooth-nav-row{position:relative!important;z-index:2!important;min-height:42px!important;height:43px!important;visibility:visible!important;opacity:1!important;display:flex!important}
      .trooth-topbar{display:block!important;width:100%!important;height:62px!important;min-height:62px!important;max-height:62px!important;background:#18a957!important;color:#fff!important;padding:0!important;margin:0!important;position:relative!important;border:0!important;opacity:1!important;visibility:visible!important;overflow:visible!important}
      .trooth-toprow{width:100%;height:62px;min-height:62px;display:flex;align-items:center;gap:8px;padding:7px 10px;overflow:visible}
      .trooth-menu,.trooth-icon{width:42px;height:42px;display:flex!important;align-items:center;justify-content:center;font-size:27px;font-weight:900;border:0;background:transparent;color:#fff!important;text-decoration:none!important;cursor:pointer;flex:none}
      .trooth-plus{font-size:31px!important;position:relative}
      .trooth-create-menu{display:none;position:absolute;top:58px;right:74px;width:190px;background:#fff;border:1px solid #dcebe2;border-radius:14px;box-shadow:0 10px 28px rgba(20,82,56,.18);padding:7px;z-index:1100}
      .trooth-create-menu.open{display:block}
      .trooth-mobile-menu{display:none;position:absolute;top:58px;left:8px;width:220px;max-height:70vh;overflow:auto;background:#fff;border:1px solid #dcebe2;border-radius:14px;box-shadow:0 10px 28px rgba(20,82,56,.18);padding:7px;z-index:1100}
      .trooth-mobile-menu.open{display:block}
      .trooth-mobile-menu a{display:block;color:#14532d!important;text-decoration:none!important;font-weight:800;padding:10px;border-radius:9px;font-size:14px}
      .trooth-mobile-menu a:hover{background:#e5f7eb}
      .trooth-create-title{padding:7px 10px 5px;font-weight:900;color:#14532d;font-size:14px;border-bottom:1px solid #e8f1eb;margin-bottom:4px}
      .trooth-create-menu a{display:block!important;color:#14532d!important;text-decoration:none!important;font-weight:800;padding:10px;border-radius:9px;font-size:14px}
      .trooth-create-menu a:hover{background:#e5f7eb}
      .trooth-messenger{font-size:23px!important}
      .trooth-search-trigger{font-size:28px!important}
      .trooth-nav-search{display:none;position:absolute;left:54px;right:54px;top:64px;height:42px;border:1px solid #cfe8d8;border-radius:22px;background:#fff;color:#173b29;padding:0 15px;font-size:14px;box-shadow:0 8px 24px rgba(20,82,56,.16);z-index:1200;outline:none}
      .trooth-nav-search.open{display:block}
      .trooth-top-logo{display:flex;align-items:center;min-width:0;flex:1;color:#fff!important;text-decoration:none!important;justify-content:flex-start;overflow:hidden}
      .trooth-top-logo .trooth-logo-3d{display:block;width:190px;height:44px;max-width:100%;object-fit:contain;object-position:left center;filter:grayscale(1) brightness(0) invert(1)}

      /* Unified one-page shell: remove legacy duplicate side navigation */
      .trooth-unified-nav~.layout{display:block;max-width:900px}
      .trooth-unified-nav~.layout>.left,.trooth-unified-nav~.layout>.right{display:none!important}
      .trooth-nav-row{width:100%;height:43px!important;min-height:43px!important;display:flex!important;gap:4px;align-items:center;justify-content:center;overflow-x:auto;overflow-y:hidden;white-space:nowrap;background:#fff;padding:7px 8px;border-bottom:1px solid #e3eee7;scrollbar-width:none!important}.trooth-nav-row::-webkit-scrollbar{display:none!important}
      .trooth-nav-row a{flex:0 0 auto!important;color:#14532d!important;text-decoration:none!important;font-weight:800;padding:8px 10px;border-radius:9px}
      .trooth-nav-row a:hover,.trooth-nav-row a:focus{background:#e5f7eb}
      /* One-page mobile shell: the unified header owns all navigation. */
      .bottom{display:none!important}
      body{padding-bottom:0!important}
      #trooth-demo-banner,#trooth-demo-hub{display:none!important}
      .trooth-composer-card .postbox{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

      @media(max-width:600px){
        .trooth-topbar{min-height:56px!important}
        .trooth-toprow{min-height:56px;padding:5px 6px;gap:3px}
        .trooth-menu,.trooth-icon{width:38px;height:38px;font-size:23px}
        .trooth-plus{font-size:29px!important}.trooth-search-trigger{font-size:25px!important}.trooth-messenger{font-size:21px!important}
        .trooth-top-logo .trooth-logo-3d{width:175px;height:40px}
        .trooth-nav-search{left:48px;right:48px;top:58px;height:40px}
        .trooth-topbar{height:56px!important;min-height:56px!important;max-height:56px!important}.trooth-toprow{height:56px;min-height:56px}.trooth-nav-row{height:42px!important;min-height:42px!important;justify-content:flex-start;padding:6px 5px}
        .trooth-nav-row a{font-size:12px;padding:7px 8px}
      }
    `;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',nav,{once:true});else nav();
})();