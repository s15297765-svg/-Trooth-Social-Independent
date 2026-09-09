// Trooth Profile ↔ Home Feed Actions v1
(function(){
  if(window.__troothProfileFeedActionsV1)return;
  window.__troothProfileFeedActionsV1=true;
  function start(){
    if(!location.pathname.endsWith('auth.html')||new URLSearchParams(location.search).get('profile'))return;
    var app=document.getElementById('app');if(!app)return;
    var card=document.createElement('section');card.className='card';card.style.cssText='margin-top:12px';
    card.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap"><a href="index.html" class="btn" style="text-decoration:none;text-align:center;flex:1;min-width:140px">🏠 Home Feed</a><a href="friends.html" class="btn" style="text-decoration:none;text-align:center;flex:1;min-width:140px">👥 Friends</a></div>';
    if(!document.getElementById('trooth-profile-feed-actions')){card.id='trooth-profile-feed-actions';app.appendChild(card)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(start,1400)},{once:true});else setTimeout(start,1400);
  window.addEventListener('trooth-profile-ready',start);
})();
