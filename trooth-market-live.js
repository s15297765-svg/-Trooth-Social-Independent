/* Trooth Social Independent — live Business / Stores / Property marketplace bridge */
(function(){
  const map={
    businesses:{label:'🟢 نئی Business Listing',page:'business.html'},
    store_listings:{label:'🛍️ نئی Store Listing',page:'stores.html'},
    properties:{label:'🏠 نئی Property Listing',page:'property.html'}
  };
  function indicator(text,page){
    let el=document.getElementById('trooth-market-live-indicator');
    if(!el){
      el=document.createElement('div');el.id='trooth-market-live-indicator';
      el.style.cssText='position:fixed;top:72px;right:14px;z-index:9999;padding:9px 13px;border-radius:999px;background:#fff;border:1px solid #bbf7d0;box-shadow:0 5px 18px rgba(0,0,0,.12);font:700 13px system-ui;color:#166534;cursor:pointer;display:none';
      document.body.appendChild(el);
    }
    el.textContent=text;el.style.display='block';el.onclick=()=>location.href=page;
    clearTimeout(el._timer);el._timer=setTimeout(()=>el.style.display='none',8000);
  }
  function boot(){
    const sb=window.troothSupabase;if(!sb)return;
    const channel=sb.channel('trooth-market-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'businesses'},p=>update('businesses',p))
      .on('postgres_changes',{event:'*',schema:'public',table:'store_listings'},p=>update('store_listings',p))
      .on('postgres_changes',{event:'*',schema:'public',table:'properties'},p=>update('properties',p))
      .subscribe(status=>window.troothMarketLiveStatus=status);
    window.troothMarketLiveChannel=channel;
  }
  function update(type,payload){
    const cfg=map[type];
    window.troothMarketLiveAt=new Date().toISOString();
    window.dispatchEvent(new CustomEvent('trooth-market-live-update',{detail:{type,payload}}));
    if(payload&&payload.eventType==='INSERT') indicator(cfg.label,cfg.page);
    const path=location.pathname.toLowerCase();
    if(path.endsWith(cfg.page)){
      clearTimeout(window.troothMarketReloadTimer);
      window.troothMarketReloadTimer=setTimeout(()=>location.reload(),350);
    }
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();