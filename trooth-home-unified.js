/* Trooth Social Independent — unified Home Experience bridge */
(function(){
  if(window.troothUnifiedHomeLive)return;
  window.troothUnifiedHomeLive=true;
  const market={businesses:{label:'🏢 Business',href:'business.html'},store_listings:{label:'🛍️ Stores',href:'stores.html'},properties:{label:'🏠 Property',href:'property.html'}};
  let channel=null,authSub=null,reconnectTimer=null,started=false,stopped=false,booting=false;
  function toast(text,href){
    let e=document.getElementById('trooth-home-live');
    if(!e){e=document.createElement('div');e.id='trooth-home-live';e.style='position:fixed;top:214px;right:14px;z-index:10001;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:10px 14px;box-shadow:0 8px 24px #0002;font:700 13px system-ui;color:#166534;cursor:pointer';document.body.appendChild(e)}
    e.textContent=text;e.onclick=()=>href&&(location.href=href);clearTimeout(e._t);e._t=setTimeout(()=>e.remove(),7000);
  }
  function removeChannel(){
    clearTimeout(reconnectTimer);reconnectTimer=null;
    if(channel){try{window.troothSupabase&&window.troothSupabase.removeChannel(channel)}catch(e){}channel=null;}
    window.troothUnifiedHomeChannel=null;
  }
  function cleanup(full){
    stopped=true;removeChannel();
    if(full&&authSub&&authSub.unsubscribe){try{authSub.unsubscribe()}catch(e){}authSub=null;}
  }
  function reconnect(){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(()=>{reconnectTimer=null;if(!stopped)boot(true)},700)}
  function boot(reconnectMode){
    const sb=window.troothSupabase;if(!sb||stopped||booting)return;
    booting=true;
    try{
      if(reconnectMode)removeChannel();
      const name='trooth-unified-home-'+Date.now();channel=sb.channel(name);
      channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},p=>{window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:'post',payload:p.new}}));toast('🟢 نئی Social Post','index.html');});
      channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'groups'},p=>{window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:'group',payload:p.new}}));toast('👥 نیا Group','groups.html');});
      Object.keys(market).forEach(table=>channel.on('postgres_changes',{event:'INSERT',schema:'public',table},p=>{const m=market[table];window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:table,payload:p.new}}));toast(m.label+' — نئی Listing',m.href);}));
      channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications'},p=>window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:'notification',payload:p.new}})));
      channel.subscribe(status=>{window.troothUnifiedHomeStatus=status;if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')reconnect();});
      window.troothUnifiedHomeChannel=channel;
    }finally{booting=false;}
  }
  function start(){
    if(started)return;started=true;stopped=false;boot(false);
    const sb=window.troothSupabase;
    if(sb&&sb.auth){
      const result=sb.auth.onAuthStateChange(event=>{
        if(event==='SIGNED_OUT'||event==='USER_DELETED'){removeChannel();stopped=true;}
        else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){stopped=false;boot(true);}
      });
      authSub=result&&result.data&&result.data.subscription?result.data.subscription:null;
    }
    window.addEventListener('beforeunload',()=>cleanup(true),{once:true});
  }
  if(window.troothSupabase)start();else window.addEventListener('trooth-supabase-ready',start,{once:true});
})();