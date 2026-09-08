// Trooth Social Independent — visible reference-style live layer v2
(function(){
  'use strict';
  if(window.__troothLiveFinalV2)return; window.__troothLiveFinalV2=true;
  var KEY='trooth_live_posts_v2';
  var seed=[
    {id:'welcome',name:'Trooth Social',text:'Welcome to Trooth Social Independent 🌿 — connect, share, discover and build your network.',time:'Just now',likes:12,comments:3,shares:2},
    {id:'news',name:'Trooth News',text:'News, Sports, Business, Stores, Property, Film & Fashion — all together in one independent network.',time:'Today',likes:8,comments:2,shares:1}
  ];
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function getPosts(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?x:seed.slice()}catch(e){return seed.slice()}}
  function savePosts(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
  function render(){
    var feed=document.getElementById('feed'); if(!feed)return;
    var posts=getPosts();
    feed.innerHTML=posts.length?posts.map(function(p){return '<article class="card post trooth-live-post" data-post-id="'+esc(p.id)+'"><div class="posthead"><div class="smavatar">'+esc((p.name||'T').charAt(0).toUpperCase())+'</div><div><b>'+esc(p.name)+'</b><div class="muted">'+esc(p.time||'Now')+'</div></div></div><div class="postbody">'+esc(p.text)+'</div><div class="postactions"><button class="action" data-act="like">👍 Like <span>'+Number(p.likes||0)+'</span></button><button class="action" data-act="comment">💬 Comment <span>'+Number(p.comments||0)+'</span></button><button class="action" data-act="share">↗ Share <span>'+Number(p.shares||0)+'</span></button><button class="action" data-act="save">🔖 Save</button></div></article>'}).join(''):'<div class="card empty">No posts yet. Be the first to share on Trooth.</div>';
  }
  function localAction(id,act){var posts=getPosts(),p=posts.find(function(x){return x.id===id});if(!p)return;if(act==='like')p.likes=(p.likes||0)+1;if(act==='comment')p.comments=(p.comments||0)+1;if(act==='share')p.shares=(p.shares||0)+1;savePosts(posts);render()}
  function publishFallback(){var input=document.getElementById('postInput');if(!input||!input.value.trim())return;var posts=getPosts();posts.unshift({id:'local-'+Date.now(),name:'You',text:input.value.trim(),time:'Just now',likes:0,comments:0,shares:0});savePosts(posts);input.value='';render();var st=document.getElementById('uploadStatus');if(st)st.textContent='Posted on Trooth ✓'}
  function installVisual(){
    var style=document.createElement('style');style.id='trooth-reference-v2-style';style.textContent=':root{--g:#78d6a5!important;--g2:#2d9b69!important;--deep:#145238!important;--p:#e7faef!important}body{background:linear-gradient(180deg,#effcf4 0%,#f7fcf8 38%,#edf8f1 100%)!important}.top{background:linear-gradient(90deg,#5fc894,#78d6a5)!important;min-height:64px!important}.logo{font-weight:950!important;text-shadow:0 1px 0 rgba(0,0,0,.08)}.layout{max-width:1240px!important;gap:16px!important;padding-top:16px!important}.menu,.card{border-radius:18px!important}.hero{background:linear-gradient(135deg,#c9f1d9 0%,#fafffc 54%,#dff7e8 100%)!important;border:1px solid #b8e5ca!important;box-shadow:0 12px 30px rgba(39,132,91,.10)!important}.hero h1{font-size:30px!important}.chip{border-color:#bfe5ce!important}.composer .postinput{background:#fff!important}.action{background:#f0faf4!important}.trooth-live-banner{display:flex;align-items:center;gap:10px;margin:0 0 14px;padding:12px 15px;border-radius:16px;background:#fff;border:1px solid #cbead7;box-shadow:0 6px 20px rgba(39,132,91,.07);font-weight:850;color:#246747}.trooth-live-banner i{width:10px;height:10px;border-radius:50%;background:#2d9b69;box-shadow:0 0 0 5px #e0f7e9}.trooth-live-badge{position:fixed;right:12px;bottom:76px;z-index:200;background:#145238;color:#fff;border:2px solid #dff7e8;border-radius:999px;padding:7px 11px;font:800 11px system-ui;box-shadow:0 6px 18px rgba(20,82,56,.18)}@media(min-width:701px){.trooth-live-badge{bottom:16px}}@media(max-width:700px){.top{min-height:58px!important}.hero h1{font-size:23px!important}.layout{padding:8px 8px 12px!important}.trooth-live-banner{font-size:12px;padding:10px 12px}.card{box-shadow:0 5px 18px rgba(30,90,55,.06)!important}}';document.head.appendChild(style);
    var main=document.querySelector('main.layout section');
    if(main&&!document.getElementById('trooth-live-banner')){var b=document.createElement('div');b.id='trooth-live-banner';b.className='trooth-live-banner';b.innerHTML='<i></i><span>Trooth is live — connect, share, discover & build your network</span>';var hero=main.querySelector('.hero');if(hero)hero.parentNode.insertBefore(b,hero);else main.insertBefore(b,main.firstChild)}
    if(!document.getElementById('trooth-live-badge')){var badge=document.createElement('div');badge.id='trooth-live-badge';badge.className='trooth-live-badge';badge.textContent='● Trooth Live';document.body.appendChild(badge)}
  }
  function init(){
    installVisual();
    var feed=document.getElementById('feed');if(!feed)return;
    setTimeout(function(){if(/Loading your Trooth feed/i.test(feed.textContent||''))render()},900);
    setTimeout(function(){if(!feed.querySelector('.post'))render()},3000);
    feed.addEventListener('click',function(e){var b=e.target.closest('button[data-act]');if(!b)return;var card=b.closest('[data-post-id]');if(!card)return;localAction(card.getAttribute('data-post-id'),b.getAttribute('data-act'))});
    window.addEventListener('trooth-supabase-error',function(){render()});
    var post=document.querySelector('[onclick="publishPost()"]');if(post)post.addEventListener('click',function(){setTimeout(function(){if(!feed.querySelector('.post'))publishFallback()},700)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
