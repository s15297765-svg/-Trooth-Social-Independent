// Trooth Social Independent — Feed UX polish v1
(function(){
 if(window.__troothFeedUXV1)return;window.__troothFeedUXV1=true;
 function boot(){
  var s=document.createElement('style');
  s.textContent='.trooth-feed-live{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px;padding:9px 12px;border:1px solid #dceee4;background:#f7fcf9;border-radius:13px;color:#35664f;font-size:12px;font-weight:800}.trooth-feed-live i{width:8px;height:8px;border-radius:50%;background:#35a66f;display:inline-block;box-shadow:0 0 0 4px #e2f7eb}.postactions button,.action{touch-action:manipulation}@media(max-width:700px){.postactions{position:sticky;bottom:64px;background:rgba(255,255,255,.96);padding:7px 0;border-top:1px solid #e3eee7;z-index:8}.postactions button,.action{min-height:42px}.postbody{font-size:14px}.postmedia{max-height:420px}}';
  document.head.appendChild(s);
  var feed=document.getElementById('feed');
  if(feed&&!document.querySelector('.trooth-feed-live')){
   var bar=document.createElement('div');bar.className='trooth-feed-live';bar.innerHTML='<span>🌿 Trooth Feed</span><span><i></i> Live updates</span>';feed.parentNode.insertBefore(bar,feed);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
