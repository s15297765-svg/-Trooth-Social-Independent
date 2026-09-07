// Trooth Social Independent — auth UX polish v1
(function(){
  if(window.__troothAuthUxV1)return;
  window.__troothAuthUxV1=true;
  function wire(){
    var phone=document.getElementById('phone');
    var pass=document.getElementById('password');
    if(!phone||!pass||phone.dataset.troothAuthUx==='1')return;
    phone.dataset.troothAuthUx='1';
    function submit(){
      var btn=document.getElementById('loginBtn');
      if(btn&&!btn.disabled&&typeof window.login==='function')window.login();
    }
    phone.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();pass.focus()}});
    pass.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();submit()}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
  window.addEventListener('trooth-module-loaded',wire);
})();
