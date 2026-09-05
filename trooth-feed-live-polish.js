// Trooth Social Independent — live feed polish: optimistic UI + refresh bridge
(function(){
  if(window.__troothFeedLivePolish)return;window.__troothFeedLivePolish=true;
  function boot(){
    var css=document.createElement('style');css.textContent='.trooth-action-live{transition:transform .12s,background .15s}.trooth-action-live:active{transform:scale(.96)}.trooth-live-toast{position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:9px 15px;border-radius:999px;font:700 12px system-ui;box-shadow:0 8px 24px #0003}.trooth-feed-refreshing{opacity:.72;transition:opacity .2s}';document.head.appendChild(css);
    function toast(t){var x=document.createElement('div');x.className='trooth-live-toast';x.textContent=t;document.body.appendChild(x);setTimeout(function(){x.remove()},2200)}
    function mark(){document.querySelectorAll('button,a').forEach(function(el){var s=(el.textContent||'').toLowerCase();if(/like|comment|share|save|پسند|تبصر|شیئر|محفوظ/.test(s))el.classList.add('trooth-action-live')})}
    function refresh(){window.dispatchEvent(new CustomEvent('trooth-feed-refresh'));mark()}
    window.addEventListener('trooth-message-incoming',function(){toast('💬 New message received')});
    window.addEventListener('trooth-notification-incoming',function(){toast('🔔 New notification')});
    window.addEventListener('online',function(){refresh();toast('🟢 Trooth is live again')});
    window.addEventListener('trooth-feed-refresh',function(){mark()});
    setTimeout(mark,1800);setInterval(mark,5000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
