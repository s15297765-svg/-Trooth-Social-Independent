// Trooth Social Independent — home search enhancement v4
(()=>{
  if(window.__troothHomeSearchV4)return;window.__troothHomeSearchV4=true;
  const getInput=()=>document.getElementById('search');
  let timer=null;
  const ensureStatus=()=>{
    const input=getInput();if(!input)return null;
    input.setAttribute('aria-label',input.getAttribute('aria-label')||'Search Trooth');
    let wrap=input.parentElement;
    let status=document.getElementById('troothSearchStatus');
    if(!status&&wrap){status=document.createElement('small');status.id='troothSearchStatus';status.className='muted';status.style.display='none';status.style.marginTop='5px';status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');wrap.appendChild(status)}
    let clear=document.getElementById('troothSearchClear');
    if(!clear&&wrap){clear=document.createElement('button');clear.id='troothSearchClear';clear.type='button';clear.textContent='✕';clear.title='Clear search';clear.setAttribute('aria-label','Clear search');clear.className='action';clear.style.display='none';clear.style.marginLeft='6px';wrap.appendChild(clear);clear.addEventListener('click',()=>{input.value='';run();input.focus()})}
    return status;
  };
  const run=()=>{
    const input=getInput();if(!input)return;
    const q=String(input.value||'').trim().toLowerCase();
    const status=ensureStatus(),clear=document.getElementById('troothSearchClear');
    if(clear)clear.style.display=q?'inline-flex':'none';
    if(window.troothHomeCategoryFilter&&typeof window.troothHomeCategoryFilter.setSearch==='function'){
      window.troothHomeCategoryFilter.setSearch(q);
      if(status){status.textContent=q?'Searching: “'+q+'”':'';status.style.display=q?'block':'none'}
      return;
    }
    let shown=0;
    document.querySelectorAll('#feed .post').forEach(card=>{
      const text=String(card.getAttribute('data-text')||card.textContent||'').toLowerCase();
      const ok=!q||text.includes(q);card.style.display=ok?'':'none';if(ok)shown++;
    });
    if(status){status.textContent=q?shown+' result'+(shown===1?'':'s')+' found':'';status.style.display=q?'block':'none'}
  };
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(run,120)};
  const clearSearch=()=>{clearTimeout(timer);const input=getInput();if(!input)return;input.value='';run();input.focus()};
  window.filterPosts=run;window.troothHomeSearchClear=clearSearch;
  document.addEventListener('input',e=>{if(e.target&&e.target.id==='search')schedule()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.activeElement&&document.activeElement.id==='search')clearSearch()});
  window.addEventListener('trooth-feed-refreshed',schedule);window.addEventListener('trooth-home-hub-refresh',schedule);
  window.addEventListener('beforeunload',()=>clearTimeout(timer),{once:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
