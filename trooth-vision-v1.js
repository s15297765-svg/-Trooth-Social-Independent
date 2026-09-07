// Trooth Vision v6 — approved navy + light-green dashboard direction.
(function(){
  if(window.__troothVisionV6)return;
  window.__troothVisionV6=true;
  function addCss(){
    if(!document.querySelector('link[data-trooth-vision]')){
      var l=document.createElement('link');
      l.rel='stylesheet'; l.dataset.troothVision='1';
      l.href='trooth-vision-v1.css?v=6';
      document.head.appendChild(l);
    }
  }
  function loadDream(){
    if(document.querySelector('script[data-trooth-dream-loader]'))return;
    var s=document.createElement('script');
    s.src='trooth-dream-home-v1.js?v=3'; s.async=false;
    s.dataset.troothDreamLoader='1';
    document.head.appendChild(s);
  }
  function activeNav(){
    var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('.menu .nav').forEach(function(a){
      var href=(a.getAttribute('href')||'').split('/').pop().toLowerCase();
      a.classList.toggle('active',href===page);
    });
  }
  function feedTools(){
    var feed=document.getElementById('feed');
    if(!feed||document.querySelector('.feedtools'))return;
    var bar=document.createElement('div');
    bar.className='feedtools';
    bar.innerHTML='<span class="label"><span class="online-dot"></span>Trooth Feed</span><button type="button" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑ Top</button>';
    feed.parentNode.insertBefore(bar,feed);
  }
  function boot(){
    addCss(); loadDream(); activeNav(); feedTools();
    document.body.classList.add('trooth-vision-active');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
