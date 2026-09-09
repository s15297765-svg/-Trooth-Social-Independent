// Trooth final polish — prevent endless loading states and keep mobile UI responsive.
(function(){
  if(window.__troothFinalPolishV1)return;
  window.__troothFinalPolishV1=true;
  var started=Date.now();
  function textOf(el){return (el&&el.textContent||'').trim().toLowerCase()}
  function fallback(el,label){
    if(!el||el.dataset.troothSettled)return;
    el.dataset.troothSettled='1';
    el.innerHTML='<div style="padding:16px;border:1px solid #e3eee7;border-radius:14px;background:#f8fcf9;text-align:center;color:#718276;font-size:13px">'+label+' ابھی دستیاب نہیں۔ دوبارہ کوشش کریں۔<br><button type="button" style="margin-top:10px;border:0;border-radius:10px;padding:9px 13px;background:#27845b;color:#fff;font-weight:800;cursor:pointer" onclick="location.reload()">↻ دوبارہ کوشش</button></div>';
  }
  function scan(){
    var nodes=document.querySelectorAll('#feed,#newsHub,#sportsHub,#storesHub,[data-loading],.loading');
    nodes.forEach(function(el){
      if(el.dataset.troothFinalTimer)return;
      var t=textOf(el);
      if(t==='loading...'||t.indexOf('loading your trooth feed')===0||t.indexOf('loading profile')===0||t.indexOf('loading...')===0){
        el.dataset.troothFinalTimer='1';
        setTimeout(function(){
          if(!el.dataset.troothSettled){
            var now=textOf(el);
            if(now.indexOf('loading')!==-1)fallback(el,el.id==='feed'?'Feed':el.id==='newsHub'?'News':el.id==='sportsHub'?'Sports':el.id==='storesHub'?'Marketplace':'Profile');
          }
        },9000);
      }
    });
  }
  function boot(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
