// Trooth Social Independent — premium globe wordmark v3
(function(){
  if(window.__troothGlobeLogoV3)return;
  window.__troothGlobeLogoV3=true;
  function apply(){
    document.querySelectorAll('.logo').forEach(function(el){
      if(el.dataset.troothGlobe==='3')return;
      el.innerHTML='<span class="trooth-wordmark" aria-label="Trooth Social Independent"><span class="trooth-prefix">Tr</span><span class="trooth-oo" aria-hidden="true"><span class="trooth-o">o</span><span class="trooth-o">o</span><svg viewBox="0 0 110 64" role="img"><ellipse cx="55" cy="32" rx="49" ry="25"></ellipse><ellipse cx="55" cy="32" rx="18" ry="25"></ellipse><path d="M6 32h98M14 20h82M14 44h82"></path></svg></span><span class="trooth-suffix">th</span></span>';
      el.dataset.troothGlobe='3';
      el.title='Trooth Social Independent';
    });
    if(!document.getElementById('trooth-globe-logo-css')){
      var s=document.createElement('style');
      s.id='trooth-globe-logo-css';
      s.textContent='.logo{display:flex;align-items:center;white-space:nowrap}.trooth-wordmark{display:inline-flex;align-items:center;font-weight:950;letter-spacing:-1px;line-height:1}.trooth-prefix,.trooth-suffix{display:inline-block}.trooth-oo{position:relative;width:2.08em;height:1.08em;display:inline-flex;align-items:center;justify-content:center;margin:0 .01em;line-height:1}.trooth-oo .trooth-o{font-size:1em;font-weight:950;color:currentColor;opacity:.16;position:absolute;top:0}.trooth-oo .trooth-o:first-child{left:.05em}.trooth-oo .trooth-o:nth-child(2){right:.05em}.trooth-oo svg{position:absolute;width:100%;height:100%;inset:0;fill:none;stroke:currentColor;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;color:#b7f7d2;filter:drop-shadow(0 1px 1px rgba(0,0,0,.16));pointer-events:none}.top .logo .trooth-oo svg{color:#eafff2}.trooth-wordmark span{display:inline-block}@media(max-width:600px){.trooth-wordmark{letter-spacing:-.7px}}';
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('trooth-module-loaded',apply);
})();
