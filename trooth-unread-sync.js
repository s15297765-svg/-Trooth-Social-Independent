// Trooth Social Independent — cross-page unread counter sync
(function(){
  function boot(){
    if(window.__troothUnreadSync)return;window.__troothUnreadSync=true;
    var key='trooth_unread_messages';
    function badge(){
      if(document.getElementById('trooth-unread-badge'))return document.getElementById('trooth-unread-badge');
      var b=document.createElement('span');b.id='trooth-unread-badge';b.style.cssText='display:none;position:fixed;right:14px;top:138px;z-index:9995;min-width:25px;height:25px;padding:0 7px;border-radius:999px;background:#d62828;color:#fff;text-align:center;line-height:25px;font:800 11px system-ui;box-shadow:0 5px 15px #0002';document.body.appendChild(b);return b
    }
    function show(n){var b=badge();b.textContent=n>99?'99+':n;b.style.display=n?'block':'none'}
    function refresh(){var sb=window.troothSupabase;if(!sb)return;sb.auth.getUser().then(function(r){var u=r.data&&r.data.user;if(!u)return sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',u.id).eq('is_read',false).then(function(x){show(x.count||0);try{localStorage.setItem(key,String(x.count||0))}catch(e){}})})}
    window.addEventListener('storage',function(e){if(e.key===key)show(Number(e.newValue||0))});window.addEventListener('trooth-messages-refresh',refresh);window.addEventListener('online',refresh);setTimeout(refresh,2200);setInterval(refresh,45000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
