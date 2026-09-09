// Trooth Profile ↔ Home Feed Link v1
(function(){
  if(window.__troothProfileFeedLinkV1)return;
  window.__troothProfileFeedLinkV1=true;
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn()}
  async function start(){
    if(!location.pathname.endsWith('auth.html'))return;
    if(!window.troothSupabase)return;
    var app=document.getElementById('app'); if(!app)return;
    var qs=new URLSearchParams(location.search);
    if(qs.get('profile'))return;
    try{
      var r=await window.troothSupabase.auth.getUser(),u=r.data&&r.data.user;
      if(!u)return;
      var links=app.querySelectorAll('a,button');
      links.forEach(function(el){
        var t=(el.textContent||'').trim().toLowerCase();
        if(t==='home'||t.indexOf('home feed')>=0||t.indexOf('ہوم')>=0){
          if(el.tagName==='A')el.setAttribute('href','index.html');
          else el.addEventListener('click',function(){location.href='index.html'});
        }
      });
      var home=document.createElement('a');
      home.href='index.html';home.textContent='🏠 Home Feed';
      home.style.cssText='display:block;margin:14px 0;padding:12px 14px;border-radius:12px;background:#e3f7ea;color:#145c35;text-decoration:none;font-weight:800;text-align:center';
      if(!document.getElementById('trooth-profile-home-link')){home.id='trooth-profile-home-link';app.insertBefore(home,app.firstChild)}
    }catch(e){console.warn('Trooth profile-feed link',e)}
  }
  ready(function(){setTimeout(start,900);setTimeout(start,2200)});
  window.addEventListener('trooth-profile-ready',start);
})();
