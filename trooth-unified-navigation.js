// Trooth Social Independent — Unified navigation hub
(function(){
  function boot(){
    if(document.getElementById('trooth-unified-nav'))return;
    var style=document.createElement('style');
    style.textContent='.trooth-unified-wrap{position:fixed;right:16px;bottom:16px;z-index:9999}.trooth-unified-btn{border:0;border-radius:999px;background:#40916c;color:#fff;padding:12px 16px;font-weight:900;box-shadow:0 5px 20px #245c3a33;cursor:pointer}.trooth-unified-panel{display:none;position:absolute;right:0;bottom:52px;width:230px;background:#fff;border:1px solid #d8e9de;border-radius:16px;padding:10px;box-shadow:0 8px 30px #245c3a26}.trooth-unified-panel.open{display:grid;gap:6px}.trooth-unified-panel a{display:block;padding:10px 12px;border-radius:10px;background:#f4faf6;color:#2d6a4f;text-decoration:none;font-weight:800}.trooth-unified-panel a:hover{background:#d8f3dc}.trooth-unified-panel .sep{height:1px;background:#e3eee6;margin:3px 0}@media(max-width:600px){.trooth-unified-wrap{right:10px;bottom:10px}.trooth-unified-panel{width:210px}}';
    document.head.appendChild(style);
    var w=document.createElement('div');w.className='trooth-unified-wrap';w.id='trooth-unified-nav';
    w.innerHTML='<button class="trooth-unified-btn" type="button" aria-expanded="false">🌿 My Trooth</button><div class="trooth-unified-panel"><a href="index.html">🏠 Home Feed</a><a href="auth.html">👤 My Profile</a><a href="friends.html">👥 Friends & Following</a><a href="chat.html">💬 Messages</a><a href="notifications.html">🔔 Notifications</a><a href="saved.html">🔖 Saved Posts</a><a href="activity.html">📊 My Activity</a><div class="sep"></div><a href="settings.html">⚙️ Settings</a></div>';
    document.body.appendChild(w);
    var b=w.querySelector('button'),p=w.querySelector('.trooth-unified-panel');
    b.onclick=function(){var open=p.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false')};
    document.addEventListener('click',function(e){if(!w.contains(e.target)){p.classList.remove('open');b.setAttribute('aria-expanded','false')}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();