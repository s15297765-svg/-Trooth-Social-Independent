// Trooth Social Independent — safe local demo data v2
(function(){
  if(window.__troothDemoDataV2)return;window.__troothDemoDataV2=true;
  window.TroothDemoData={
    enabled:true,
    profiles:[
      {id:'demo-ali',name:'Ali Khan',role:'Creator',bio:'Building and sharing on Trooth 🌿'},
      {id:'demo-sana',name:'Sana Ahmed',role:'Business',bio:'Independent business & community'},
      {id:'demo-hamza',name:'Hamza Malik',role:'News',bio:'Independent voices and local stories'}
    ],
    posts:[
      {id:'demo-post-1',user:'Ali Khan',text:'Welcome to Trooth Social Independent 🌿 A new place for people, business and independent voices.',likes:24,comments:6,shares:3},
      {id:'demo-post-2',user:'Sana Ahmed',text:'Our business community is now ready. Discover, connect and grow together. 💚',likes:17,comments:4,shares:2},
      {id:'demo-post-3',user:'Hamza Malik',text:'Demo News: Trooth is bringing News, Sports, Business, Stores and Property into one connected platform.',likes:31,comments:8,shares:5}
    ],
    stories:[
      {name:'Ali Khan',text:'Welcome!'},
      {name:'Sana Ahmed',text:'Business'},
      {name:'Hamza Malik',text:'News'}
    ],
    sections:[
      {name:'News',href:'news.html',text:'Independent stories'},
      {name:'Sports',href:'sports.html',text:'Live sports stories'},
      {name:'Business',href:'business.html',text:'Business network'},
      {name:'Stores',href:'stores.html',text:'International marketplace'},
      {name:'Property',href:'property.html',text:'Property listings'},
      {name:'Film & Fashion',href:'film-fashion.html',text:'Film, fashion & trends'}
    ]
  };
  function addStyle(){
    if(document.getElementById('trooth-demo-style'))return;
    var s=document.createElement('style');s.id='trooth-demo-style';s.textContent='@media(max-width:700px){#trooth-demo-hub{margin-bottom:12px}.trooth-demo-grid{grid-template-columns:1fr!important}.trooth-demo-actions a{flex:1;text-align:center}}';document.head.appendChild(s);
  }
  function renderIndexDemo(){
    if(location.pathname.split('/').pop().toLowerCase()!=='index.html'&&location.pathname!=='/' )return;
    if(document.getElementById('trooth-demo-hub'))return;
    var feed=document.getElementById('feed');if(!feed||!feed.parentNode)return;
    var h=document.createElement('div');h.id='trooth-demo-hub';h.className='card';
    h.innerHTML='<div class="sectionhead"><h2>🌿 Trooth Demo Testing Hub</h2><span class="muted">Safe sample data</span></div><p class="muted" style="margin-top:0">Use these sample profiles and posts to test navigation without creating real private data.</p><div class="trooth-demo-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'+window.TroothDemoData.profiles.map(function(p){return '<div style="border:1px solid #dfeee5;border-radius:14px;padding:12px;background:#fbfffc"><b>👤 '+p.name+'</b><div class="muted">'+p.role+'</div><p style="font-size:12px;line-height:1.4">'+p.bio+'</p><div class="trooth-demo-actions" style="display:flex;gap:6px"><a class="filelabel" href="profile.html?user='+encodeURIComponent(p.id)+'" style="padding:8px 9px;font-size:11px">Profile</a><a class="filelabel" href="chat.html?user='+encodeURIComponent(p.id)+'" style="padding:8px 9px;font-size:11px">Chat</a></div></div>'}).join('')+'</div><div style="margin-top:12px">'+window.TroothDemoData.posts.map(function(p){return '<div style="border-top:1px solid #e3eee7;padding:11px 0"><b>📝 '+p.user+'</b><div style="font-size:13px;line-height:1.45;margin-top:4px">'+p.text+'</div><span class="muted">👍 '+p.likes+' · 💬 '+p.comments+' · ↗ '+p.shares+'</span></div>'}).join('')+'</div>';
    feed.parentNode.insertBefore(h,feed);
  }
  function inject(){
    addStyle();
    if(!document.getElementById('trooth-demo-banner')){
      var b=document.createElement('div');b.id='trooth-demo-banner';b.innerHTML='<span>🌿 <b>Trooth Demo</b> — safe sample data for testing</span><button type="button" aria-label="Hide demo banner">×</button>';
      b.style.cssText='position:fixed;left:12px;right:12px;bottom:14px;z-index:9999;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 13px;border:1px solid #cfe8da;border-radius:14px;background:#e9f8ef;color:#145238;box-shadow:0 10px 30px rgba(20,82,56,.12);font:600 13px system-ui,sans-serif';
      b.querySelector('button').style.cssText='border:0;background:transparent;color:#145238;font-size:20px;line-height:1;cursor:pointer';
      b.querySelector('button').onclick=function(){b.remove()};document.body.appendChild(b);
    }
    renderIndexDemo();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
