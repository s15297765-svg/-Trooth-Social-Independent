// Trooth Vision v1 — approved navy + light-green dashboard direction.
(function(){
  if(window.__troothVisionV1)return;
  window.__troothVisionV1=true;
  var link=document.createElement('link');
  link.rel='stylesheet';
  link.href='trooth-vision-v1.css?v=2';
  document.head.appendChild(link);
  var dream=document.createElement('script');
  dream.src='trooth-dream-home-v1.js?v=2';
  dream.async=false;
  document.head.appendChild(dream);
  window.addEventListener('load',function(){document.body.classList.add('trooth-vision-active')});
})();
