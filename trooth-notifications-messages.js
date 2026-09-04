/* Trooth Social Independent — Notifications + Messenger live UI */
(function(){
  function boot(){
    const sb=window.troothSupabase;if(!sb||!sb.auth)return;
    sb.auth.getUser().then(async({data})=>{
      const user=data&&data.user;if(!user)return;
      const css=document.createElement('style');css.textContent='.trooth-alert{position:fixed;top:118px;right:14px;z-index:10000;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:11px 14px;box-shadow:0 8px 24px #0002;font:600 13px system-ui;color:#166534;display:none;cursor:pointer}.trooth-alert.show{display:block}.trooth-badge{display:inline-flex;min-width:18px;height:18px;align-items:center;justify-content:center;border-radius:99px;background:#dc2626;color:#fff;font:700 11px system-ui;margin-left:5px;padding:0 5px}';document.head.appendChild(css);
      async function refresh(){
        const r=await sb.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(20);
        const list=r.data||[];window.troothNotifications=list;window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:list}));
        const unread=list.filter(x=>!x.is_read&&x.read_at==null).length;
        document.querySelectorAll('[data-trooth-notifications-badge]').forEach(e=>{e.textContent=unread?unread:'';e.classList.toggle('trooth-badge',unread>0)});
      }
      async function refreshMessages(){
        const r=await sb.from('messages').select('*').eq('receiver_id',user.id).order('created_at',{ascending:false}).limit(20);
        const list=r.data||[];window.troothMessages=list;window.dispatchEvent(new CustomEvent('trooth-messages-refresh',{detail:list}));
        const unread=list.filter(x=>!x.read_at).length;
        document.querySelectorAll('[data-trooth-messages-badge]').forEach(e=>{e.textContent=unread?unread:'';e.classList.toggle('trooth-badge',unread>0)});
      }
      window.refreshTroothNotifications=refresh;window.refreshTroothMessages=refreshMessages;
      window.addEventListener('trooth-notification',e=>{const n=e.detail||{};let a=document.getElementById('trooth-alert');if(!a){a=document.createElement('div');a.id='trooth-alert';a.className='trooth-alert';document.body.appendChild(a)}a.textContent='🔔 نئی Notification';a.onclick=()=>location.href='index.html';a.classList.add('show');clearTimeout(a._t);a._t=setTimeout(()=>a.classList.remove('show'),6000)});
      window.addEventListener('trooth-message',e=>{let a=document.getElementById('trooth-alert');if(!a){a=document.createElement('div');a.id='trooth-alert';a.className='trooth-alert';document.body.appendChild(a)}a.textContent='💬 نیا Message';a.onclick=()=>location.href='chat.html';a.classList.add('show');clearTimeout(a._t);a._t=setTimeout(()=>a.classList.remove('show'),6000)});
      await refresh();await refreshMessages();
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();