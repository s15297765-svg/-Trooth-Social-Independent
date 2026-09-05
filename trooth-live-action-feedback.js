// Trooth Social Independent — instant action feedback layer v2
(function(){
  if(window.__troothLiveActionFeedback)return;window.__troothLiveActionFeedback=true;
  var timer;
  function toast(text){clearTimeout(timer);var t=document.getElementById('trooth-action-toast');if(!t){t=document.createElement('div');t.id='trooth-action-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.style.cssText='position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:100000;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 24px);text-align:center;transition:opacity .2s';document.body.appendChild(t)}t.textContent=text;t.style.opacity='1';timer=setTimeout(function(){t.style.opacity='0'},1800)}
  function textOf(b){return ((b.getAttribute('aria-label')||'')+' '+(b.title||'')+' '+(b.textContent||'')).toLowerCase()}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button,[role="button"]');if(!b)return;var s=textOf(b);if(s.indexOf('like')>-1||s.indexOf('unlike')>-1||s.indexOf('❤️')>-1||s.indexOf('💚')>-1)toast('❤️ Live Like updated');else if(s.indexOf('comment')>-1||s.indexOf('💬')>-1)toast('💬 Comment action ready');else if(s.indexOf('share')>-1||s.indexOf('🔄')>-1)toast('🔄 Share ready')});
  window.addEventListener('trooth-content-interaction-refresh',function(){toast('🟢 Live interaction synced')});
  window.addEventListener('trooth-auth-changed',function(){toast('🔐 Account status updated')});
})();
