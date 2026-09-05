// Trooth Social Independent — smart feed action bridge v2
(function(){
  function boot(){
    if(window.__troothSmartActionsV2)return;window.__troothSmartActionsV2=true;
    var timer=null;
    function wire(){
      clearTimeout(timer);timer=setTimeout(function(){
        document.querySelectorAll('button,a').forEach(function(el){
          if(el.dataset.troothSmart)return;
          var t=(el.textContent||el.getAttribute('aria-label')||el.getAttribute('title')||'').toLowerCase();
          if(!/like|comment|share|save|پسند|تبصر|شیئر|محفوظ/.test(t))return;
          el.dataset.troothSmart='1';
          el.addEventListener('click',function(){
            el.style.transform='scale(.96)';setTimeout(function(){el.style.transform=''},130);
            window.dispatchEvent(new CustomEvent('trooth-feed-action',{detail:{action:t}}));
          });
        });
      },80);
    }
    wire();
    window.addEventListener('trooth-feed-refresh',wire);
    window.addEventListener('trooth-feed-smart-refresh',wire);
    window.addEventListener('trooth-home-feed-refresh',wire);
    new MutationObserver(wire).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
