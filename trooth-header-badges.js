// Trooth Social Independent — live header notification/message badges
(function(){
  if(window.__troothHeaderBadges)return;window.__troothHeaderBadges=true;
  function boot(){
    if(window.__troothHeaderBadgesBooted)return;window.__troothHeaderBadgesBooted=true;
    var css=document.createElement('style');css.textContent='.trooth-live-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:4px;border-radius:999px;background:#d62828;color:#fff;font:800 10px system-ui;vertical-align:middle;box-shadow:0 2px 7px #0002}.trooth-badge-wrap{position:relative}.trooth-badge-wrap .trooth-live-badge{position:absolute;right:-8px;top:-7px;margin:0}.trooth-unread-pulse{animation:troothPulse 1.6s infinite}@keyframes troothPulse{50%{transform:scale(1.08)}}';document.head.appendChild(css);
    function addBadge(el,n){if(!el)return;var b=el.querySelector('.trooth-live-badge');if(!n){if(b)b.remove();return}if(!b){b=document.createElement('span');b.className='trooth-live-badge trooth-unread-pulse';el.classList.add('trooth-badge-wrap');el.appendChild(b)}b.textContent=n>99?'99+':n}
    function targets(kind){var all=[].slice.call(document.querySelectorAll('a,button'));return all.filter(function(el){var s=((el.textContent||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')).toLowerCase();return kind==='msg'?(s.indexOf('message')>-1||s.indexOf('💬')>-1):(s.indexOf('notification')>-1||s.indexOf('نوتیف')>-1||s.indexOf('🔔')>-1)})}
    function refresh(){var sb=window.troothSupabase;if(!sb)return;sb.auth.getUser().then(function(x){var u=x.data&&x.data.user;if(!u)return;return Promise.all([sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',u.id).eq('is_read',false),sb.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',u.id).eq('is_read',false)]).then(function(r){targets('msg').forEach(function(e){addBadge(e,r[0].count||0)});targets('note').forEach(function(e){addBadge(e,r[1].count||0)})})}).catch(function(){});}
    window.addEventListener('trooth-messages-refresh',refresh);window.addEventListener('trooth-notifications-refresh',refresh);window.addEventListener('trooth-auth-changed',function(){setTimeout(refresh,200)});window.addEventListener('online',refresh);new MutationObserver(function(){refresh()}).observe(document.body,{childList:true,subtree:true});setTimeout(refresh,2600);setInterval(refresh,30000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
