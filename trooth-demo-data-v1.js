// Trooth Social Independent — safe local demo data v1
(function(){
  if(window.__troothDemoDataV1)return;window.__troothDemoDataV1=true;
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
  function inject(){
    if(document.getElementById('trooth-demo-banner'))return;
    var b=document.createElement('div');b.id='trooth-demo-banner';b.innerHTML='<span>🌿 <b>Trooth Demo</b> — safe sample data for testing</span><button type="button" aria-label="Hide demo banner">×</button>';
    b.style.cssText='position:fixed;left:12px;right:12px;bottom:14px;z-index:9999;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 13px;border:1px solid #cfe8da;border-radius:14px;background:#e9f8ef;color:#145238;box-shadow:0 10px 30px rgba(20,82,56,.12);font:600 13px system-ui,sans-serif';
    b.querySelector('button').style.cssText='border:0;background:transparent;color:#145238;font-size:20px;line-height:1;cursor:pointer';
    b.querySelector('button').onclick=function(){b.remove()};document.body.appendChild(b);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
