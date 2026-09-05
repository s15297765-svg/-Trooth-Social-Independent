// Trooth Social Independent — live header notification/message badges v2
(function(){
  if(window.__troothHeaderBadges)return;window.__troothHeaderBadges=true;
  function boot(){
    if(window.__troothHeaderBadgesBooted)return;window.__troothHeaderBadgesBooted=true;
    var css=document.createElement('style');css.textContent='.trooth-live-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:4px;border-radius:999px;background:#d62828;color:#fff;font:800 10px system-ui;vertical-align:middle;box-shadow:0 2px 7px #0002}.trooth-badge-wrap{position:relative}.trooth-badge-wrap .trooth-live-badge{position:absolute;right:-8px;top:-7px;margin:0}.trooth-unread-pulse{animation:troothPulse 1.6s infinite}@keyframes troothPulse{50%{transform:scale(1.08)}}';document.head.appendChild(css);
    var timer=null,lastMsg=-1,lastNote=-1,busy=false;
    function addBadge(el,n){if(!el)return;var b=el.querySelector('.trooth-live-badge');if(!n){if(b)b.remove();return}if(!b){b=document.createElement('span');b.className='trooth-live-badge trooth-unread-pulse';el.classList.add('trooth-badge-wrap');el.appendChild(b)}b.textContent=n>99?'99+':n}
    function targets(kind){var all=[].slice.call(document.querySelectorAll('a,button,[role="button"]'));return all.filter(function(el){var s=((el.textContent||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')).toLowerCase();return kind==='msg'?(s.indexOf('message')>-1||s.indexOf('💬')>-1):(s.indexOf('notification')>-1||s.indexOf('نوتیف')>-1||s.indexOf('🔔')>-1)})}
    async function refresh(){if(busy||!navigator.onLine)return;var sb=window.troothSupabase;if(!sb)return;busy=true;try{var x=await sb.auth.getUser(),u=x.data&&x.data.user;if(!u){targets('msg').forEach(function(e){addBadge(e,0)});targets('note').forEach(function(e){addBadge(e,0)});return}var r=await Promise.all([sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',u.id).eq('is_read',false),sb.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',u.id).eq('is_read',false)]);var m=r[0].count||0,n=r[1].count||0;targets('msg').forEach(function(e){addBadge(e,m)});targets('note').forEach(function(e){addBadge(e,n)});if(m!==lastMsg||n!==lastNote)window.dispatchEvent(new CustomEvent('trooth-header-badges-updated',{detail:{messages:m,notifications:n}}));lastMsg=m;lastNote=n}catch(e){}finally{busy=false}}
    function schedule(ms){clearTimeout(timer);timer=setTimeout(refresh,ms||250)}
    window.refreshTroothHeaderBadges=refresh;
    window.addEventListener('trooth-messages-refresh',function(){schedule(100)});window.addEventListener('trooth-notifications-refresh',function(){schedule(100)});window.addEventListener('trooth-unread-updated',function(){schedule(100)});window.addEventListener('trooth-auth-changed',function(){lastMsg=-1;lastNote=-1;schedule(200)});window.addEventListener('online',function(){schedule(300)});window.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(300)});
    new MutationObserver(function(){schedule(700)}).observe(document.body,{childList:true,subtree:true});setTimeout(refresh,2200);setInterval(function(){if(!document.hidden&&navigator.onLine)refresh()},60000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
