// Trooth Social Independent — professional twin-globe wordmark
(function(){
  if(window.__troothGlobeLogoV6)return;
  window.__troothGlobeLogoV6=true;
  function apply(){
    document.querySelectorAll('.logo,.brand').forEach(function(el){
      if(el.dataset.troothGlobe==='6')return;
      el.innerHTML='<img class="trooth-logo-3d" src="assets/trooth-logo-3d.svg?v=20260921-2" alt="Trooth SI">';
      el.dataset.troothGlobe='6';
      el.title='Trooth SI';
    });
    if(!document.getElementById('trooth-globe-logo-css')){
      var s=document.createElement('style');
      s.id='trooth-globe-logo-css';
      s.textContent='.trooth-logo-3d{display:block;width:250px;height:auto;max-height:58px;object-fit:contain;object-position:left center}.top .logo,.top .brand{display:flex;align-items:center;min-width:0}.top .logo .trooth-logo-3d,.top .brand .trooth-logo-3d{width:250px}@media(max-width:600px){.trooth-logo-3d,.top .logo .trooth-logo-3d,.top .brand .trooth-logo-3d{width:190px;max-height:52px}}';
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('trooth-module-loaded',apply);
})();