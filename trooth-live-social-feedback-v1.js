(function(){
  'use strict';
  if(window.__troothLiveSocialFeedbackV1)return;
  window.__troothLiveSocialFeedbackV1=true;

  function toast(message){
    var old=document.getElementById('trooth-live-feedback-toast');
    if(old)old.remove();
    var el=document.createElement('div');
    el.id='trooth-live-feedback-toast';
    el.textContent=message;
    el.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:9999;background:#247a49;color:#fff;padding:10px 16px;border-radius:999px;font:600 13px system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.18);opacity:0;transition:opacity .2s ease';
    document.body.appendChild(el);
    requestAnimationFrame(function(){el.style.opacity='1'});
    setTimeout(function(){el.style.opacity='0';setTimeout(function(){el.remove()},220)},1800);
  }

  function markAction(target,label){
    if(!target)return;
    target.setAttribute('aria-pressed','true');
    target.dataset.troothActive='1';
    if(label)toast(label);
  }

  document.addEventListener('click',function(e){
    var el=e.target.closest && e.target.closest('[data-action="like"],[data-action="share"],[data-action="save"],[data-trooth-action="like"],[data-trooth-action="share"],[data-trooth-action="save"]');
    if(!el)return;
    var action=el.dataset.action||el.dataset.troothAction;
    if(action==='like')markAction(el,'👍 پسند محفوظ');
    if(action==='save')markAction(el,'🔖 محفوظ کر لیا گیا');
    if(action==='share')toast('↗️ شیئر آپشن تیار ہے');
  },true);

  window.addEventListener('online',function(){toast('🟢 Trooth دوبارہ آن لائن ہے')});
  window.addEventListener('offline',function(){toast('🟠 آف لائن — دوبارہ کنکشن کا انتظار ہے')});
})();
