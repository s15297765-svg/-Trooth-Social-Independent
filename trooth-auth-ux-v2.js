// Trooth Social Independent — auth UX polish v2
(function(){
  if(window.__troothAuthUxV2)return;
  window.__troothAuthUxV2=true;
  function wire(){
    var pass=document.getElementById('password');
    if(!pass||pass.dataset.troothPasswordUx==='1')return;
    pass.dataset.troothPasswordUx='1';
    var wrap=pass.parentElement;
    if(!wrap)return;
    wrap.style.position='relative';
    pass.style.paddingRight='48px';
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='trooth-password-toggle';
    btn.setAttribute('aria-label','Show password');
    btn.textContent='👁️';
    btn.style.cssText='position:absolute;right:7px;top:50%;transform:translateY(-50%);border:0;background:transparent;cursor:pointer;font-size:18px;padding:7px;border-radius:8px;line-height:1';
    btn.addEventListener('click',function(){
      var showing=pass.type==='text';
      pass.type=showing?'password':'text';
      btn.textContent=showing?'👁️':'🙈';
      btn.setAttribute('aria-label',showing?'Show password':'Hide password');
      pass.focus();
    });
    wrap.appendChild(btn);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
  window.addEventListener('trooth-module-loaded',wire);
  window.addEventListener('trooth-supabase-ready',wire);
})();
