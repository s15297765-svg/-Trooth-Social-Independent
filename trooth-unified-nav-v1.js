// Trooth Social Independent — unified three-line navigation
(function(){
  if(window.__troothUnifiedNavV1)return;
  window.__troothUnifiedNavV1=true;
  function nav(){
    if(document.querySelector('.trooth-topbar'))return;
    var oldHeader=document.querySelector('body>header');
    var oldNav=document.querySelector('main>nav');
    if(oldHeader)oldHeader.remove();
    if(oldNav)oldNav.remove();
    var wrap=document.createElement('div');
    wrap.className='trooth-unified-nav';
    wrap.innerHTML=`
      <header class="top trooth-topbar" aria-label="Trooth top bar">
        <div class="trooth-toprow">
          <a class="trooth-menu" href="index.html" aria-label="Menu">☰</a>
          <a class="logo trooth-top-logo" href="index.html" aria-label="Trooth home"><img class="trooth-logo-3d" src="assets/trooth-logo-3d.svg?v=20260924-1" alt="Trooth"></a>
          <a class="trooth-icon" href="index.html#postInput" aria-label="Create post">＋</a>
          <button class="trooth-icon trooth-search-trigger" type="button" aria-label="Search">⌕</button>
          <a class="trooth-icon" href="chat.html" aria-label="Messenger">✉</a>
        </div>
      </header>
      <nav class="trooth-nav-row trooth-nav-secondary" aria-label="Trooth sections">
        <a href="news.html">News</a><a href="sports.html">Sports</a><a href="stores.html">International Stores</a><a href="film-fashion.html">Film/Fashion</a><a href="property.html">Property</a>
      </nav>
      <nav class="trooth-nav-row trooth-nav-tertiary" aria-label="Trooth social navigation">
        <a href="index.html">Home</a><a href="friends.html">Friends</a><a href="index.html#feed">Videos</a><a href="dashboard.html">Dashboard</a><a href="notifications.html">Notifications</a><a href="profile.html">Profile</a>
      </nav>`;
    document.body.insertBefore(wrap,document.body.firstChild);
    var searchBtn=wrap.querySelector('.trooth-search-trigger');\n    if(searchBtn)searchBtn.addEventListener('click',function(){\n      var input=document.getElementById('search');\n      if(input){input.classList.toggle('trooth-search-open');input.focus();input.scrollIntoView({block:'nearest'});return;}\n      location.href='index.html#feed';\n    });\n    var style=document.createElement('style');
    style.id='trooth-unified-nav-css';
    style.textContent=`
      .trooth-unified-nav{position:sticky;top:0;z-index:1000;background:#fff;box-shadow:0 2px 12px rgba(20,82,56,.12)}
      .trooth-topbar{background:#18a957!important;color:#fff!important;padding:0!important;margin:0!important;position:relative!important}
      .trooth-toprow{min-height:62px;display:flex;align-items:center;gap:10px;padding:7px 12px}
      .trooth-toprow a{color:#fff!important;text-decoration:none!important}
      .trooth-menu,.trooth-icon{width:42px;height:42px;display:flex!important;align-items:center;justify-content:center;font-size:27px;font-weight:900;border:0;background:transparent;cursor:pointer}
      .trooth-icon{font-size:29px}
      .trooth-top-logo{display:flex;align-items:center;min-width:0;flex:1}
      .trooth-top-logo .trooth-logo-3d{width:205px;max-width:100%;height:auto;filter:grayscale(1) brightness(0) invert(1)}
      .trooth-nav-row{display:flex;gap:4px;align-items:center;justify-content:center;overflow-x:auto;white-space:nowrap;background:#fff;padding:7px 8px;border-bottom:1px solid #e3eee7}
      .trooth-nav-row a{color:#14532d!important;text-decoration:none!important;font-weight:800;padding:8px 10px;border-radius:9px}
      .trooth-nav-row a:hover,.trooth-nav-row a:focus{background:#e5f7eb}
      @media(max-width:600px){.trooth-toprow{min-height:56px;padding:5px 7px;gap:3px}.trooth-menu,.trooth-icon{width:37px;height:37px;font-size:23px}.trooth-top-logo .trooth-logo-3d{width:155px}.trooth-nav-row{justify-content:flex-start;padding:6px 5px}.trooth-nav-row a{font-size:12px;padding:7px 8px}}
    `;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',nav,{once:true});else nav();
})();