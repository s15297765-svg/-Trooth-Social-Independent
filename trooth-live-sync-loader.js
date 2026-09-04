/* Loader for Trooth live sync */
(function(){
  if(document.querySelector('script[data-trooth-live-sync]')) return;
  const s=document.createElement('script');
  s.src='trooth-live-sync.js';
  s.async=true;
  s.dataset.troothLiveSync='1';
  document.head.appendChild(s);
})();
