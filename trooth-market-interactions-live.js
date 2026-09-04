/* Trooth Social Independent — marketplace interactions live bridge */
(function(){
  const types={businesses:'business',store_listings:'stores',properties:'property'};
  function boot(){
    const sb=window.troothSupabase;if(!sb)return;
    const refresh=()=>{
      window.dispatchEvent(new CustomEvent('trooth-market-interaction-update'));
      if(typeof window.refreshTroothFeed==='function')setTimeout(()=>window.refreshTroothFeed(),250);
    };
    Object.keys(types).forEach(table=>{
      sb.channel('trooth-market-interactions-'+table)
        .on('postgres_changes',{event:'*',schema:'public',table},p=>{
          window.dispatchEvent(new CustomEvent('trooth-market-live-update',{detail:{type:types[table],table,payload:p}}));
          refresh();
          if(p.eventType==='INSERT'){
            const names={business:'🏢 نئی Business Listing',stores:'🛍️ نئی Store Listing',property:'🏠 نئی Property Listing'};
            let el=document.getElementById('trooth-market-alert');
            if(!el){el=document.createElement('div');el.id='trooth-market-alert';el.style='position:fixed;top:166px;right:14px;z-index:10000;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:10px 14px;box-shadow:0 8px 24px #0002;font:700 13px system-ui;color:#166534;cursor:pointer';document.body.appendChild(el)}
            el.textContent=names[types[table]]||'🟢 Marketplace Update';el.onclick=()=>{const pth=types[table]==='business'?'business.html':types[table]==='stores'?'stores.html':'property.html';location.href=pth};clearTimeout(el._t);el._t=setTimeout(()=>el.remove(),8000);
          }
        }).subscribe();
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();