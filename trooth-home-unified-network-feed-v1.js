// Trooth Social Independent — unified Home Network Feed v1
(function(){
  if(window.__troothHomeUnifiedNetworkFeed)return;window.__troothHomeUnifiedNetworkFeed=true;
  const ready=()=>window.troothSupabase?Promise.resolve(window.troothSupabase):new Promise(r=>window.addEventListener('trooth-supabase-ready',()=>r(window.troothSupabase),{once:true}));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const cfg=[
    ['news_stories','news','📰 News','news.html'],
    ['sports_stories','sports','🏆 Sports','sports.html'],
    ['store_listings','stores','🛍️ Stores','stores.html'],
    ['properties','property','🏠 Property','property.html'],
    ['film_fashion_stories','film_fashion','🎬 Film & Fashion','film-fashion.html']
  ];
  function mount(){
    if(document.getElementById('troothUnifiedNetworkFeed'))return document.getElementById('troothUnifiedNetworkFeed');
    const feed=document.getElementById('feed');if(!feed)return null;
    const card=document.createElement('section');card.className='card';card.id='troothUnifiedNetworkFeed';
    card.innerHTML='<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><span class="tag">TROOTH NETWORK</span><h2 style="margin:7px 0 3px">🌍 Unified Network Feed</h2><p class="muted" style="margin:0">News, Sports, Stores, Property, Film & Fashion — all in one live stream.</p></div><button id="troothUnifiedRefresh" class="btn" type="button">↻ Refresh</button></div><div id="troothUnifiedItems" class="hubgrid" style="margin-top:14px"></div>';
    feed.parentNode.insertBefore(card,feed.nextSibling);return card;
  }
  async function load(sb){
    const card=mount();if(!card)return;const box=document.getElementById('troothUnifiedItems');
    const results=await Promise.all(cfg.map(async c=>{const r=await sb.from(c[0]).select('*').order('created_at',{ascending:false}).limit(4);return {cfg:c,rows:r.error?[]:(r.data||[])};}));
    const items=[];results.forEach(x=>x.rows.forEach(row=>items.push({cfg:x.cfg,row})));
    items.sort((a,b)=>new Date(b.row.created_at||0)-new Date(a.row.created_at||0));
    const top=items.slice(0,15);
    box.innerHTML=top.length?top.map(x=>{const r=x.row,c=x.cfg,title=clean(r.title||r.name||'Trooth Update'),body=clean(r.body||r.description||r.location||'');return '<article class="hubitem" data-content-type="'+esc(c[1])+'" data-content-id="'+esc(r.id)+'"><span class="tag">'+esc(r.category||c[2])+'</span><h3>'+esc(title)+'</h3><p>'+esc(body.slice(0,150))+(body.length>150?'…':'')+'</p><small class="muted">'+(r.created_at?esc(new Date(r.created_at).toLocaleString()):'')+'</small><div style="margin-top:10px"><a class="btn" href="'+c[3]+'">Open '+esc(c[2])+' →</a></div></article>';}).join(''):'<div class="hubitem">ابھی کوئی نیا network content موجود نہیں۔</div>';
  }
  async function boot(){const sb=await ready();if(!document.getElementById('feed'))return;const card=mount();if(!card)return;document.getElementById('troothUnifiedRefresh').onclick=()=>load(sb);await load(sb);
    const channel=sb.channel('trooth-home-unified-network-live');cfg.forEach(c=>channel.on('postgres_changes',{event:'*',schema:'public',table:c[0]},()=>load(sb)));channel.subscribe();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
