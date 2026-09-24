// Trooth Social Independent — profile completion banner disabled
// The normal Profile page remains available; the extra "پروفائل مکمل کریں" banner is intentionally removed.
(function(){
  function removeBanner(){
    var el=document.getElementById('trooth-profile-completion');
    if(el)el.remove();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeBanner,{once:true});else removeBanner();
  window.addEventListener('trooth-supabase-ready',removeBanner);
  window.addEventListener('trooth-module-loaded',removeBanner);
})();