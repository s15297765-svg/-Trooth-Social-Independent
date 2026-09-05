// Trooth Social Independent — Unified Facebook-style Profile bridge
(function(){
  function boot(){
    if(location.pathname.endsWith('/auth.html')===false && !document.getElementById('app')) return;
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var app=document.getElementById('app');if(!app)return;
    function enhance(){
      if(!window.troothCurrentUser && !window.user) return;
      if(app.querySelector('.trooth-profile-unified')) return;
      var card=document.createElement('section');card.className='card trooth-profile-unified';
      card.innerHTML='<h2>🌿 My Trooth</h2><p class="muted">آپ کے Social Profile، Saved Posts اور Activity ایک جگہ۔</p><div class="trooth-profile-links"><a href="index.html">🏠 Home Feed</a><a href="friends.html">👥 Friends & Following</a><a href="saved.html">🔖 Saved Posts</a><a href="activity.html">📊 My Activity</a><a href="notifications.html">🔔 Notifications</a><a href="settings.html">⚙️ Settings</a></div>';
      var style=document.createElement('style');style.textContent='.trooth-profile-unified{border:1px solid #cfe8d7}.trooth-profile-links{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.trooth-profile-links a{background:#d8f3dc;color:#2d6a4f;border-radius:12px;padding:13px;text-decoration:none;font-weight:800;text-align:center}.trooth-profile-links a:hover{background:#b7e4c7}@media(max-width:600px){.trooth-profile-links{grid-template-columns:1fr 1fr}}';document.head.appendChild(style);
      app.appendChild(card);
    }
    new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
    setTimeout(enhance,700);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
