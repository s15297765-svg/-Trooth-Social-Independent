/* Trooth Social Independent — marketplace interactions live bridge */
(function(){
  const types={businesses:'business',store_listings:'stores',properties:'property'};
  let channel=null,authSub=null,reconnectTimer=null,refreshTimer=null,booting=false,stopped=false;

  function alertInsert(type){
    const names={business:'🏢 نئی Business Listing',stores:'🛍️ نئی Store Listing',property:'🏠 نئی Property Listing'};
    let el=document.getElementById('trooth-market-alert');
    if(!el){
      el=document.createElement('div');el.id='trooth-market-alert';
      el.style='position:fixed;top:166px;right:14px;z-index:10000;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:10px 14px;box-shadow:0 8px 24px #0002;font:700 13px system-ui;color:#166534;cursor:pointer';
      document.body.appendChild(el);
    }
    el.textContent=names[type]||'🟢 Marketplace Update';
    el.onclick=()=>location.href=type==='business'?'business.html':type==='stores'?'stores.html':'property.html';
    clearTimeout(el._t);el._t=setTimeout(()=>el.remove(),8000);
  }

  function refresh(){
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>{
      refreshTimer=null;
      window.dispatchEvent(new CustomEvent('trooth-market-interaction-update'));
      if(typeof window.refreshTroothFeed==='function')window.refreshTroothFeed();
    },180);
  }

  function cleanup(){
    stopped=true;
    clearTimeout(reconnectTimer);reconnectTimer=null;
    clearTimeout(refreshTimer);refreshTimer=null;
    if(channel){try{window.troothSupabase&&window.troothSupabase.removeChannel(channel)}catch(e){}channel=null;}
    if(authSub&&authSub.unsubscribe){try{authSub.unsubscribe()}catch(e){}authSub=null;}
    window.troothMarketInteractionsChannel=null;
  }

  function scheduleReconnect(){
    clearTimeout(reconnectTimer);
    reconnectTimer=setTimeout(()=>{reconnectTimer=null;if(!stopped)boot(true)},700);
  }

  function boot(reconnect){
    const sb=window.troothSupabase;if(!sb||booting||stopped)return;
    booting=true;
    if(reconnect&&channel){try{sb.removeChannel(channel)}catch(e){}channel=null;}
    const name='trooth-market-interactions-'+Date.now();
    channel=sb.channel(name);
    Object.keys(types).forEach(table=>{
      channel.on('postgres_changes',{event:'*',schema:'public',table},p=>{
        const type=types[table];
        window.dispatchEvent(new CustomEvent('trooth-market-live-update',{detail:{type,table,payload:p}}));
        refresh();
        if(p&&p.eventType==='INSERT')alertInsert(type);
      });
    });
    channel.subscribe(status=>{
      window.troothMarketInteractionsStatus=status;
      booting=false;
      if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')scheduleReconnect();
    });
    window.troothMarketInteractionsChannel=channel;
  }

  function wireAuth(){
    const sb=window.troothSupabase;if(!sb||!sb.auth)return;
    const result=sb.auth.onAuthStateChange(event=>{
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
