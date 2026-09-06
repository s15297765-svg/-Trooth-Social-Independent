// Trooth Social Independent — final completion polish v1
(function(){
  if(window.__troothFinalCompletionPolishV1)return;window.__troothFinalCompletionPolishV1=true;
  function polish(){
    document.documentElement.style.scrollBehavior='smooth';
    document.querySelectorAll('button').forEach(function(b){
      if(!b.getAttribute('aria-label')){
        var t=(b.textContent||'').trim().replace(/\s+/g,' ');
        if(t)b.setAttribute('aria-label',t);
      }
    });
    document.querySelectorAll('input,textarea').forEach(function(el){
      if(!el.getAttribute('aria-label')){
        var p=el.getAttribute('placeholder');
        if(p)el.setAttribute('aria-label',p);
      }
    });
    document.querySelectorAll('img').forEach(function(img){
      if(!img.getAttribute('alt'))img.setAttribute('alt','Trooth image');
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish,{once:true});else polish();
  window.addEventListener('trooth-module-loaded',polish);
})();
