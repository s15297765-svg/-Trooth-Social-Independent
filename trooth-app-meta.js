// Trooth Social Independent — app/mobile metadata enhancement
(function(){
  function boot(){
    if(window.__troothAppMeta)return;window.__troothAppMeta=true;
    function meta(name,content){if(!document.querySelector('meta[name="'+name+'"]')){var m=document.createElement('meta');m.name=name;m.content=content;document.head.appendChild(m)}}
    meta('mobile-web-app-capable','yes');
    meta('apple-mobile-web-app-status-bar-style','default');
    meta('apple-mobile-web-app-title','Trooth');
    meta('application-name','Trooth');
    meta('format-detection','telephone=no');
    if(!document.querySelector('meta[name="viewport"]')){var v=document.createElement('meta');v.name='viewport';v.content='width=device-width,initial-scale=1,viewport-fit=cover';document.head.appendChild(v)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
