/* Trooth Social Independent — live Business / Stores / Property marketplace bridge */
(function(){
  const map={
    businesses:{label:'🟢 نئی Business Listing',page:'business.html'},
    store_listings:{label:'🛍️ نئی Store Listing',page:'stores.html'},
    properties:{label:'🏠 نئی Property Listing',page:'property.html'}
  };
  let channel=null,authSub=null,reconnectTimer=null,reloadTimer=null,booting=false,stopped=false;

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

  function cleanup(){
    stopped=true;
    clearTimeout(reconnectTimer);reconnectTimer=null;
    clearTimeout(reloadTimer);reloadTimer=null;
    if(channel){try{window.troothSupabase&&window.troothSupabase.removeChannel(channel)}catch(e){}channel=null;}
    if(authSub&&authSub.unsubscribe){try{authSub.unsubscribe()}catch(e){}authSub=null;}
    window.troothMarketLiveChannel=null;
  }

  function scheduleBoot(){
    clearTimeout(reconnectTimer);
    reconnectTimer=setTimeout(()=>{reconnectTimer=null;if(!stopped)boot(true)},700);
  }

  function boot(reconnect){
    const sb=window.troothSupabase;if(!sb||booting||stopped)return;
    booting=true;
    if(reconnect){
      if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
      window.troothMarketLiveChannel=null;
    }
    const name='trooth-market-live-'+Date.now();
    channel=sb.channel(name)
      .on('postgres_changes',{event:'*',schema:'public',table:'businesses'},p=>update('businesses',p))
      .on('postgres_changes',{event:'*',schema:'public',table:'store_listings'},p=>update('store_listings',p))
      .on('postgres_changes',{event:'*',schema:'public',table:'properties'},p=>update('properties',p))
      .subscribe(status=>{
        window.troothMarketLiveStatus=status;
        booting=false;
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')scheduleBoot();
      });
    window.troothMarketLiveChannel=channel;
  }

  function update(type,payload){
    const cfg=map[type];if(!cfg)return;
    window.troothMarketLiveAt=new Date().toISOString();
    window.dispatchEvent(new CustomEvent('trooth-market-live-update',{detail:{type,payload}}));
    if(payload&&payload.eventType==='INSERT')indicator(cfg.label,cfg.page);
    const path=location.pathname.toLowerCase();
    if(path.endsWith(cfg.page)){
      clearTimeout(reloadTimer);
      reloadTimer=setTimeout(()=>{reloadTimer=null;if(!stopped)location.reload()},350);
    }
  }

  function wireAuth(){
    const sb=window.troothSupabase;if(!sb||!sb.auth)return;
    if(authSub&&authSub.unsubscribe)try{authSub.unsubscribe()}catch(e){}
    const result=sb.auth.onAuthStateChange((event)=>{
      if(event==='SIGNED_OUT'||event==='USER_DELETED')cleanup();
      else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        stopped=false;boot(true);
      }
    });
    authSub=result&&result.data&&result.data.subscription?result.data.subscription:null;
  }

  function start(){
    stopped=false;boot(false);wireAuth();
    window.addEventListener('beforeunload',cleanup,{once:true});
  }

  if(window.troothSupabase)start();else window.addEventListener('trooth-supabase-ready',start,{once:true});
})();
