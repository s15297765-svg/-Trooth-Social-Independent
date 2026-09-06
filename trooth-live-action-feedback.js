// Trooth Social Independent — instant action feedback layer v4
(function(){
  if(window.__troothLiveActionFeedbackV4)return;window.__troothLiveActionFeedbackV4=true;
  var timer;
  function toast(text){
    clearTimeout(timer);var t=document.getElementById('trooth-action-toast');
    if(!t){t=document.createElement('div');t.id='trooth-action-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.style.cssText='position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:100000;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 24px);text-align:center;transition:opacity .2s;pointer-events:none';document.body.appendChild(t)}
    t.textContent=text;t.style.opacity='1';timer=setTimeout(function(){t.style.opacity='0'},1800);
  }
  function textOf(b){return ((b.getAttribute('aria-label')||'')+' '+(b.title||'')+' '+(b.textContent||'')).toLowerCase()}
  function markBusy(b){if(!b||b.disabled||b.getAttribute('aria-disabled')==='true'||b.dataset.troothBusy==='1')return false;b.dataset.troothBusy='1';b.setAttribute('aria-busy','true');setTimeout(function(){delete b.dataset.troothBusy;b.removeAttribute('aria-busy')},900);return true}
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('button,[role="button"]');if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return;
    var s=textOf(b),msg='';
    if(s.indexOf('like')>-1||s.indexOf('unlike')>-1||s.indexOf('❤️')>-1||s.indexOf('💚')>-1)msg='❤️ Like updated';
    else if(s.indexOf('comment')>-1||s.indexOf('💬')>-1)msg='💬 Comment opened';
    else if(s.indexOf('share')>-1||s.indexOf('🔄')>-1)msg='🔄 Share action ready';
    else if(s.indexOf('save')>-1||s.indexOf('bookmark')>-1||s.indexOf('🔖')>-1)msg='🔖 Save updated';
    if(!msg||!markBusy(b))return;toast(msg);
  });
  window.addEventListener('trooth-content-interaction-refresh',function(){toast('🟢 Live interaction synced')});
  window.addEventListener('trooth-auth-changed',function(){toast('🔐 Account status updated')});
})();
