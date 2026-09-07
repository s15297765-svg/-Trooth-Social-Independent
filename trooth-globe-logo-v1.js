// Trooth Social Independent — blue globe logo polish v1
(function(){
  if(window.__troothGlobeLogoV1)return;
  window.__troothGlobeLogoV1=true;
  function apply(){
    document.querySelectorAll('.logo').forEach(function(el){
      if(el.dataset.troothGlobe==='1')return;
      el.innerHTML='<span class="trooth-globe" aria-hidden="true">🌐</span><span>Trooth</span>';
      el.dataset.troothGlobe='1';
    });
    if(!document.getElementById('trooth-globe-logo-css')){
      var s=document.createElement('style');
      s.id='trooth-globe-logo-css';
      s.textContent='.trooth-globe{display:inline-grid;place-items:center;font-size:.9em;line-height:1;margin-right:5px;filter:saturate(1.15)}.logo{display:flex;align-items:center;white-space:nowrap}';
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('trooth-module-loaded',apply);
})();
