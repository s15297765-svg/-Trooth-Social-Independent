// Trooth Social Independent — unified professional logo fallback
(function(){
  function apply(){
    document.querySelectorAll('.logo').forEach(function(el){
      // Let the dedicated globe-logo module own elements it has already upgraded.
      if(el.dataset && el.dataset.troothGlobe==='6')return;
      if(el.getAttribute('data-trooth-brand')==='v2')return;
      el.setAttribute('data-trooth-brand','v2');
      el.innerHTML='<img class="trooth-logo-3d" src="assets/trooth-logo-3d.svg?v=20260921-2" alt="Trooth SI">';
      el.title='Trooth SI';
    });
    if(!document.getElementById('trooth-brand-css')){
      var s=document.createElement('style');
      s.id='trooth-brand-css';
      s.textContent='.logo .trooth-logo-3d{display:block;width:250px;height:auto;max-height:58px;object-fit:contain;object-position:left center}@media(max-width:600px){.logo .trooth-logo-3d{width:190px;max-height:52px}}';
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
