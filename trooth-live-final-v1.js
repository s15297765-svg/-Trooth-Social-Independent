// Trooth Social Independent — stable live home fallback v1
(function(){
  'use strict';
  if(window.__troothLiveFinalV1)return; window.__troothLiveFinalV1=true;
  var KEY='trooth_live_posts_v1';
  var seed=[
    {id:'welcome',name:'Trooth Social',text:'Welcome to Trooth Social Independent 🌿 — connect, share, discover and build your network.',time:'Just now',likes:12,comments:3,shares:2},
    {id:'news',name:'Trooth News',text:'News, Sports, Business, Stores, Property, Film & Fashion — everything is coming together in one independent network.',time:'Today',likes:8,comments:2,shares:1}
  ];
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function getPosts(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?x:seed.slice()}catch(e){return seed.slice()}}
  function savePosts(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
  function render(){
    var feed=document.getElementById('feed'); if(!feed)return;
    var posts=getPosts();
    if(!posts.length){feed.innerHTML='<div class="card empty">No posts yet. Be the first to share on Trooth.</div>';return}
    feed.innerHTML=posts.map(function(p){return '<article class="card post" data-post-id="'+esc(p.id)+'"><div class="posthead"><div class="smavatar">'+esc((p.name||'T').charAt(0).toUpperCase())+'</div><div><b>'+esc(p.name)+'</b><div class="muted">'+esc(p.time||'Now')+'</div></div></div><div class="postbody">'+esc(p.text)+'</div><div class="postactions"><button class="action" data-act="like">👍 Like <span>'+Number(p.likes||0)+'</span></button><button class="action" data-act="comment">💬 Comment <span>'+Number(p.comments||0)+'</span></button><button class="action" data-act="share">↗ Share <span>'+Number(p.shares||0)+'</span></button><button class="action" data-act="save">🔖 Save</button></div></article>'}).join('');
  }
  function localAction(id,act){var posts=getPosts(),p=posts.find(function(x){return x.id===id});if(!p)return;if(act==='like')p.likes=(p.likes||0)+1;if(act==='comment')p.comments=(p.comments||0)+1;if(act==='share')p.shares=(p.shares||0)+1;savePosts(posts);render()}
  function publish(){
    var input=document.getElementById('postInput'); if(!input||!input.value.trim())return;
    var posts=getPosts(); posts.unshift({id:'local-'+Date.now(),name:'You',text:input.value.trim(),time:'Just now',likes:0,comments:0,shares:0});savePosts(posts);input.value='';render();
    var st=document.getElementById('uploadStatus');if(st)st.textContent='Posted on Trooth ✓';
  }
  function fallback(){var feed=document.getElementById('feed');if(!feed)return;var txt=(feed.textContent||'').trim();if(!txt||/Loading your Trooth feed/i.test(txt)){render();}}
  function init(){
    var feed=document.getElementById('feed');if(!feed)return;
    setTimeout(fallback,1200);setTimeout(fallback,3500);
    feed.addEventListener('click',function(e){var b=e.target.closest('button[data-act]');if(!b)return;var card=b.closest('[data-post-id]');if(!card)return;localAction(card.getAttribute('data-post-id'),b.getAttribute('data-act'))});
    var post=document.querySelector('[onclick="publishPost()"]');if(post){post.addEventListener('click',function(){setTimeout(function(){if(/Loading your Trooth feed/i.test((feed.textContent||'')))publish()},400)})}
    window.addEventListener('trooth-supabase-error',fallback);
    var style=document.createElement('style');style.textContent='.trooth-live-badge{position:fixed;right:12px;bottom:76px;z-index:90;background:#145238;color:#fff;border:2px solid #dff7e8;border-radius:999px;padding:7px 11px;font:800 11px system-ui;box-shadow:0 6px 18px rgba(20,82,56,.18)}@media(min-width:701px){.trooth-live-badge{bottom:16px}}';document.head.appendChild(style);
    var badge=document.createElement('div');badge.className='trooth-live-badge';badge.textContent='● Trooth Live';document.body.appendChild(badge);
    if(!document.getElementById('trooth-live-status')){var s=document.createElement('span');s.id='trooth-live-status';s.style.display='none';s.textContent='Trooth live layer active';document.body.appendChild(s)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();