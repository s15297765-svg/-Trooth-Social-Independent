// Trooth Social Independent — composer UX polish v1
(function(){
  if(window.__troothComposerUxV1)return;
  window.__troothComposerUxV1=true;
  function wire(){
    var box=document.getElementById('postInput');
    if(!box||box.dataset.troothComposerUx==='1')return;
    box.dataset.troothComposerUx='1';
    function resize(){box.style.height='auto';box.style.height=Math.min(Math.max(box.scrollHeight,54),180)+'px'}
    box.addEventListener('input',resize);
    box.addEventListener('keydown',function(e){
      if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){
        e.preventDefault();
        if(typeof window.publishPost==='function')window.publishPost();
      }
    });
    resize();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
  window.addEventListener('trooth-module-loaded',wire);
  window.addEventListener('trooth-supabase-ready',wire);
})();