// Trooth Social Independent — cross-page unread counter sync v6
(function(){
  function boot(){
    if(window.__troothUnreadSync)return;window.__troothUnreadSync=true;
    var key='trooth_unread_messages',timer=null,online=navigator.onLine!==false,last=-1,busy=false,channel=null,lastIncoming={};
    try{if('BroadcastChannel' in window)channel=new BroadcastChannel('trooth-unread-sync')}catch(e){}
    function badge(){
      var b=document.getElementById('trooth-unread-badge');
      if(b)return b;
      b=document.createElement('button');b.id='trooth-unread-badge';b.type='button';b.setAttribute('aria-live','polite');b.title='Open unread messages';b.style.cssText='display:none;position:fixed;right:14px;top:138px;z-index:9995;min-width:25px;height:25px;padding:0 7px;border:0;border-radius:999px;background:#d62828;color:#fff;text-align:center;line-height:25px;font:800 11px system-ui;box-shadow:0 5px 15px #0002;cursor:pointer';b.addEventListener('click',function(){location.href='notifications-messages.html#messages'});document.body.appendChild(b);return b
    }
    function show(n){n=Math.max(0,Math.min(9999,Number(n)||0));var b=badge();b.textContent=n>99?'99+':n;b.style.display=n?'block':'none';b.setAttribute('aria-label',n?'Unread messages: '+n:'No unread messages');if(n!==last){last=n;window.dispatchEvent(new CustomEvent('trooth-unread-count',{detail:{count:n}}))}}
    function save(n,broadcast){try{localStorage.setItem(key,String(n));localStorage.setItem(key+'_at',String(Date.now()))}catch(e){}if(broadcast&&channel){try{channel.postMessage({type:'count',count:n})}catch(e){}}}
    function refresh(){if(busy||!online||!navigator.onLine)return;var sb=window.troothSupabase;if(!sb)return;busy=true;sb.auth.getUser().then(function(r){var u=r.data&&r.data.user;if(!u){show(0);save(0,true);return null}return sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',u.id).eq('is_read',false).then(function(x){if(x.error)return;var n=x.count||0;show(n);save(n,false);window.dispatchEvent(new CustomEvent('trooth-unread-updated',{detail:{count:n,source:'sync'}}))})}).catch(function(){}).finally(function(){busy=false})}
    function schedule(ms){clearTimeout(timer);timer=setTimeout(refresh,ms||600)}
    function incomingId(detail){var d=detail||{};return String(d.id||d.message_id||d.created_at||'')}
    function handleIncoming(e){var d=e&&e.detail||{},id=incomingId(d),now=Date.now();if(id&&lastIncoming[id]&&now-lastIncoming[id]<4000)return;if(id)lastIncoming[id]=now;var n=Math.max(1,last<0?1:last+1);show(n);save(n,true);schedule(100)}
    try{show(Number(localStorage.getItem(key)||0))}catch(e){}
    window.addEventListener('storage',function(e){if(e.key===key)show(Number(e.newValue||0))});
    if(channel)channel.addEventListener('message',function(e){var d=e.data||{};if(d.type==='count')show(d.count)});
    window.addEventListener('trooth-message-incoming',handleIncoming);
    window.addEventListener('trooth-messages-refresh',function(){schedule(150)});
    window.addEventListener('trooth-unread-updated',function(e){var n=e.detail&&e.detail.count;if(n!==undefined){show(n);save(n,true)}});
    window.addEventListener('trooth-auth-changed',function(){last=-1;show(0);save(0,true);schedule(250)});
    window.addEventListener('online',function(){online=true;schedule(300)});
    window.addEventListener('offline',function(){online=false;clearTimeout(timer)});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&online)schedule(300)});
    window.addEventListener('pageshow',function(){if(online)schedule(300)});
    setTimeout(refresh,1800);setInterval(function(){if(!document.hidden&&online)refresh()},60000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
