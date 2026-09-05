// Trooth Social Independent — smart feed action bridge
(function(){
  function boot(){
    if(window.__troothSmartActions)return;window.__troothSmartActions=true;
    function wire(){
      document.querySelectorAll('button,a').forEach(function(el){
        if(el.dataset.troothSmart)return;
        var t=(el.textContent||el.getAttribute('aria-label')||'').toLowerCase();
        if(!/like|comment|share|save|پسند|تبصر|شیئر|محفوظ/.test(t))return;
        el.dataset.troothSmart='1';
        el.addEventListener('click',function(){
          el.style.transform='scale(.96)';setTimeout(function(){el.style.transform=''},130);
          window.dispatchEvent(new CustomEvent('trooth-feed-action',{detail:{action:t}}));
        });
      });
    }
    wire();setInterval(wire,3000);
    window.addEventListener('trooth-feed-refresh',wire);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
