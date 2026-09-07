// Trooth Dream Pages v1 — shared light-green polish + responsive mobile navigation.
(function(){
  if(window.__troothDreamPagesV1)return;
  window.__troothDreamPagesV1=true;
  var css=document.createElement('link');css.rel='stylesheet';css.href='trooth-dream-pages-v1.css?v=2';document.head.appendChild(css);
  function addNav(){
    if(window.innerWidth>650||document.querySelector('.dream-mobile-nav'))return;
    var path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    var n=document.createElement('nav');n.className='dream-mobile-nav';
    var items=[
      ['index.html','⌂','Home'],
      ['friends.html','👥','Friends'],
      ['chat.html','💬','Messages'],
      ['notifications-messages.html','🔔','Alerts'],
      ['profile.html','👤','Profile']
    ];
    n.innerHTML=items.map(function(x){var active=path===x[0]?' active':'';return '<a class="'+active.trim()+'" href="'+x[0]+'"><b>'+x[1]+'</b>'+x[2]+'</a>'}).join('');
    document.body.appendChild(n);
  }
  window.addEventListener('load',addNav);window.addEventListener('resize',addNav);
})();
