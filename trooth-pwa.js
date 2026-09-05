// Trooth Social Independent — app-like PWA bootstrap
(function(){
  function boot(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('sw.js',{scope:'/-Trooth-Social-Independent/'}).catch(function(){});
    }
    if(!document.querySelector('link[rel="manifest"]')){
      var m=document.createElement('link');m.rel='manifest';m.href='manifest.webmanifest';document.head.appendChild(m);
    }
    var meta=document.createElement('meta');meta.name='theme-color';meta.content='#40916c';document.head.appendChild(meta);
    var ios=document.createElement('meta');ios.name='apple-mobile-web-app-capable';ios.content='yes';document.head.appendChild(ios);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
