/* Trooth Social Independent — Notifications + Messenger live UI */
(function(){
  function boot(){
    if(window.__troothNotificationsMessages)return;window.__troothNotificationsMessages=true;
    const sb=window.troothSupabase;if(!sb||!sb.auth)return;
    let user=null,notifChannel=null,msgChannel=null;
    function badge(selector,n){document.querySelectorAll(selector).forEach(e=>{e.textContent=n?' '+(n>99?'99+':n):'';e.classList.toggle('trooth-badge',n>0)})}
    function toast(text,url){let a=document.getElementById('trooth-alert');if(!a){a=document.createElement('div');a.id='trooth-alert';a.className='trooth-alert';document.body.appendChild(a)}a.textContent=text;a.onclick=()=>{if(url)location.href=url};a.classList.add('show');clearTimeout(a._t);a._t=setTimeout(()=>a.classList.remove('show'),4500)}
    async function refresh(){if(!user)return;try{const r=await sb.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50);const list=r.data||[];window.troothNotifications=list;badge('[data-trooth-notifications-badge]',list.filter(x=>!x.is_read&&x.read_at==null).length);window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:list}))}catch(e){}}
    async function refreshMessages(){if(!user)return;try{const r=await sb.from('messages').select('*').eq('receiver_id',user.id).order('created_at',{ascending:false}).limit(50);const list=r.data||[];window.troothMessages=list;badge('[data-trooth-messages-badge]',list.filter(x=>!x.is_read&&!x.read_at).length);window.dispatchEvent(new CustomEvent('trooth-messages-refresh',{detail:list}))}catch(e){}}
    function channels(){if(!user)return;try{if(notifChannel)sb.removeChannel(notifChannel);if(msgChannel)sb.removeChannel(msgChannel)}catch(e){}
      notifChannel=sb.channel('trooth-notifications-'+user.id).on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},function(p){refresh();if(p.eventType==='INSERT'){const n=p.new||{};const url=(n.post_id?('index.html?post='+encodeURIComponent(n.post_id)):(n.kind==='message'?'chat.html':'notifications.html'));toast('🔔 نئی Notification',url);window.dispatchEvent(new CustomEvent('trooth-notification-incoming',{detail:n}))}}).subscribe();
      msgChannel=sb.channel('trooth-messages-'+user.id).on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},function(p){refreshMessages();if(p.eventType==='INSERT'){toast('💬 نیا Message','chat.html');window.dispatchEvent(new CustomEvent('trooth-message-incoming',{detail:p.new}))}}).subscribe();
    }
    async function start(){const r=await sb.auth.getUser();user=r.data&&r.data.user;if(!user)return;await refresh();await refreshMessages();channels()}
    const css=document.createElement('style');css.textContent='.trooth-alert{position:fixed;top:118px;right:14px;z-index:10000;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:11px 14px;box-shadow:0 8px 24px #0002;font:600 13px system-ui;color:#166534;display:none;cursor:pointer}.trooth-alert.show{display:block}.trooth-badge{display:inline-flex;min-width:18px;height:18px;align-items:center;justify-content:center;border-radius:99px;background:#dc2626;color:#fff;font:700 11px system-ui;margin-left:5px;padding:0 5px}';document.head.appendChild(css);
    window.refreshTroothNotifications=refresh;window.refreshTroothMessages=refreshMessages;
    window.addEventListener('trooth-notifications-refresh',function(){if(user)refresh()});window.addEventListener('trooth-messages-refresh',function(){if(user)refreshMessages()});window.addEventListener('trooth-auth-changed',function(){start()});window.addEventListener('online',function(){start()});
    start();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();