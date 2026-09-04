/* Trooth Social Independent — dynamic content hub */
(function(){
  const tables={
    news_stories:{title:'News Center',icon:'📰'},
    sports_stories:{title:'Sports',icon:'🏆'},
    store_listings:{title:'International Stores',icon:'🛍️'},
    properties:{title:'Property',icon:'🏠'}
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function mount(table){
    const sb=window.troothSupabase, cfg=tables[table];
    if(!sb) return;
    let host=document.querySelector(`[data-trooth-content="${table}"]`);
    if(!host){
      const candidates={news_stories:'#news-center,.news-center',sports_stories:'#sports,.sports',store_listings:'#stores,.stores',properties:'#property,.property'}[table];
      host=candidates&&document.querySelector(candidates);
    }
    if(!host) return;
    sb.from(table).select('*').order('created_at',{ascending:false}).limit(12).then(({data,error})=>{
      if(error){console.warn('Trooth '+table,error);return;}
      if(!data?.length){host.innerHTML='<div class="trooth-empty">'+cfg.icon+' ابھی کوئی مواد موجود نہیں۔</div>';return;}
      host.innerHTML='<div class="trooth-hub-grid">'+data.map(x=>{
        const heading=x.title||x.name||'Trooth';
        const text=x.body||x.description||'';
        const meta=[x.category,x.location,x.price].filter(Boolean).join(' • ');
        const link=x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">View / Visit ↗</a>':'';
        return '<article class="trooth-hub-card"><div class="trooth-hub-icon">'+cfg.icon+'</div><h3>'+esc(heading)+'</h3>'+(meta?'<small>'+esc(meta)+'</small>':'')+(text?'<p>'+esc(text)+'</p>':'')+link+'</article>';
      }).join('')+'</div>';
    });
  }
  function boot(){Object.keys(tables).forEach(mount);}
  if(window.troothSupabase) boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();