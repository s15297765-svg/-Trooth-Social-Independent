// Trooth Home V2 — visual/UX enhancement layer
(function(){
  const css=`
  .t2-banner{margin:0 0 16px;padding:18px;border-radius:18px;background:linear-gradient(135deg,#74c69d,#b7e4c7 55%,#fff);border:1px solid #b7dfc7;display:flex;justify-content:space-between;gap:15px;align-items:center;box-shadow:0 5px 18px #245c3a14}
  .t2-banner h2{margin:0 0 5px;font-size:22px}.t2-banner p{margin:0;color:#355c47;font-size:13px}.t2-badge{background:#fff;padding:9px 12px;border-radius:12px;font-weight:900;color:#2d6a4f;white-space:nowrap}
  .t2-chips{display:flex;gap:8px;overflow:auto;margin:0 0 16px;padding:2px}.t2-chip{border:1px solid #cde8d7;background:#fff;border-radius:22px;padding:9px 13px;font-weight:800;color:#2d6a4f;white-space:nowrap;cursor:pointer}.t2-chip:hover{background:#d8f3dc}
  .t2-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}.t2-action{border:0;border-radius:14px;padding:13px 8px;background:#fff;box-shadow:0 3px 12px #245c3a12;color:#2d6a4f;font-weight:900;cursor:pointer}.t2-action:hover{background:#d8f3dc}
  .t2-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:900;color:#2d6a4f}.t2-dot{width:8px;height:8px;border-radius:50%;background:#52b788;display:inline-block}
  @media(max-width:650px){.t2-banner{padding:14px}.t2-banner h2{font-size:18px}.t2-badge{display:none}.t2-actions{grid-template-columns:repeat(2,1fr)}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  function add(){
    const section=document.querySelector('main.layout section'); if(!section||document.getElementById('troothV2')) return;
    const hero=section.querySelector('.hero'); if(!hero) return;
    const wrap=document.createElement('div');wrap.id='troothV2';
    wrap.innerHTML=`<div class="t2-banner"><div><div class="t2-live"><span class="t2-dot"></span> TROOTH NETWORK LIVE</div><h2>Your independent social space</h2><p>Share your voice, discover news, connect with people and grow your business.</p></div><div class="t2-badge">💚 Independent</div></div>
    <div class="t2-chips"><button class="t2-chip" data-go="index.html">🏠 Feed</button><button class="t2-chip" data-go="news.html">📰 News</button><button class="t2-chip" data-go="sports.html">🏆 Sports</button><button class="t2-chip" data-go="stores.html">🛍️ Stores</button><button class="t2-chip" data-go="property.html">🏠 Property</button><button class="t2-chip" data-go="film-fashion.html">🎬 Film & Fashion</button></div>
    <div class="t2-actions"><button class="t2-action" data-go="friends.html">👥<br>Friends</button><button class="t2-action" data-go="business.html">💼<br>Business</button><button class="t2-action" data-go="groups.html">👨‍👩‍👧<br>Groups</button><button class="t2-action" data-go="notifications-messages.html">💬<br>Messages</button></div>`;
    hero.insertAdjacentElement('afterend',wrap);
    wrap.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>location.href=b.dataset.go));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();