// Trooth Social Independent — cross-page unread counter sync v2
(function(){
  function boot(){
    if(window.__troothUnreadSync)return;window.__troothUnreadSync=true;
    var key='trooth_unread_messages',timer=null,online=navigator.onLine!==false,last=-1;
    function badge(){
      if(document.getElementById('trooth-unread-badge'))return document.getElementById('trooth-unread-badge');
      var b=document.createElement('span');b.id='trooth-unread-badge';b.setAttribute('role','status');b.setAttribute('aria-live','polite');b.style.cssText='display:none;position:fixed;right:14px;top:138px;z-index:9995;min-width:25px;height:25px;padding:0 7px;border-radius:999px;background:#d62828;color:#fff;text-align:center;line-height:25px;font:800 11px system-ui;box-shadow:0 5px 15px #0002';document.body.appendChild(b);return b
    }
    function show(n){n=Math.max(0,Number(n)||0);var b=badge();b.textContent=n>99?'99+':n;b.style.display=n?'block':'none';b.setAttribute('aria-label',n?'Unread messages: '+n:'No unread messages');if(n!==last){last=n;window.dispatchEvent(new CustomEvent('trooth-unread-count',{detail:{count:n}}))}}
    function save(n){try{localStorage.setItem(key,String(n));localStorage.setItem(key+'_at',String(Date.now()))}catch(e){}}
    function refresh(){var sb=window.troothSupabase;if(!sb||!navigator.onLine)return;sb.auth.getUser().then(function(r){var u=r.data&&r.data.user;if(!u){show(0);save(0);return null}return sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',u.id).eq('is_read',false).then(function(x){if(x.error)return;var n=x.count||0;show(n);save(n);window.dispatchEvent(new CustomEvent('trooth-unread-updated',{detail:{count:n}}))})}).catch(function(){})}
    function schedule(ms){clearTimeout(timer);timer=setTimeout(refresh,ms||600)}
    try{show(Number(localStorage.getItem(key)||0))}catch(e){}
    window.addEventListener('storage',function(e){if(e.key===key)show(Number(e.newValue||0))});
    window.addEventListener('trooth-message-incoming',function(){schedule(100)});
    window.addEventListener('trooth-messages-refresh',function(){schedule(150)});
    window.addEventListener('trooth-auth-changed',function(){last=-1;show(0);schedule(250)});
    window.addEventListener('online',function(){online=true;schedule(300)});
    window.addEventListener('offline',function(){online=false});
    window.addEventListener('visibilitychange',function(){if(!document.hidden&&online)schedule(300)});
    window.addEventListener('pageshow',function(){if(online)schedule(300)});
    setTimeout(refresh,2200);setInterval(function(){if(!document.hidden&&online)refresh()},60000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
