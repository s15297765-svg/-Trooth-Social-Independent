// Trooth Social Independent — unified live event toasts v2
(function(){
  function boot(){
    if(window.__troothLiveToast)return;window.__troothLiveToast=true;
    var css=document.createElement('style');css.textContent='.trooth-live-toast2{position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:100000;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 12px system-ui;box-shadow:0 8px 28px #0003;animation:troothToastIn .2s ease;max-width:calc(100vw - 28px);text-align:center;pointer-events:none}@keyframes troothToastIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}@media(max-width:600px){.trooth-live-toast2{bottom:72px;font-size:11px;padding:9px 13px}}';document.head.appendChild(css);
    var last='',lastAt=0,timer=null;
    function show(text,ttl){var now=Date.now();if(!text||text===last&&now-lastAt<1800)return;last=text;lastAt=now;var old=document.querySelector('.trooth-live-toast2');if(old)old.remove();var x=document.createElement('div');x.className='trooth-live-toast2';x.setAttribute('role','status');x.setAttribute('aria-live','polite');x.textContent=text;document.body.appendChild(x);clearTimeout(timer);timer=setTimeout(function(){if(x.parentNode)x.remove()},ttl||2400)}
    window.addEventListener('trooth-message-incoming',function(){show('💬 New message received')});
    window.addEventListener('trooth-notification-incoming',function(){show('🔔 New notification')});
    window.addEventListener('trooth-realtime-connected',function(){show('🟢 Trooth is LIVE',1600)});
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='CONNECTING')show('🟡 Connecting…',1800);else if(s==='RECONNECTING')show('🟠 Reconnecting…',2000);else if(s==='RETRYING'){var a=e.detail&&e.detail.attempt;show('🟠 Retrying'+(a?' · attempt '+a:'')+'…',2000)}else if(s==='OFFLINE')show('⚪ You are offline',2200);else if(s==='SIGNED_OUT')show('⚪ Signed out',1800)});
    window.addEventListener('trooth-content-interaction-refresh',function(){show('🟢 Interaction synced',1500)});
    window.addEventListener('trooth-auth-changed',function(){show('🔐 Account status updated',1500)});
    window.addEventListener('trooth-unread-updated',function(e){var n=e.detail&&e.detail.count;if(Number(n)>0)show('💬 '+(Number(n)>99?'99+':n)+' unread message'+(Number(n)===1?'':'s'),1600)});
    window.addEventListener('offline',function(){show('⚪ You are offline',2200)});
    window.addEventListener('online',function(){show('🟢 Connection restored',1800)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
