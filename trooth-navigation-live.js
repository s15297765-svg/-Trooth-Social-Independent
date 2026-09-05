// Trooth — live navigation badges + unified refresh bridge
(function(){
  function ready(){return window.troothSupabase?Promise.resolve(window.troothSupabase):new Promise(r=>window.addEventListener('trooth-supabase-ready',()=>r(window.troothSupabase),{once:true}))}
  function badgeLink(href,emoji,id,count){
    document.querySelectorAll('a[href="notifications-messages.html"]').forEach(a=>{if((a.textContent||'').includes(emoji))a.href=href});
    document.querySelectorAll('[onclick*="notifications-messages.html"]').forEach(b=>{if((b.textContent||'').includes(emoji))b.onclick=()=>location.href=href});
    let el=document.getElementById(id);if(!el)return;el.textContent=count>99?'99+':count;el.style.display=count?'inline-flex':'none';el.style.alignItems='center';el.style.justifyContent='center';
  }
  async function run(){
    if(window.troothNavigationRealtimeReady)return;
    const sb=await ready();
    if(!sb||!sb.auth)return;
    window.troothNavigationRealtimeReady=true;
    let u=null,refreshTimer=null,reconnectTimer=null,channel=null,authSub=null,stopped=false,refreshing=false,pending=false;
    function removeChannel(){clearTimeout(refreshTimer);clearTimeout(reconnectTimer);refreshTimer=null;reconnectTimer=null;if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}window.troothNavigationRealtime=null}
    function cleanup(full){removeChannel();if(full&&authSub){try{authSub.unsubscribe()}catch(e){}authSub=null}window.troothNavigationRealtime=null}
    async function doRefresh(){
      if(stopped||!u)return;
      if(refreshing){pending=true;return;}
      refreshing=true;pending=false;
      try{
        const results=await Promise.all([
          sb.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',u.id).eq('is_read',false),
          sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',u.id).eq('is_read',false)
        ]);
        const n=results[0],m=results[1];
        if(n.error||m.error)return;
        badgeLink('notifications.html','🔔','troothNavNotifBadge',n.count||0);
        badgeLink('chat.html','💬','troothNavMsgBadge',m.count||0);
      }finally{refreshing=false;if(pending)refresh()}
    }
    function refresh(){clearTimeout(refreshTimer);if(stopped||!u)return;refreshTimer=setTimeout(doRefresh,80)}
    function inject(){document.querySelectorAll('.circle').forEach((b,i)=>{if(i===1&&!b.querySelector('#troothNavNotifBadge')){const s=document.createElement('span');s.id='troothNavNotifBadge';s.className='badge';s.style.cssText='position:absolute;top:-5px;right:-4px;min-width:18px;height:18px;border-radius:99px;background:#d62828;color:#fff;font-size:10px;font-weight:900;padding:0 5px';b.style.position='relative';b.appendChild(s)}if(i===2&&!b.querySelector('#troothNavMsgBadge')){const s=document.createElement('span');s.id='troothNavMsgBadge';s.className='badge';s.style.cssText='position:absolute;top:-5px;right:-4px;min-width:18px;height:18px;border-radius:99px;background:#d62828;color:#fff;font-size:10px;font-weight:900;padding:0 5px';b.style.position='relative';b.appendChild(s)}})}
    function subscribe(){
      if(stopped||!u||channel)return;
      const ch=sb.channel('trooth-global-nav-live-v4-'+u.id+'-'+Date.now());channel=ch;
      ch.on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:`user_id=eq.${u.id}`},refresh).on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:`receiver_id=eq.${u.id}`},refresh).subscribe(function(status){
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
          if(channel===ch){try{sb.removeChannel(ch)}catch(e){}channel=null;window.troothNavigationRealtime=null}
          clearTimeout(reconnectTimer);reconnectTimer=setTimeout(subscribe,700);
        }
      });window.troothNavigationRealtime=ch;
    }
    async function connect(){const next=(await sb.auth.getUser()).data.user;removeChannel();u=next;if(!u){stopped=true;return}stopped=false;inject();refresh();subscribe()}
    inject();
    authSub=sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||event==='USER_DELETED'){stopped=true;u=null;removeChannel();return}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){stopped=false;u=session?.user||null;setTimeout(()=>{if(!stopped)connect()},50)}
    }).data?.subscription||null;
    connect();
    window.addEventListener('trooth-navigation-refresh',refresh);
    window.addEventListener('trooth-content-hubs-refresh',inject);
    window.addEventListener('beforeunload',()=>cleanup(true),{once:true});
  }
  ready().then(run).catch(()=>{});
})();