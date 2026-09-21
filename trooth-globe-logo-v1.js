// Trooth Social Independent — approved 3D green wordmark with twin blue globe O's
(function(){
  if(window.__troothGlobeLogoV5)return;
  window.__troothGlobeLogoV5=true;
  function apply(){
    document.querySelectorAll('.logo,.brand').forEach(function(el){
      if(el.dataset.troothGlobe==='5')return;
      el.innerHTML='<img class="trooth-logo-3d" src="assets/trooth-logo-3d.svg?v=20260921" alt="Trooth Social Independent">';
      el.dataset.troothGlobe='5';
      el.title='Trooth Social Independent';
    });
    if(!document.getElementById('trooth-globe-logo-css')){
      var s=document.createElement('style');s.id='trooth-globe-logo-css';
      s.textContent='.trooth-logo-3d{display:block;width:220px;height:auto;max-height:58px;object-fit:contain;object-position:left center}.top .logo,.top .brand{display:flex;align-items:center;min-width:0}.top .logo .trooth-logo-3d,.top .brand .trooth-logo-3d{width:220px}@media(max-width:600px){.trooth-logo-3d,.top .logo .trooth-logo-3d,.top .brand .trooth-logo-3d{width:175px;max-height:52px}}';
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('trooth-module-loaded',apply);
})();