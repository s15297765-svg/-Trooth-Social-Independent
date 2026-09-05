// Trooth — live navigation badges + unified refresh bridge
(function(){
  function ready(){return window.troothSupabase?Promise.resolve(window.troothSupabase):new Promise(r=>window.addEventListener('trooth-supabase-ready',()=>r(window.troothSupabase),{once:true}))}
  function badgeLink(href,emoji,id,count){
    document.querySelectorAll('a[href="notifications-messages.html"]').forEach(a=>{if((a.textContent||'').includes(emoji))a.href=href});
    document.querySelectorAll('[onclick*="notifications-messages.html"]').forEach(b=>{if((b.textContent||'').includes(emoji))b.onclick=()=>location.href=href});
    let el=document.getElementById(id);if(!el)return;el.textContent=count>99?'99+':count;el.style.display=count?'inline-flex':'none';el.style.alignItems='center';el.style.justifyContent='center';
  }
  async function run(){
    const sb=await ready();
    let u=(await sb.auth.getUser()).data.user;if(!u)return;
    let refreshTimer=null;
    async function refresh(){
      clearTimeout(refreshTimer);refreshTimer=setTimeout(async function(){
        const n=await sb.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',u.id).eq('is_read',false);
        const m=await sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',u.id).eq('is_read',false);
        badgeLink('notifications.html','🔔','troothNavNotifBadge',n.count||0);
        badgeLink('chat.html','💬','troothNavMsgBadge',m.count||0);
      },80);
    }
    function inject(){
      document.querySelectorAll('.circle').forEach((b,i)=>{
        if(i===1&&!b.querySelector('#troothNavNotifBadge')){const s=document.createElement('span');s.id='troothNavNotifBadge';s.className='badge';s.style.cssText='position:absolute;top:-5px;right:-4px;min-width:18px;height:18px;border-radius:99px;background:#d62828;color:#fff;font-size:10px;font-weight:900;padding:0 5px';b.style.position='relative';b.appendChild(s)}
        if(i===2&&!b.querySelector('#troothNavMsgBadge')){const s=document.createElement('span');s.id='troothNavMsgBadge';s.className='badge';s.style.cssText='position:absolute;top:-5px;right:-4px;min-width:18px;height:18px;border-radius:99px;background:#d62828;color:#fff;font-size:10px;font-weight:900;padding:0 5px';b.style.position='relative';b.appendChild(s)}
      });
    }
    inject();refresh();
    window.addEventListener('trooth-navigation-refresh',refresh);
    window.addEventListener('trooth-content-hubs-refresh',function(){inject()});
    const ch=sb.channel('trooth-global-nav-live-v2')
      .on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:`user_id=eq.${u.id}`},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:`receiver_id=eq.${u.id}`},refresh)
      .subscribe();
    window.troothNavigationRealtime=ch;
    sb.auth.onAuthStateChange(function(){setTimeout(function(){location.reload()},0)});
  }
  ready().then(run).catch(()=>{});
})();
