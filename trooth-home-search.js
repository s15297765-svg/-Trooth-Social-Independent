// Trooth Social Independent — home search enhancement v7
(()=>{
  if(window.__troothHomeSearchV7)return;window.__troothHomeSearchV7=true;
  const getInput=()=>document.getElementById('search');
  let timer=null;
  const ensureStatus=()=>{
    const input=getInput();if(!input)return null;
    input.setAttribute('aria-label',input.getAttribute('aria-label')||'Search Trooth');input.setAttribute('autocomplete','off');input.setAttribute('enterkeyhint','search');input.setAttribute('aria-controls','feed');
    let wrap=input.parentElement;
    let status=document.getElementById('troothSearchStatus');
    if(!status&&wrap){status=document.createElement('small');status.id='troothSearchStatus';status.className='muted';status.style.display='none';status.style.marginTop='5px';status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');wrap.appendChild(status)}
    let clear=document.getElementById('troothSearchClear');
    if(!clear&&wrap){clear=document.createElement('button');clear.id='troothSearchClear';clear.type='button';clear.textContent='✕';clear.title='Clear search';clear.setAttribute('aria-label','Clear search');clear.className='action';clear.style.display='none';clear.style.marginLeft='6px';clear.addEventListener('click',()=>{input.value='';run();input.focus()});wrap.appendChild(clear)}
    return status;
  };
  const ensureMobileSearch=()=>{
    const input=getInput();if(!input||!input.parentElement)return;
    const top=input.parentElement;
    let toggle=document.getElementById('troothMobileSearchToggle');
    if(!toggle){toggle=document.createElement('button');toggle.id='troothMobileSearchToggle';toggle.type='button';toggle.textContent='🔎';toggle.title='Search Trooth';toggle.setAttribute('aria-label','Open Trooth search');toggle.setAttribute('aria-expanded','false');toggle.className='circle';toggle.style.display='none';toggle.addEventListener('click',()=>{const open=input.style.display!=='none';if(open){input.style.display='none';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open Trooth search')}else{input.style.display='block';input.style.flex='1';input.style.minWidth='0';toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close Trooth search');input.focus()}});top.insertBefore(toggle,input.nextSibling)}
    const mobile=window.matchMedia('(max-width:650px)').matches;
    if(mobile){toggle.style.display='inline-grid';if(!input.value&&!input.matches(':focus'))input.style.display='none';input.style.maxWidth='none';input.style.width='100%';input.style.flex='1';input.style.minWidth='0'}
    else{toggle.style.display='none';input.style.display='';input.style.maxWidth='';input.style.width='';input.style.flex='';input.style.minWidth=''}
  };
  const run=()=>{
    const input=getInput();if(!input)return;
    const q=String(input.value||'').trim().replace(/\s+/g,' ').toLowerCase();
    const status=ensureStatus(),clear=document.getElementById('troothSearchClear');
    if(clear)clear.style.display=q?'inline-flex':'none';
    if(window.troothHomeCategoryFilter&&typeof window.troothHomeCategoryFilter.setSearch==='function'){window.troothHomeCategoryFilter.setSearch(q);if(status){status.textContent=q?'Searching: “'+q+'”':'';status.style.display=q?'block':'none'}return}
    let shown=0;document.querySelectorAll('#feed .post').forEach(card=>{const text=String(card.getAttribute('data-text')||card.textContent||'').toLowerCase();const ok=!q||text.includes(q);card.style.display=ok?'':'none';if(ok)shown++});
    if(status){status.textContent=q?shown+' result'+(shown===1?'':'s')+' found':'';status.style.display=q?'block':'none'}
  };
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(run,120)};
  const clearSearch=()=>{clearTimeout(timer);const input=getInput();if(!input)return;input.value='';run();input.focus()};
  const focusSearch=()=>{const input=getInput();if(input){if(window.matchMedia('(max-width:650px)').matches)input.style.display='block';input.focus();input.select()}};
  window.filterPosts=run;window.troothHomeSearchClear=clearSearch;window.troothFocusSearch=focusSearch;
  document.addEventListener('input',e=>{if(e.target&&e.target.id==='search')schedule()});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&document.activeElement&&document.activeElement.id==='search'){clearSearch();if(window.matchMedia('(max-width:650px)').matches)document.getElementById('search').style.display='none';return}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();focusSearch();return}
    if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&document.activeElement!==getInput()&&['INPUT','TEXTAREA','SELECT'].indexOf(document.activeElement?.tagName)<0){e.preventDefault();focusSearch()}
  });
  window.addEventListener('resize',ensureMobileSearch,{passive:true});window.addEventListener('orientationchange',ensureMobileSearch,{passive:true});
  window.addEventListener('trooth-feed-refreshed',schedule);window.addEventListener('trooth-home-hub-refresh',schedule);
  window.addEventListener('beforeunload',()=>clearTimeout(timer),{once:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensureMobileSearch();run()},{once:true});else{ensureMobileSearch();run()}
})();
