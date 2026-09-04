/* Trooth Social Independent — unified Home content hub */
(function(){
  const sources=[
    {table:'posts',title:'Social Feed',icon:'🟢',href:'index.html',kind:'post'},
    {table:'groups',title:'Groups',icon:'👥',href:'groups.html',kind:'group'},
    {table:'news_stories',title:'News',icon:'📰',href:'news.html',kind:'content'},
    {table:'sports_stories',title:'Sports',icon:'🏆',href:'sports.html',kind:'content'},
    {table:'businesses',title:'Business',icon:'💼',href:'business.html',kind:'market'},
    {table:'store_listings',title:'Stores',icon:'🛍️',href:'stores.html',kind:'market'},
    {table:'properties',title:'Property',icon:'🏠',href:'property.html',kind:'market'}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const text=x=>String(x.body||x.description||x.content||x.bio||'').trim();
  function addStyles(){
    if(document.getElementById('trooth-home-content-css'))return;
    const s=document.createElement('style');s.id='trooth-home-content-css';
    s.textContent='.trooth-home-hub{margin:16px 0}.trooth-home-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.trooth-home-head h2{margin:0;font-size:19px}.trooth-home-head a{font-size:12px;font-weight:800;color:#15803d}.trooth-home-tabs{display:flex;gap:7px;overflow:auto;padding-bottom:8px}.trooth-home-tab{border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;border-radius:999px;padding:7px 11px;font-weight:800;white-space:nowrap;cursor:pointer}.trooth-home-tab.active{background:#16a34a;color:#fff}.trooth-home-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.trooth-home-card{border:1px solid #dcfce7;background:#fff;border-radius:13px;padding:12px;min-height:115px}.trooth-home-card h3{margin:5px 0 6px;font-size:15px}.trooth-home-card p{margin:0;color:#64748b;font-size:12px;line-height:1.45}.trooth-home-meta{font-size:11px;color:#15803d;font-weight:800}.trooth-home-empty{color:#64748b;font-size:13px;padding:12px}.trooth-home-refresh{border:0;background:#dcfce7;color:#166534;border-radius:9px;padding:7px 9px;font-weight:800;cursor:pointer}@media(max-width:650px){.trooth-home-grid{grid-template-columns:1fr}}';
    document.head.appendChild(s);
  }
  function ensureHost(){
    let host=document.getElementById('trooth-unified-home-content');if(host)return host;
    const feed=document.getElementById('feed');if(!feed||!feed.parentNode)return null;
    host=document.createElement('div');host.id='trooth-unified-home-content';host.className='card trooth-home-hub';
    host.innerHTML='<div class="trooth-home-head"><h2>🌐 Trooth Live Hub</h2><button class="trooth-home-refresh" type="button">↻ Refresh</button></div><div class="trooth-home-tabs"></div><div class="trooth-home-grid"><div class="trooth-home-empty">Loading Trooth network…</div></div>';
    feed.parentNode.insertBefore(host,feed);
    host.querySelector('.trooth-home-refresh').onclick=()=>render();
    return host;
  }
  let active='all';let timer=0;
  async function querySource(sb,src){
    const q=sb.from(src.table).select('*').order('created_at',{ascending:false}).limit(3);
    const r=await q;return r.error?[]:(r.data||[]).map(x=>({...x,_source:src}));
  }
  async function render(){
    const sb=window.troothSupabase,host=ensureHost();if(!sb||!host)return;
    addStyles();
    const tabs=host.querySelector('.trooth-home-tabs');
    tabs.innerHTML='<button class="trooth-home-tab '+(active==='all'?'active':'')+'" data-k="all">🌐 All</button>'+sources.map((s,i)=>'<button class="trooth-home-tab '+(active===String(i)?'active':'')+'" data-k="'+i+'">'+s.icon+' '+esc(s.title)+'</button>').join('');
    tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{active=b.dataset.k;render()});
    let rows=[];
    if(active==='all'){const chunks=await Promise.all(sources.map(s=>querySource(sb,s)));chunks.forEach(a=>rows.push(...a));rows.sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));rows=rows.slice(0,9)}
    else rows=await querySource(sb,sources[Number(active)]);
    const grid=host.querySelector('.trooth-home-grid');
    if(!rows.length){grid.innerHTML='<div class="trooth-home-empty">ابھی اس حصے میں کوئی نیا مواد موجود نہیں۔</div>';return}
    grid.innerHTML=rows.map(x=>{
      const s=x._source,n=x.title||x.name||x.display_name||(s.kind==='post'?'Social Post':s.title),body=text(x),meta=[x.category,x.location,x.price].filter(Boolean).join(' • ');
      const date=x.created_at?new Date(x.created_at).toLocaleString():'Live';
      return '<article class="trooth-home-card"><div class="trooth-home-meta">'+s.icon+' '+esc(s.title)+' • '+esc(date)+'</div><h3>'+esc(n)+'</h3>'+(meta?'<div class="trooth-home-meta">'+esc(meta)+'</div>':'')+(body?'<p>'+esc(body.slice(0,180))+'</p>':'')+'<div style="margin-top:9px"><a class="trooth-home-meta" href="'+s.href+'">Open '+esc(s.title)+' →</a></div></article>';
    }).join('');
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(render,250)}
  function boot(){ensureHost();render();['trooth-home-live-update','trooth-market-live-update','trooth-content-live-update','trooth-post-update','trooth-story-update','trooth-friends-social-update'].forEach(e=>window.addEventListener(e,schedule));}
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();