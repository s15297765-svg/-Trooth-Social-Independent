/* Trooth Social Independent — dynamic content hub */
(function(){
  const tables={
    news_stories:{title:'News Center',icon:'📰'},
    sports_stories:{title:'Sports',icon:'🏆'},
    store_listings:{title:'International Stores',icon:'🛍️'},
    properties:{title:'Property',icon:'🏠'},
    film_fashion_stories:{title:'Film & Fashion',icon:'🎬👗'}
  };
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const selectors={news_stories:'#news-center,.news-center',sports_stories:'#sports,.sports',store_listings:'#stores,.stores',properties:'#property,.property',film_fashion_stories:'#film-fashion,.film-fashion'};
  let pending={};
  let mounted=false;
  let stopped=false;

  function mount(table){
    if(stopped)return;
    const sb=window.troothSupabase,cfg=tables[table];
    if(!sb||!cfg)return;
    let host=document.querySelector(`[data-trooth-content="${table}"]`);
    if(!host){const candidates=selectors[table];host=candidates&&document.querySelector(candidates);}
    if(!host)return;
    sb.from(table).select('*').order('created_at',{ascending:false}).limit(12).then(({data,error})=>{
      if(stopped)return;
      if(error){console.warn('Trooth '+table,error);return;}
      if(!data?.length){host.innerHTML='<div class="trooth-empty">'+cfg.icon+' ابھی کوئی مواد موجود نہیں۔</div>';return;}
      host.innerHTML='<div class="trooth-hub-grid">'+data.map(x=>{
        const heading=x.title||x.name||'Trooth';
        const text=x.body||x.description||x.content||'';
        const meta=[x.category,x.location,x.price].filter(Boolean).join(' • ');
        const link=x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">View / Visit ↗</a>':'';
        return '<article class="trooth-hub-card"><div class="trooth-hub-icon">'+cfg.icon+'</div><h3>'+esc(heading)+'</h3>'+(meta?'<small>'+esc(meta)+'</small>':'')+(text?'<p>'+esc(text)+'</p>':'')+link+'</article>';
      }).join('')+'</div>';
    });
  }
  function refresh(table){
    if(stopped||!tables[table])return;
    clearTimeout(pending[table]);
    pending[table]=setTimeout(()=>{pending[table]=null;mount(table)},120);
  }
  function stop(){
    stopped=true;
    Object.keys(pending).forEach(k=>{clearTimeout(pending[k]);pending[k]=null;});
  }
  function boot(){
    if(mounted)return;
    mounted=true;stopped=false;
    Object.keys(tables).forEach(mount);
    Object.keys(tables).forEach(table=>{
      const eventName={news_stories:'trooth-news-refresh',sports_stories:'trooth-sports-refresh',store_listings:'trooth-stores-refresh',properties:'trooth-property-refresh',film_fashion_stories:'trooth-film-fashion-refresh'}[table];
      if(eventName)window.addEventListener(eventName,()=>refresh(table));
    });
    window.addEventListener('trooth-content-hubs-refresh',e=>{if(e.detail?.table)refresh(e.detail.table);});
    window.addEventListener('trooth-content-hub-interaction-refresh',e=>{if(e.detail?.table)refresh(e.detail.table);});
    window.addEventListener('trooth-content-hub-stop',stop,{once:true});
    window.addEventListener('beforeunload',stop,{once:true});
    window.troothMountContentHub=mount;
    window.dispatchEvent(new CustomEvent('trooth-content-hub-ready'));
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();