// Trooth Social Independent — approved green wordmark with twin blue globe O's
(function(){
  if(window.__troothGlobeLogoV4)return;
  window.__troothGlobeLogoV4=true;
  function globe(){
    return '<span class="trooth-globe-o" aria-hidden="true"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18"></circle><ellipse cx="22" cy="22" rx="8" ry="18"></ellipse><path d="M4 22h36M7 14h30M7 30h30"></path></svg></span>';
  }
  function apply(){
    document.querySelectorAll('.logo,.brand').forEach(function(el){
      if(el.dataset.troothGlobe==='4')return;
      el.innerHTML='<span class="trooth-wordmark"><span>Tr</span>'+globe()+globe()+'<span>th</span><small>SI</small></span>';
      el.dataset.troothGlobe='4';
      el.title='Trooth Social Independent';
    });
    if(!document.getElementById('trooth-globe-logo-css')){
      var s=document.createElement('style');s.id='trooth-globe-logo-css';
      s.textContent='.brand .trooth-wordmark,.logo .trooth-wordmark{display:inline-flex;align-items:center;gap:.02em;line-height:.9;font-weight:950;letter-spacing:-1.5px}.brand .trooth-wordmark,.logo .trooth-wordmark{color:#18a957}.brand .trooth-wordmark small,.logo .trooth-wordmark small{font-size:.42em;letter-spacing:.5px;align-self:flex-end;margin:0 0 .08em .18em;color:#18a957}.trooth-globe-o{width:.72em;height:.72em;display:inline-flex;align-items:center;justify-content:center;margin:0 .01em}.trooth-globe-o svg{width:100%;height:100%;fill:none;stroke:#1677d2;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12))}.top .logo .trooth-wordmark{color:#18a957}.top .logo .trooth-globe-o svg{stroke:#1677d2}@media(max-width:600px){.brand .trooth-wordmark,.logo .trooth-wordmark{letter-spacing:-1px}}';
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('trooth-module-loaded',apply);
})();