// Trooth Vision v1 — light-green visual direction inspired by the approved social dashboard vision.
(function(){
  if(window.__troothVisionV1)return;
  window.__troothVisionV1=true;
  var link=document.createElement('link');
  link.rel='stylesheet';
  link.href='trooth-vision-v1.css?v=1';
  document.head.appendChild(link);
  window.addEventListener('load',function(){
    document.body.classList.add('trooth-vision-active');
  });
})();
