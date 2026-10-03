// Trooth Social Independent — profile completion banner disabled
// The normal Profile page remains available; legacy "Complete profile" prompts are removed.
(function(){
  if(window.__troothProfileCompletionGuardV2)return;
  window.__troothProfileCompletionGuardV2=true;

  function removeBanner(){
    var exactIds=[
      'trooth-profile-completion',
      'profile-completion',
      'complete-profile',
      'completeProfile',
      'trooth-complete-profile'
    ];
    exactIds.forEach(function(id){
      var el=document.getElementById(id);
      if(el)el.remove();
    });

    var nodes=document.querySelectorAll('body *');
    nodes.forEach(function(el){
      if(!el||el.children.length>0)return;
      var t=(el.textContent||'').trim().toLowerCase();
      if(!t)return;
      if(
        t==='complete profile' ||
        t==='complete your profile' ||
        t==='پروفائل مکمل کریں' ||
        t==='اپنا پروفائل مکمل کریں'
      ){
        var box=el.closest('.card,.banner,.notice,.alert,.profile-completion,[data-profile-completion]');
        if(box&&box!==document.body)box.remove();
        else el.remove();
      }
    });
  }

  function schedule(){
    removeBanner();
    setTimeout(removeBanner,250);
    setTimeout(removeBanner,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();

  window.addEventListener('trooth-supabase-ready',schedule);
  window.addEventListener('trooth-module-loaded',schedule);

  var observer=new MutationObserver(function(){
    removeBanner();
  });
  function observe(){
    if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});
  else observe();
})();