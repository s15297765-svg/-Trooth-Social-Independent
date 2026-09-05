// Trooth Social Independent — home search enhancement v2
(()=>{
  const run=()=>{
    const input=document.getElementById('search');if(!input)return;
    const q=String(input.value||'').trim().toLowerCase();
    if(window.troothHomeCategoryFilter&&typeof window.troothHomeCategoryFilter.setSearch==='function'){
      window.troothHomeCategoryFilter.setSearch(q);return;
    }
    let shown=0;
    document.querySelectorAll('#feed .post').forEach(card=>{
      const text=String(card.getAttribute('data-text')||card.textContent||'').toLowerCase();
      const ok=!q||text.includes(q);card.style.display=ok?'':'none';if(ok)shown++;
    });
    let note=document.getElementById('troothSearchStatus');
    if(q&&note){note.textContent=shown+' result'+(shown===1?'':'s')+' found';note.style.display='block'}
    else if(note){note.textContent='';note.style.display='none'}
  };
  const clear=()=>{
    const input=document.getElementById('search');if(!input)return;
    input.value='';run();input.focus();
  };
  window.filterPosts=run;window.troothHomeSearchClear=clear;
  document.addEventListener('input',e=>{if(e.target&&e.target.id==='search')run()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.activeElement&&document.activeElement.id==='search')clear()});
  window.addEventListener('trooth-feed-refreshed',run);window.addEventListener('trooth-home-hub-refresh',run);
})();
