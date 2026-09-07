// Trooth Social Independent — Unified navigation hub v3
(function(){
  function boot(){
    if(document.getElementById('trooth-unified-nav'))return;
    var style=document.createElement('style');style.textContent=`
      .trooth-unified-wrap{position:fixed;right:16px;bottom:18px;z-index:9999;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
      .trooth-unified-btn{display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.55);border-radius:999px;background:linear-gradient(135deg,#27845b,#55b982);color:#fff;padding:12px 17px;font-weight:900;letter-spacing:.1px;box-shadow:0 10px 28px rgba(39,132,91,.25);cursor:pointer;transition:transform .18s,box-shadow .18s}
      .trooth-unified-btn:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(39,132,91,.3)}
      .trooth-unified-panel{display:none;position:absolute;right:0;bottom:58px;width:270px;max-height:76vh;overflow:auto;background:rgba(255,255,255,.97);backdrop-filter:blur(18px);border:1px solid #d8e9de;border-radius:22px;padding:10px;box-shadow:0 18px 48px rgba(20,82,56,.18)}
      .trooth-unified-panel.open{display:grid;gap:5px;animation:troothMenuIn .16s ease-out}
      @keyframes troothMenuIn{from{opacity:0;transform:translateY(7px) scale(.98)}to{opacity:1;transform:none}}
      .trooth-unified-panel a{display:flex;align-items:center;gap:9px;padding:11px 12px;border-radius:13px;background:#f6fbf8;color:#285b43;text-decoration:none;font-weight:800;font-size:13px;transition:.16s}
      .trooth-unified-panel a:hover{background:#e3f8eb;color:#145238;transform:translateX(2px)}
      .trooth-unified-panel .sep{height:1px;background:#e3eee6;margin:5px 2px}.trooth-unified-panel .label{padding:7px 10px 3px;color:#718276;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.7px}
      @media(max-width:700px){.trooth-unified-wrap{right:10px;bottom:76px}.trooth-unified-btn{padding:11px 14px;font-size:12px}.trooth-unified-panel{width:min(280px,calc(100vw - 20px));max-height:70vh}}
    `;document.head.appendChild(style);
    var w=document.createElement('div');w.className='trooth-unified-wrap';w.id='trooth-unified-nav';
    w.innerHTML=`<button class="trooth-unified-btn" type="button" aria-expanded="false" aria-controls="trooth-unified-panel">🌿 <span>My Trooth</span></button><div class="trooth-unified-panel" id="trooth-unified-panel" role="menu"><div class="label">Social</div><a role="menuitem" href="index.html">🏠 Home Feed</a><a role="menuitem" href="auth.html">👤 My Profile</a><a role="menuitem" href="friends.html">👥 Friends & Following</a><a role="menuitem" href="chat.html">💬 Messages</a><a role="menuitem" href="notifications-messages.html">🔔 Notifications & Messages</a><a role="menuitem" href="saved.html">🔖 Saved Posts</a><a role="menuitem" href="activity.html">📊 My Activity</a><div class="sep"></div><div class="label">Trooth Network</div><a role="menuitem" href="news.html">📰 News</a><a role="menuitem" href="sports.html">🏆 Sports</a><a role="menuitem" href="business.html">💼 Business</a><a role="menuitem" href="stores.html">🛍️ International Stores</a><a role="menuitem" href="property.html">🏠 Property</a><a role="menuitem" href="film-fashion.html">🎬 Film & Fashion</a><a role="menuitem" href="groups.html">👥 Groups</a><div class="sep"></div><a role="menuitem" href="settings.html">⚙️ Settings</a></div>`;
    document.body.appendChild(w);var b=w.querySelector('button'),p=w.querySelector('.trooth-unified-panel');
    function close(){p.classList.remove('open');b.setAttribute('aria-expanded','false')}function toggle(){var open=p.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false')}
    b.onclick=toggle;document.addEventListener('click',function(e){if(!w.contains(e.target))close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});w.addEventListener('click',function(e){if(e.target.closest('a'))close()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
