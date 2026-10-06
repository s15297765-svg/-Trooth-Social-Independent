// Trooth Social Independent — stable three-line navigation
(function(){
  if(window.__troothUnifiedNavV2)return;
  window.__troothUnifiedNavV2=true;
  function cleanLegacyShell(){
    document.querySelectorAll('.reference-nav,.trooth-three-line-nav,main>nav,.bottom,.top,#trooth-demo-banner,#trooth-demo-hub').forEach(function(el){el.remove();});
    document.body.style.paddingBottom='0';
  }
  function nav(){
    if(document.querySelector('.trooth-unified-nav'))return;
    var oldHeader=document.querySelector('body>header');
    var oldNavs=document.querySelectorAll('.reference-nav,.trooth-three-line-nav,main>nav,.top');
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
        <a href="news.html" aria-label="News" title="News">📰</a><a href="sports.html" aria-label="Sports" title="Sports">🏏</a><a href="news.html#international" aria-label="International" title="International">🌐</a><a href="stores.html" aria-label="Stores" title="Stores">🛍️</a><a href="film-fashion.html" aria-label="Film/Fashion" title="Film/Fashion">🎬</a><a href="property.html" aria-label="Property" title="Property">🏠</a>
      </nav>
      <nav class="trooth-nav-row trooth-nav-tertiary" aria-label="Trooth social navigation">
        <a href="index.html" aria-label="Home" title="Home">⌂</a><a href="friends.html" aria-label="Friends" title="Friends">👥</a><a href="index.html#feed" aria-label="Videos" title="Videos">▶</a><a href="dashboard.html" aria-label="Dashboard" title="Dashboard">▦</a><a href="notifications-messages.html" aria-label="Notifications" title="Notifications">🔔</a><a href="profile.html" aria-label="Profile" title="Profile">👤</a>
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
        fallback.innerHTML='<div class="trooth-menu-head"><div class="trooth-menu-profile"><div class="trooth-menu-avatar" id="troothMenuAvatar">T</div><div class="trooth-menu-name-wrap"><a class="trooth-menu-name" href="profile.html" id="troothMenuName">Trooth User</a><span class="trooth-menu-sub">Trooth Social Independent</span></div><a class="trooth-menu-chevron" href="profile.html" aria-label="Profile">⌄</a></div><a class="trooth-create-page" href="creator-page.html"><span class="tm-icon">＋</span><span>Create Trooth Page</span></a></div>'+
          '<div class="trooth-menu-scroll"><div class="trooth-menu-label">Your shortcuts</div><div class="trooth-shortcuts">'+
          '<a href="friends.html"><span class="tm-icon">♧</span><b>Friends</b></a><a href="dashboard.html"><span class="tm-icon">▥</span><b>Dashboard</b></a><a href="saved.html"><span class="tm-icon">🔖</span><b>Saved</b></a><a href="activity.html"><span class="tm-icon">↶</span><b>Memories</b></a><a href="reels.html"><span class="tm-icon">▣</span><b>Reels</b></a><a href="groups.html"><span class="tm-icon">♧</span><b>Groups</b></a><a href="feed.html"><span class="tm-icon">◔</span><b>Feeds</b></a><a href="stores.html"><span class="tm-icon">▤</span><b>Market</b></a></div>'+
          '<button class="trooth-see-more" type="button" aria-expanded="false"><span class="tm-icon">⌄</span><b>See more</b></button><div class="trooth-more-links" hidden>'+
          '<a href="business.html"><span class="tm-icon">💼</span>Business</a><a href="news.html"><span class="tm-icon">📰</span>News</a><a href="sports.html"><span class="tm-icon">🏏</span>Sports</a><a href="film-fashion.html"><span class="tm-icon">🎬</span>Film / Fashion</a><a href="property.html"><span class="tm-icon">🏠</span>Property</a><a href="stores.html"><span class="tm-icon">🛍️</span>International Stores</a><a href="chat.html"><span class="tm-icon">💬</span>Messages</a><a href="notifications-messages.html"><span class="tm-icon">🔔</span>Notifications</a></div>'+
          '<div class="trooth-menu-section"><button class="trooth-menu-section-btn" type="button" aria-expanded="false"><span class="tm-icon">?</span><b>Help and support</b><span class="tm-chevron">⌄</span></button><div class="trooth-menu-section-body" hidden><a href="settings.html#help"><span class="tm-icon">?</span>Help Center</a><a href="settings.html#support"><span class="tm-icon">◉</span>Report a problem</a></div></div>'+
          '<div class="trooth-menu-section"><button class="trooth-menu-section-btn" type="button" aria-expanded="false"><span class="tm-icon">⚙</span><b>Settings and privacy</b><span class="tm-chevron">⌄</span></button><div class="trooth-menu-section-body" hidden>'+
          '<a href="settings.html"><span class="tm-icon">⚙</span>Settings</a><a href="settings.html#privacy"><span class="tm-icon">▢</span>Privacy Center</a><a href="settings.html#time"><span class="tm-icon">◷</span>Time management</a><a href="settings.html#devices"><span class="tm-icon">⌂</span>Device requests</a><a href="settings.html#ads"><span class="tm-icon">▣</span>Your Ad Activity</a><a href="settings.html#mobile"><span class="tm-icon">⌁</span>Mobile Center</a><a href="settings.html#payments"><span class="tm-icon">▱</span>Orders and payments</a><a href="settings.html#links"><span class="tm-icon">↗</span>Link history</a><a href="settings.html#appearance"><span class="tm-icon">◐</span>Dark mode</a><a href="settings.html#language"><span class="tm-icon">◉</span>Language</a><a href="settings.html#app-icon"><span class="tm-icon">◉</span>App icon</a></div></div>'+
          '<div class="trooth-menu-footer">Trooth Social Independent · Built for social + business networking</div></div>';
        wrap.appendChild(fallback);
        var nm=document.getElementById('sideName'), av=document.getElementById('sideAvatar');
        if(nm && nm.textContent.trim()) document.getElementById('troothMenuName').textContent=nm.textContent.trim();
        if(av && av.querySelector('img')) document.getElementById('troothMenuAvatar').innerHTML=av.innerHTML;
        var more=fallback.querySelector('.trooth-see-more'), moreLinks=fallback.querySelector('.trooth-more-links');
        if(more) more.addEventListener('click',function(){var isOpen=!moreLinks.hidden;moreLinks.hidden=isOpen;more.setAttribute('aria-expanded',isOpen?'false':'true');more.querySelector('.tm-icon').textContent=isOpen?'⌄':'⌃';});
        fallback.querySelectorAll('.trooth-menu-section-btn').forEach(function(btn){btn.addEventListener('click',function(){var body=btn.nextElementSibling,isOpen=!body.hidden;body.hidden=isOpen;btn.setAttribute('aria-expanded',isOpen?'false':'true');var chev=btn.querySelector('.tm-chevron');if(chev)chev.textContent=isOpen?'⌄':'⌃';});});
      }
      var open=fallback.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',open?'true':'false');
    });

    var plusBtn=wrap.querySelector('.trooth-plus');
    if(plusBtn){
      var createMenu=document.createElement('div');
      createMenu.className='trooth-create-menu';
      createMenu.innerHTML='<div class="trooth-create-title">Create</div><a href="post.html" data-create="post">📝 Post</a><a href="story.html" data-create="story">⭕ Story</a><a href="reels.html" data-create="reel">🎞️ Reel</a><a href="post.html?mode=video" data-create="video">🎥 Video</a><a href="index.html#live" data-create="live">🔴 Live Video</a><a href="post.html?mode=note" data-create="note">📒 Note</a>';
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
        if(type==='reel'){ location.href='reels.html'; return; } if(type==='video'){ location.href='post.html?mode=video'; return; }
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
      .trooth-mobile-menu{display:none;position:absolute;top:58px;left:0;width:min(390px,88vw);height:calc(100vh - 58px);max-height:none;overflow:hidden;background:#fff;border:0;border-right:1px solid #dcebe2;border-radius:0 18px 18px 0;box-shadow:12px 0 34px rgba(20,82,56,.20);padding:0;z-index:1100}
      .trooth-mobile-menu.open{display:flex;flex-direction:column}
      .trooth-menu-head{padding:12px 12px 10px;border-bottom:1px solid #e8eee9;background:#fff}.trooth-menu-profile{display:flex;align-items:center;gap:10px;padding:4px 2px 12px}.trooth-menu-avatar{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;overflow:hidden;background:#e8f7ee;color:#168447;font-weight:950;font-size:20px;flex:none}.trooth-menu-avatar img{width:100%;height:100%;object-fit:cover}.trooth-menu-name-wrap{min-width:0;flex:1;display:flex;flex-direction:column}.trooth-menu-name{color:#111!important;text-decoration:none!important;font-size:18px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.trooth-menu-sub{color:#718078;font-size:10px;margin-top:2px}.trooth-menu-chevron{width:38px;height:38px;border-radius:50%;background:#f1f4f2;color:#18231d!important;text-decoration:none!important;display:grid;place-items:center;font-size:25px}.trooth-create-page{display:flex;align-items:center;gap:10px;padding:10px 8px;border-top:1px solid #f0f3f1;color:#6b7370!important;text-decoration:none!important;font-size:16px;font-weight:750}.tm-icon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;flex:none;font-size:19px;line-height:1;color:#18231d}.trooth-create-page .tm-icon{background:#6d7072;color:#fff;font-size:24px}.trooth-menu-scroll{overflow:auto;flex:1;padding:12px 12px 22px;-webkit-overflow-scrolling:touch}.trooth-menu-label{font-size:14px;color:#111;font-weight:700;padding:4px 3px 9px}.trooth-shortcuts{display:grid;grid-template-columns:1fr 1fr;gap:8px}.trooth-shortcuts a{display:flex;align-items:center;gap:8px;min-height:62px;padding:9px;border:1px solid #e0e6e2;border-radius:13px;color:#18231d!important;text-decoration:none!important;background:#fff}.trooth-shortcuts a:hover,.trooth-more-links a:hover,.trooth-menu-section-btn:hover,.trooth-menu-section-body a:hover{background:#f0f8f3}.trooth-shortcuts b{font-size:14px;font-weight:750}.trooth-shortcuts .tm-icon{font-size:23px}.trooth-see-more,.trooth-menu-section-btn{width:100%;display:flex;align-items:center;gap:8px;border:0;background:#eef1ef;color:#18231d;padding:11px 10px;border-radius:10px;margin-top:10px;text-align:left;cursor:pointer;font-size:14px}.trooth-see-more b,.trooth-menu-section-btn b{font-weight:800;flex:1}.trooth-more-links{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:5px}.trooth-more-links a,.trooth-menu-section-body a{display:flex;align-items:center;gap:8px;padding:9px 7px;border-radius:9px;color:#18231d!important;text-decoration:none!important;font-size:13px;font-weight:700}.trooth-menu-section{margin-top:8px;border-top:1px solid #e9eeeb;padding-top:2px}.trooth-menu-section-btn{background:#fff;margin-top:4px;padding:12px 7px}.tm-chevron{font-size:20px;color:#68746d}.trooth-menu-section-body{padding:0 3px 4px}.trooth-menu-footer{font-size:10px;color:#8a948f;text-align:center;padding:16px 5px}.trooth-create-title{padding:7px 10px 5px;font-weight:900;color:#14532d;font-size:14px;border-bottom:1px solid #e8f1eb;margin-bottom:4px}
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
      .trooth-nav-row a{flex:0 0 44px!important;width:44px!important;height:36px!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#14532d!important;text-decoration:none!important;font-weight:800;padding:4px!important;border-radius:9px;font-size:20px!important;line-height:1}
      .trooth-nav-row a:hover,.trooth-nav-row a:focus{background:#e5f7eb}.trooth-nav-row a:active{transform:scale(.94)}
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
        .trooth-nav-row a{font-size:20px!important;padding:4px!important;width:42px!important;flex-basis:42px!important}
      }
    `;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',nav,{once:true});else nav();
})();