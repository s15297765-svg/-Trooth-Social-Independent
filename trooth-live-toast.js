// Trooth Social Independent — unified live event toasts v6
(function(){
  function boot(){
    if(window.__troothLiveToast)return;window.__troothLiveToast=true;
    var css=document.createElement('style');css.textContent='.trooth-live-toast2{position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:100000;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 12px system-ui;box-shadow:0 8px 28px #0003;animation:troothToastIn .2s ease;max-width:calc(100vw - 28px);text-align:center;pointer-events:none}.trooth-live-toast2.hide{opacity:0;transform:translate(-50%,6px);transition:.2s}@keyframes troothToastIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}@media(max-width:600px){.trooth-live-toast2{bottom:72px;font-size:11px;padding:9px 13px}}';document.head.appendChild(css);
    var last='',lastAt=0,timer=null,seq=0,lastLiveAt=0;
    function show(text,ttl,key){var now=Date.now();key=key||text;if(!text)return;if(key==='live'&&now-lastLiveAt<5000)return;if(text===last&&now-lastAt<2500)return;last=text;lastAt=now;if(key==='live')lastLiveAt=now;seq++;var mine=seq,old=document.querySelector('.trooth-live-toast2');if(old){old.classList.add('hide');setTimeout(function(){if(old.parentNode)old.remove()},180)}var x=document.createElement('div');x.className='trooth-live-toast2';x.setAttribute('role','status');x.setAttribute('aria-live','polite');x.setAttribute('aria-atomic','true');x.textContent=text;document.body.appendChild(x);clearTimeout(timer);timer=setTimeout(function(){if(mine===seq&&x.parentNode){x.classList.add('hide');setTimeout(function(){if(x.parentNode)x.remove()},220)}},ttl||2400)}
    window.troothLiveToast=show;
    window.addEventListener('trooth-message-incoming',function(){show('💬 New message received',2400,'message')});
    window.addEventListener('trooth-notification-incoming',function(){show('🔔 New notification',2400,'notification')});
    window.addEventListener('trooth-realtime-connected',function(){show('🟢 Trooth is LIVE',1600,'live')});
    window.addEventListener('trooth-realtime-status',function(e){var s=e.detail&&e.detail.status;if(s==='CONNECTING')show('🟡 Connecting…',1800,'connecting');else if(s==='RECONNECTING')show('🟠 Reconnecting…',2000,'reconnecting');else if(s==='RETRYING'){var a=e.detail&&e.detail.attempt;show('🟠 Retrying'+(a?' · attempt '+a:'')+'…',2000,'retrying');}else if(s==='OFFLINE')show('⚪ You are offline',2200,'offline');else if(s==='SIGNED_OUT')show('⚪ Signed out',1800,'signed-out')});
    window.addEventListener('trooth-content-interaction-refresh',function(){show('🟢 Interaction synced',1500,'interaction')});
    window.addEventListener('trooth-auth-changed',function(){show('🔐 Account status updated',1500,'auth')});
    window.addEventListener('trooth-unread-updated',function(e){var n=e.detail&&e.detail.count;if(Number(n)>0)show('💬 '+(Number(n)>99?'99+':n)+' unread message'+(Number(n)===1?'':'s'),1600,'unread')});
    window.addEventListener('trooth-live-refresh-complete',function(){show('🟢 Live feed synced',1200,'feed-sync')});
    window.addEventListener('offline',function(){show('⚪ You are offline',2200,'offline')});
    window.addEventListener('online',function(){show('🟢 Connection restored',1800,'restored')});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&navigator.onLine)show('🟢 Trooth is LIVE',1200,'live')});
    window.addEventListener('pageshow',function(){if(navigator.onLine)show('🟢 Trooth is LIVE',1200,'live')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
