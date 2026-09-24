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
          <button class="trooth-icon trooth-plus" type="button" aria-label="Create" aria-expanded="false">＋</button>
          <button class="trooth-icon trooth-search-trigger" type="button" aria-label="Search">⌕</button>
          <a class="trooth-icon trooth-messenger" href="chat.html" aria-label="Messenger">💬</a>
        </div>
      </header>
      <nav class="trooth-nav-row trooth-nav-secondary" aria-label="Trooth sections">
        <a href="news.html">News</a><a href="sports.html">Sports</a><a href="stores.html">International Stores</a><a href="film-fashion.html">Film/Fashion</a><a href="property.html">Property</a>
      </nav>
      <nav class="trooth-nav-row trooth-nav-tertiary" aria-label="Trooth social navigation">
        <a href="index.html">Home</a><a href="friends.html">Friends</a><a href="reels.html">Videos</a><a href="dashboard.html">Dashboard</a><a href="notifications-messages.html">Notifications</a><a href="profile.html">Profile</a>
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

    var plusBtn=wrap.querySelector('.trooth-plus');
    if(plusBtn){
      var createMenu=document.createElement('div');
      createMenu.className='trooth-create-menu';
      createMenu.innerHTML='<div class="trooth-create-title">Create</div><a href="index.html#postInput" data-create="post">📝 Post</a><a href="index.html#story" data-create="story">⭕ Story</a><a href="reels.html" data-create="reel">🎞️ Reel</a><a href="index.html#live" data-create="live">🔴 Live Video</a><a href="index.html#note" data-create="note">📒 Note</a>';
      wrap.querySelector('.trooth-toprow').appendChild(createMenu);
      plusBtn.addEventListener('click',function(){
        var open=createMenu.classList.toggle('open');
        plusBtn.setAttribute('aria-expanded',open?'true':'false');
      });
      createMenu.addEventListener('click',function(e){
        var a=e.target.closest('a[data-create]');
        if(!a)return;
        var type=a.getAttribute('data-create');
        if(type==='post' || type==='story' || type==='live' || type==='note'){
          var isIndex=/index\\.html$/i.test(location.pathname)||location.pathname==='/'||location.pathname.endsWith('/');
          if(!isIndex)return;
          e.preventDefault();
          createMenu.classList.remove('open');
          plusBtn.setAttribute('aria-expanded','false');
          if(type==='post'){
            var p=document.getElementById('postInput');
            if(p){p.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){p.focus()},250);}
          }else if(type==='story'){
            var s=document.getElementById('storyInput');
            if(s){s.click();}else{location.hash='story';}
          }else if(type==='note'){
            var n=prompt('اپنا Note لکھیں:');
            if(!n||!n.trim())return;
            var sb=window.troothSupabase;
            if(!sb){alert('Trooth connection is not ready.');return;}
            sb.auth.getUser().then(function(r){
              var u=r.data&&r.data.user;
              if(!u){location.href='auth.html';return;}
              return sb.from('posts').insert({user_id:u.id,body:'📒 Note\\n\\n'+n.trim(),media_url:null,media_type:null});
            }).then(function(r){
              if(r&&r.error)throw r.error;
              var feed=document.getElementById('feed');
              if(feed)feed.scrollIntoView({behavior:'smooth',block:'start'});
            }).catch(function(err){alert('Note save failed: '+(err.message||'Please try again.'))});
          }else if(type==='live'){
            alert('🔴 Live Video setup: camera/microphone access will be connected here. The current project does not yet have a live-stream backend, so I am not pretending this is already live.');
          }
        }
      });
      document.addEventListener('click',function(e){
        if(!wrap.contains(e.target)){createMenu.classList.remove('open');plusBtn.setAttribute('aria-expanded','false');}
      });
    }

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
      .trooth-plus{font-size:31px!important;position:relative}
      .trooth-create-menu{display:none;position:absolute;top:58px;right:74px;width:190px;background:#fff;border:1px solid #dcebe2;border-radius:14px;box-shadow:0 10px 28px rgba(20,82,56,.18);padding:7px;z-index:1100}
      .trooth-create-menu.open{display:block}
      .trooth-create-title{padding:7px 10px 5px;font-weight:900;color:#14532d;font-size:14px;border-bottom:1px solid #e8f1eb;margin-bottom:4px}
      .trooth-create-menu a{display:block!important;color:#14532d!important;text-decoration:none!important;font-weight:800;padding:10px;border-radius:9px;font-size:14px}
      .trooth-create-menu a:hover{background:#e5f7eb}
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