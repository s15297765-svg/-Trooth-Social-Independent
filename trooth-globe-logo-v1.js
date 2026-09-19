// Trooth Social Independent — blue globe wordmark v2
(function(){
  if(window.__troothGlobeLogoV2)return;
  window.__troothGlobeLogoV2=true;
  function apply(){
    document.querySelectorAll('.logo').forEach(function(el){
      if(el.dataset.troothGlobe==='2')return;
      el.innerHTML='<span class="trooth-wordmark" aria-label="Trooth"><span>Tr</span><span class="trooth-globe-o" aria-hidden="true"><svg viewBox="0 0 64 64" role="img"><circle cx="32" cy="32" r="25"></circle><ellipse cx="32" cy="32" rx="11" ry="25"></ellipse><path d="M7 32h50M11 20h42M11 44h42"></path></svg></span><span>th</span></span>';
      el.dataset.troothGlobe='2';
    });
    if(!document.getElementById('trooth-globe-logo-css')){
      var s=document.createElement('style');
      s.id='trooth-globe-logo-css';
      s.textContent='.logo{display:flex;align-items:center;white-space:nowrap}.trooth-wordmark{display:inline-flex;align-items:center;font-weight:900;letter-spacing:-.8px;line-height:1}.trooth-globe-o{width:1.08em;height:1.08em;display:inline-grid;place-items:center;margin:0 .02em;transform:translateY(.02em)}.trooth-globe-o svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;color:#dbeafe;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18))}.top .logo .trooth-globe-o svg{color:#eff6ff}.trooth-wordmark span{display:inline-block}';
      document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('trooth-module-loaded',apply);
})();
