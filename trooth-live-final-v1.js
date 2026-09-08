// Trooth Social Independent — persistent visible live layer v5
(function(){
  'use strict';
  if(window.__troothLiveFinalV5)return; window.__troothLiveFinalV5=true;
  var KEY='trooth_live_posts_v5';
  var seed=[
    {id:'welcome',name:'Trooth Social',text:'Welcome to Trooth Social Independent 🌿 — connect, share, discover and build your network.',time:'Just now',likes:12,comments:3,shares:2},
    {id:'photo-demo',name:'Trooth Gallery',text:'Temporary photo demo — checking image quality, cards and mobile presentation.',time:'Demo',likes:18,comments:4,shares:3,media:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',mediaType:'image'},
    {id:'video-demo',name:'Trooth Video',text:'Temporary video demo — checking playback, sizing and feed experience.',time:'Demo',likes:21,comments:5,shares:4,media:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',mediaType:'video'},
    {id:'audio-demo',name:'Trooth Music',text:'Temporary audio demo — checking the audio player and feed layout.',time:'Demo',likes:9,comments:2,shares:2,media:'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',mediaType:'audio'}
  ];
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function getPosts(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)&&x.length?x:seed.slice()}catch(e){return seed.slice()}}
  function savePosts(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
  function mediaHtml(p){
    if(!p.media)return '';
    if(p.mediaType==='video')return '<div class="trooth-demo-media"><video controls preload="metadata" playsinline src="'+esc(p.media)+'"></video><small>🎬 Temporary demo video</small></div>';
    if(p.mediaType==='audio')return '<div class="trooth-demo-media trooth-audio"><audio controls preload="metadata" src="'+esc(p.media)+'"></audio><small>🎵 Temporary demo audio</small></div>';
    return '<div class="trooth-demo-media"><img loading="lazy" src="'+esc(p.media)+'" alt="Trooth temporary demo image"></div>';
  }
  function postHtml(p){return '<article class="card post trooth-live-post" data-post-id="'+esc(p.id)+'"><div class="posthead"><div class="smavatar">'+esc((p.name||'T').charAt(0).toUpperCase())+'</div><div><b>'+esc(p.name)+'</b><div class="muted">'+esc(p.time||'Now')+'</div></div></div><div class="postbody">'+esc(p.text)+'</div>'+mediaHtml(p)+'<div class="postactions"><button class="action" data-act="like">👍 Like <span>'+Number(p.likes||0)+'</span></button><button class="action" data-act="comment">💬 Comment <span>'+Number(p.comments||0)+'</span></button><button class="action" data-act="share">↗ Share <span>'+Number(p.shares||0)+'</span></button><button class="action" data-act="save">🔖 Save</button></div></article>'}
  function renderInto(target){if(!target)return;target.innerHTML=getPosts().map(postHtml).join('')}
  function localAction(id,act){var posts=getPosts(),p=posts.find(function(x){return x.id===id});if(!p)return;if(act==='like')p.likes=(p.likes||0)+1;if(act==='comment')p.comments=(p.comments||0)+1;if(act==='share')p.shares=(p.shares||0)+1;savePosts(posts);renderInto(document.getElementById('trooth-demo-feed'))}
  function installVisual(){
    var style=document.createElement('style');style.id='trooth-reference-v5-style';style.textContent=':root{--g:#78d6a5!important;--g2:#2d9b69!important;--deep:#145238!important;--p:#e7faef!important}body{background:linear-gradient(180deg,#effcf4 0%,#f7fcf8 38%,#edf8f1 100%)!important}.top{background:linear-gradient(90deg,#5fc894,#78d6a5)!important;min-height:64px!important}.layout{max-width:1240px!important;gap:16px!important;padding-top:16px!important}.menu,.card{border-radius:18px!important}.hero{background:linear-gradient(135deg,#c9f1d9 0%,#fafffc 54%,#dff7e8 100%)!important;border:1px solid #b8e5ca!important;box-shadow:0 12px 30px rgba(39,132,91,.10)!important}.hero h1{font-size:30px!important}.chip{border-color:#bfe5ce!important}.action{background:#f0faf4!important}.trooth-live-banner{display:flex;align-items:center;gap:10px;margin:0 0 14px;padding:12px 15px;border-radius:16px;background:#fff;border:1px solid #cbead7;box-shadow:0 6px 20px rgba(39,132,91,.07);font-weight:850;color:#246747}.trooth-live-banner i{width:10px;height:10px;border-radius:50%;background:#2d9b69;box-shadow:0 0 0 5px #e0f7e9}.trooth-demo-title{margin:12px 0 10px;padding:13px 15px;border-radius:15px;background:linear-gradient(90deg,#145238,#2d9b69);color:#fff;font-weight:900;letter-spacing:.2px}.trooth-demo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:16px}.trooth-demo-grid .trooth-live-post{margin:0}.trooth-demo-feed{display:contents}.trooth-live-badge{position:fixed;right:12px;bottom:76px;z-index:200;background:#145238;color:#fff;border:2px solid #dff7e8;border-radius:999px;padding:7px 11px;font:800 11px system-ui;box-shadow:0 6px 18px rgba(20,82,56,.18)}.trooth-demo-media{margin:12px 0 2px;border-radius:16px;overflow:hidden;background:#e8f7ee;border:1px solid #c7ead5}.trooth-demo-media img,.trooth-demo-media video{display:block;width:100%;max-height:360px;object-fit:cover}.trooth-demo-media audio{display:block;width:100%;padding:14px;box-sizing:border-box}.trooth-demo-media small{display:block;padding:7px 12px;color:#39745a;font-weight:700;background:#f5fcf7}.trooth-demo-label{font-size:11px;color:#39745a;font-weight:800;margin-top:8px}@media(min-width:701px){.trooth-live-badge{bottom:16px}}@media(max-width:700px){.top{min-height:58px!important}.hero h1{font-size:23px!important}.layout{padding:8px 8px 12px!important}.trooth-live-banner{font-size:12px;padding:10px 12px}.trooth-demo-grid{grid-template-columns:1fr}.trooth-demo-media img,.trooth-demo-media video{max-height:330px}.card{box-shadow:0 5px 18px rgba(30,90,55,.06)!important}}';document.head.appendChild(style);
    var main=document.querySelector('main.layout section');if(!main)return;
    if(!document.getElementById('trooth-live-banner')){var b=document.createElement('div');b.id='trooth-live-banner';b.className='trooth-live-banner';b.innerHTML='<i></i><span>Trooth is live — connect, share, discover & build your network</span>';var hero=main.querySelector('.hero');if(hero)hero.parentNode.insertBefore(b,hero);else main.insertBefore(b,main.firstChild)}
    if(!document.getElementById('trooth-live-badge')){var badge=document.createElement('div');badge.id='trooth-live-badge';badge.className='trooth-live-badge';badge.textContent='● Trooth Live';document.body.appendChild(badge)}
  }
  function buildShowcase(){
    var main=document.querySelector('main.layout section');if(!main||document.getElementById('trooth-multimedia-showcase'))return;
    var composer=document.getElementById('postInput');var composerCard=composer&&composer.closest('.card');var feed=document.getElementById('feed');
    var host=document.createElement('section');host.id='trooth-multimedia-showcase';host.innerHTML='<div class="trooth-demo-title">🌿 TROOTH MULTIMEDIA LIVE DEMO <span class="trooth-demo-label">PHOTO • VIDEO • AUDIO • SOCIAL</span></div><div id="trooth-demo-feed" class="trooth-demo-grid"></div>';
    if(composerCard&&composerCard.parentNode)composerCard.parentNode.insertBefore(host,feed||null);else main.insertBefore(host,main.firstChild);
    renderInto(document.getElementById('trooth-demo-feed'));
    host.addEventListener('click',function(e){var b=e.target.closest('button[data-act]');if(!b)return;var card=b.closest('[data-post-id]');if(card)localAction(card.getAttribute('data-post-id'),b.getAttribute('data-act'))});
  }
  function init(){installVisual();buildShowcase();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,250)});else setTimeout(init,250);
  setTimeout(buildShowcase,1200);setTimeout(buildShowcase,2500);
})();
