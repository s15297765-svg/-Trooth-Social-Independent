// Trooth Social Independent — unified live event toasts
(function(){
  function boot(){
    if(window.__troothLiveToast)return;window.__troothLiveToast=true;
    var css=document.createElement('style');css.textContent='.trooth-live-toast2{position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:100000;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 12px system-ui;box-shadow:0 8px 28px #0003;animation:troothToastIn .2s ease}@keyframes troothToastIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}';document.head.appendChild(css);
    function show(text){var x=document.createElement('div');x.className='trooth-live-toast2';x.textContent=text;document.body.appendChild(x);setTimeout(function(){x.remove()},2400)}
    window.addEventListener('trooth-message-incoming',function(){show('💬 New message received')});
    window.addEventListener('trooth-notification-incoming',function(){show('🔔 New notification')});
    window.addEventListener('trooth-realtime-connected',function(){show('🟢 Trooth is LIVE')});
    window.addEventListener('offline',function(){show('○ You are offline')});
    window.addEventListener('online',function(){show('🟢 Connection restored')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
