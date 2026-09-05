// Trooth Social Independent — offline/online app status
(function(){
  function boot(){
    if(window.__troothOfflineStatus)return;window.__troothOfflineStatus=true;
    function show(offline){
      var id='trooth-offline-status',el=document.getElementById(id);
      if(!el){el=document.createElement('div');el.id=id;el.style='position:fixed;left:12px;right:12px;top:58px;z-index:100000;text-align:center;padding:8px 12px;border-radius:999px;font:700 12px system-ui;box-shadow:0 5px 20px #0002;transition:.25s;pointer-events:none';document.body.appendChild(el)}
      el.textContent=offline?'📡 Offline mode — Trooth is still available':'🟢 Back online — Trooth Live';
      el.style.background=offline?'#fff3cd':'#d8f3dc';el.style.color=offline?'#856404':'#173b29';el.style.opacity='1';
      if(!offline)setTimeout(function(){el.style.opacity='0'},2200);
    }
    window.addEventListener('offline',function(){show(true)});
    window.addEventListener('online',function(){show(false);window.dispatchEvent(new CustomEvent('trooth-feed-refresh'))});
    if(!navigator.onLine)show(true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
