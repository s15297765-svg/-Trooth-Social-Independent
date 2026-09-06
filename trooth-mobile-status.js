(function(){
  'use strict';
  if(window.__troothMobileStatusLoaded)return;
  window.__troothMobileStatusLoaded=true;
  function ready(){
    if(document.getElementById('trooth-mobile-status'))return;
    var bar=document.createElement('div');
    bar.id='trooth-mobile-status';
    bar.setAttribute('role','status');
    bar.setAttribute('aria-live','polite');
    bar.style.cssText='position:fixed;left:10px;right:10px;bottom:76px;z-index:9998;display:none;padding:9px 12px;border-radius:12px;background:#1b7f52;color:#fff;font:700 13px Arial,sans-serif;box-shadow:0 6px 20px #245c3a30;text-align:center;pointer-events:none';
    document.body.appendChild(bar);
    window.troothMobileStatus=function(message,ms){
      if(!message)return;
      bar.textContent=message;
      bar.style.display='block';
      clearTimeout(window.__troothStatusTimer);
      window.__troothStatusTimer=setTimeout(function(){bar.style.display='none'},ms||1800);
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
