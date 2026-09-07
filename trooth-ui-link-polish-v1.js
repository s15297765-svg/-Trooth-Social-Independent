// Trooth UI Link Polish v1 — keeps Home navigation consistent and activates profile visual polish.
(function(){
  if(window.__troothUILinkPolishV1)return;
  window.__troothUILinkPolishV1=true;
  function fixLinks(){
    document.querySelectorAll('a,button').forEach(function(el){
      var t=(el.getAttribute('title')||'').toLowerCase();
      var txt=(el.textContent||'').trim().toLowerCase();
      if(t==='messages'||txt==='💬 messages'){
        if(el.tagName==='A')el.href='chat.html';
        else if(el.getAttribute('onclick'))el.setAttribute('onclick',"location.href='chat.html'");
      }
    });
  }
  function profilePolish(){
    if(!/profile\.html$/i.test(location.pathname))return;
    if(document.getElementById('trooth-profile-polish-v1'))return;
    var l=document.createElement('link');
    l.id='trooth-profile-polish-v1';
    l.rel='stylesheet';
    l.href='trooth-profile-polish-v1.css?v=1';
    document.head.appendChild(l);
  }
  window.addEventListener('DOMContentLoaded',function(){fixLinks();profilePolish();});
  window.addEventListener('load',function(){fixLinks();profilePolish();});
})();
