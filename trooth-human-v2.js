// Trooth Human UI v2 — lightweight UX polish
(function(){
  if(window.__troothHumanV2)return; window.__troothHumanV2=true;
  if(location.pathname.endsWith('index.html')||location.pathname==='/'||location.pathname===''){
    var css=document.createElement('style');css.textContent=`
      .humanbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;padding:10px 12px;border:1px solid #dceee4;background:rgba(255,255,255,.72);border-radius:14px;font-size:12px;color:#466656}
      .humanbar b{color:#19583b}.online-dot{width:8px;height:8px;border-radius:50%;background:#38a169;display:inline-block;margin-right:5px;box-shadow:0 0 0 3px #dff7e8}
      .toast-trooth{position:fixed;left:50%;bottom:82px;transform:translate(-50%,14px);opacity:0;pointer-events:none;background:#19583b;color:#fff;padding:11px 15px;border-radius:12px;font-size:13px;font-weight:700;z-index:300;box-shadow:0 10px 28px rgba(20,82,56,.22);transition:.22s}
      .toast-trooth.show{opacity:1;transform:translate(-50%,0)}
      .post{transition:transform .18s,box-shadow .18s}.post:hover{transform:translateY(-1px);box-shadow:0 14px 34px rgba(24,91,57,.10)}
      @media(max-width:700px){.humanbar{font-size:11px;padding:9px 10px}.toast-trooth{bottom:76px}}
    `;document.head.appendChild(css);
    function $(id){return document.getElementById(id)}
    function toast(msg){var t=document.querySelector('.toast-trooth');if(!t){t=document.createElement('div');t.className='toast-trooth';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(window.__troothToast);window.__troothToast=setTimeout(function(){t.classList.remove('show')},1800)}
    window.troothToast=toast;
    var hero=document.querySelector('.hero');
    if(hero&&!document.querySelector('.humanbar')){var h=document.createElement('div');h.className='humanbar';var hour=new Date().getHours();var greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';h.innerHTML='<span><span class="online-dot"></span><b>'+greeting+'</b> — Trooth is ready for you.</span><span>🌿 Independent & Human</span>';hero.appendChild(h)}
    var input=$('postInput');if(input){input.addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,180)+'px'});input.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();if(window.publishPost)window.publishPost()}})}
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.action');if(b){var label=b.textContent.trim();if(label.indexOf('Like')>=0)toast('👍 Your reaction was added');if(label.indexOf('Share')>=0)toast('↗ Share ready')}});
  }
})();