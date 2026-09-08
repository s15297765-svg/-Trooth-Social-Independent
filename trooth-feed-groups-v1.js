// Trooth Social Independent — Group context on Home Feed v1
(function(){
  const wait=()=>new Promise(resolve=>{
    if(window.troothSupabase)return resolve(window.troothSupabase);
    window.addEventListener('trooth-supabase-ready',()=>resolve(window.troothSupabase),{once:true});
  });
  const postId=post=>post.dataset.post||post.dataset.postId||(()=>{
    const b=post.querySelector('.postActions button,.postactions button,.actions button');
    const m=(b?.getAttribute('onclick')||'').match(/['\"]([^'\"]+)['\"]/);
    return m?.[1]||'';
  })();
  async function hydrate(){
    const s=await wait();
    const posts=[...document.querySelectorAll('.post')];
    const ids=posts.map(postId).filter(Boolean);
    if(!ids.length)return;
    const r=await s.from('posts').select('id,group_id').in('id',ids);
    if(r.error)return;
    const grouped=(r.data||[]).filter(x=>x.group_id);
    const gids=[...new Set(grouped.map(x=>x.group_id))];
    if(!gids.length)return;
    const g=await s.from('groups').select('id,name,privacy').in('id',gids);
    if(g.error)return;
    const map=new Map((g.data||[]).map(x=>[x.id,x]));
    posts.forEach(post=>post.querySelector('.trooth-group-badge')?.remove());
    grouped.forEach(row=>{
      const post=posts.find(p=>postId(p)===row.id), group=map.get(row.group_id);
      if(!post||!group)return;
      const head=post.querySelector('.posthead')||post.firstElementChild;
      const badge=document.createElement('a');
      badge.className='trooth-group-badge';
      badge.href='group.html?id='+encodeURIComponent(group.id);
      badge.textContent='👥 '+group.name;
      badge.title='Open group';
      (head||post).appendChild(badge);
    });
  }
  function style(){
    if(document.getElementById('trooth-group-feed-style'))return;
    const st=document.createElement('style');st.id='trooth-group-feed-style';st.textContent='.trooth-group-badge{display:inline-flex;align-items:center;margin-left:auto;padding:5px 9px;border-radius:999px;background:#e5f7ec;border:1px solid #ccebd8;color:#27734f;font-size:11px;font-weight:800;text-decoration:none;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.trooth-group-badge:hover{background:#d6f1e1}.posthead{gap:9px}@media(max-width:700px){.trooth-group-badge{font-size:10px;padding:4px 7px;max-width:48%}}';document.head.appendChild(st);
  }
  let timer;
  function schedule(){clearTimeout(timer);timer=setTimeout(hydrate,300)}
  style();
  window.addEventListener('trooth-supabase-ready',schedule);
  window.addEventListener('trooth-post-update',schedule);
  window.addEventListener('trooth-content-interaction-refresh',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  window.troothRefreshGroupFeed=hydrate;
})();
