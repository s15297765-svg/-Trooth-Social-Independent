// Trooth Social Independent — green brand logo
(function(){
  function apply(){
    document.querySelectorAll('.logo').forEach(function(el){
      if(el.getAttribute('data-trooth-brand')==='v1')return;
      el.setAttribute('data-trooth-brand','v1');
      el.innerHTML='<span style="display:inline-flex;align-items:center;gap:8px;line-height:1"><span aria-hidden="true" style="width:34px;height:34px;border-radius:10px;background:#fff;display:grid;place-items:center;box-shadow:0 3px 10px rgba(20,82,56,.16);font-size:21px;font-weight:950;color:#27845b">T</span><span style="font-weight:950;letter-spacing:-1px;color:#fff">Trooth</span></span>';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
