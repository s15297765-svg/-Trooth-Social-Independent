// Trooth Social Independent — stable three-line navigation
(function(){
  if(window.__troothUnifiedNavV2)return;
  window.__troothUnifiedNavV2=true;
  function nav(){
    if(document.querySelector('.trooth-unified-nav'))return;
    var oldHeader=document.querySelector('body>header');
    var oldNav=document.querySelector('main>nav');
    if(oldHeader)oldHeader.remove();
    if(oldNav)oldNav.remove();

    var wrap=document.createElement('div');
    wrap.className='trooth-unified-nav';
    wrap.innerHTML=`
      <header class="top trooth-topbar" aria-label="Trooth top bar">
        <div class="trooth-toprow">
          <button class="trooth-menu" type="button" aria-label="Menu" aria-expanded="false">☰</button>
          <a class="trooth-top-logo" href="index.html" aria-label="Trooth Social Independent">
            <img class="trooth-logo-3d" src="assets/trooth-logo-3d.svg?v=20260924-3" alt="Trooth Social Independent" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
            <strong>Trooth</strong>
          </a>
          <a class="trooth-icon trooth-plus" href="index.html#postInput" aria-label="Create post">＋</a>
          <button class="trooth-icon trooth-search-trigger" type="button" aria-label="Search">⌕</button>
          <a class="trooth-icon trooth-messenger" href="chat.html" aria-label="Messenger">💬</a>
        </div>
      </header>
      <nav class="trooth-nav-row trooth-nav-secondary" aria-label="Trooth sections">
        <a href="news.html">News</a><a href="sports.html">Sports</a><a href="stores.html">International Stores</a><a href="film-fashion.html">Film/Fashion</a><a href="property.html">Property</a>
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
      }
    });

    var searchBtn=wrap.querySelector('.trooth-search-trigger');
    if(searchBtn)searchBtn.addEventListener('click',function(){
      var input=document.getElementById('search');
      if(input){
        input.classList.toggle('trooth-search-open');
        if(input.classList.contains('trooth-search-open'))input.focus();
      }
    });

    var style=document.createElement('style');
    style.id='trooth-unified-nav-css-v2';
    style.textContent=`
      .trooth-unified-nav{position:sticky;top:0;z-index:1000;background:#fff;box-shadow:0 2px 12px rgba(20,82,56,.12)}
      .trooth-topbar{background:#18a957!important;color:#fff!important;padding:0!important;margin:0!important;position:relative!important;border:0!important}
      .trooth-toprow{min-height:62px;display:flex;align-items:center;gap:8px;padding:7px 10px}
      .trooth-menu,.trooth-icon{width:42px;height:42px;display:flex!important;align-items:center;justify-content:center;font-size:27px;font-weight:900;border:0;background:transparent;color:#fff!important;text-decoration:none!important;cursor:pointer;flex:none}
      .trooth-plus{font-size:31px!important}
      .trooth-messenger{font-size:23px!important}
      .trooth-search-trigger{font-size:28px!important}
      .trooth-top-logo{display:flex;align-items:center;gap:6px;min-width:0;flex:1;color:#fff!important;text-decoration:none!important}
      .trooth-top-logo .trooth-logo-3d{width:205px;max-width:100%;height:auto;filter:grayscale(1) brightness(0) invert(1)}
      .trooth-top-logo strong{display:none;color:#fff;font-size:25px;font-weight:950;letter-spacing:-1px}
      .trooth-nav-row{display:flex;gap:4px;align-items:center;justify-content:center;overflow-x:auto;white-space:nowrap;background:#fff;padding:7px 8px;border-bottom:1px solid #e3eee7}
      .trooth-nav-row a{color:#14532d!important;text-decoration:none!important;font-weight:800;padding:8px 10px;border-radius:9px}
      .trooth-nav-row a:hover,.trooth-nav-row a:focus{background:#e5f7eb}
      @media(max-width:600px){
        .trooth-toprow{min-height:56px;padding:5px 6px;gap:3px}
        .trooth-menu,.trooth-icon{width:38px;height:38px;font-size:23px}
        .trooth-plus{font-size:29px!important}.trooth-search-trigger{font-size:25px!important}.trooth-messenger{font-size:21px!important}
        .trooth-top-logo .trooth-logo-3d{width:150px}
        .trooth-top-logo strong{font-size:22px}
        .trooth-nav-row{justify-content:flex-start;padding:6px 5px}
        .trooth-nav-row a{font-size:12px;padding:7px 8px}
      }
    `;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',nav,{once:true});else nav();
})();