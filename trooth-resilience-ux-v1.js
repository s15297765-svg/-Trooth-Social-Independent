// Trooth Social Independent — lightweight resilience UX v1
(function(){
  if(window.__troothResilienceUXV1)return;
  window.__troothResilienceUXV1=true;
  function boot(){
    if(document.getElementById('trooth-resilience-ux-v1'))return;
    var style=document.createElement('style');
    style.id='trooth-resilience-ux-v1';
    style.textContent=''
      +'.trooth-network-status{position:fixed;left:50%;top:76px;transform:translate(-50%,-12px);z-index:220;opacity:0;pointer-events:none;background:#fff;border:1px solid #dceee4;color:#285a43;border-radius:999px;padding:8px 13px;font:800 12px/1.2 system-ui,-apple-system,sans-serif;box-shadow:0 10px 26px rgba(24,91,57,.12);transition:opacity .2s,transform .2s}'
      +'.trooth-network-status.show{opacity:1;transform:translate(-50%,0)}'
      +'.trooth-network-status.offline{background:#fff7f3;border-color:#f0d8cb;color:#8a4b38}'
      +'.trooth-top-btn{position:fixed;right:16px;bottom:82px;z-index:90;width:42px;height:42px;border:1px solid #d7ebdf;border-radius:50%;background:rgba(255,255,255,.95);color:#286447;box-shadow:0 8px 22px rgba(30,90,55,.12);font-size:18px;font-weight:900;cursor:pointer;opacity:0;transform:translateY(8px);pointer-events:none;transition:.2s}'
      +'.trooth-top-btn.show{opacity:1;transform:none;pointer-events:auto}'
      +'@media(max-width:700px){.trooth-network-status{top:70px}.trooth-top-btn{right:12px;bottom:78px;width:40px;height:40px}}';
    document.head.appendChild(style);

    var status=document.createElement('div');
    status.className='trooth-network-status';
    status.setAttribute('role','status');
    status.setAttribute('aria-live','polite');
    document.body.appendChild(status);

    var top=document.createElement('button');
    top.className='trooth-top-btn';
    top.type='button';
    top.setAttribute('aria-label','Back to top');
    top.title='Back to top';
    top.textContent='↑';
    document.body.appendChild(top);
    top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});

    var timer;
    function show(text,offline){
      status.textContent=text;
      status.classList.toggle('offline',!!offline);
      status.classList.add('show');
      clearTimeout(timer);
      if(!offline)timer=setTimeout(function(){status.classList.remove('show');},2200);
    }
    function sync(){
      if(navigator.onLine)show('✓ Connection restored',false);
      else show('⚠ You are offline — changes may wait',true);
    }
    window.addEventListener('offline',function(){show('⚠ You are offline — changes may wait',true);});
    window.addEventListener('online',sync);
    if(!navigator.onLine)show('⚠ You are offline — changes may wait',true);

    function scrollSync(){top.classList.toggle('show',window.scrollY>520);}
    window.addEventListener('scroll',scrollSync,{passive:true});
    scrollSync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
