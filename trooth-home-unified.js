/* Trooth Social Independent — unified Home Experience bridge */
(function(){
  const market={businesses:{label:'🏢 Business',href:'business.html'},store_listings:{label:'🛍️ Stores',href:'stores.html'},properties:{label:'🏠 Property',href:'property.html'}};
  function boot(){
    const sb=window.troothSupabase;if(!sb)return;
    function toast(text,href){
      let e=document.getElementById('trooth-home-live');
      if(!e){e=document.createElement('div');e.id='trooth-home-live';e.style='position:fixed;top:214px;right:14px;z-index:10001;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:10px 14px;box-shadow:0 8px 24px #0002;font:700 13px system-ui;color:#166534;cursor:pointer';document.body.appendChild(e)}
      e.textContent=text;e.onclick=()=>href&&(location.href=href);clearTimeout(e._t);e._t=setTimeout(()=>e.remove(),7000);
    }
    const channel=sb.channel('trooth-unified-home');
    channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'posts'},p=>{window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:'post',payload:p.new}}));toast('🟢 نئی Social Post','index.html');});
    channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'group_posts'},p=>{window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:'group_post',payload:p.new}}));toast('👥 نئی Group Post','groups.html');});
    channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'groups'},p=>{window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:'group',payload:p.new}}));toast('👥 نیا Group','groups.html');});
    Object.keys(market).forEach(table=>channel.on('postgres_changes',{event:'INSERT',schema:'public',table},p=>{const m=market[table];window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:table,payload:p.new}}));toast(m.label+' — نئی Listing',m.href);}));
    channel.on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications'},p=>window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:'notification',payload:p.new}})));
    channel.subscribe(status=>{window.troothUnifiedHomeStatus=status;});
    window.troothUnifiedHomeChannel=channel;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();