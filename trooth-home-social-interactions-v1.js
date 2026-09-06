// Trooth Social Independent — Home social post author + interaction bridge v1
(function(){
  if(window.__troothHomeSocialInteractions)return;window.__troothHomeSocialInteractions=true;
  const ready=()=>window.troothSupabase?Promise.resolve(window.troothSupabase):new Promise(r=>window.addEventListener('trooth-supabase-ready',()=>r(window.troothSupabase),{once:true}));
  const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  async function enhance(sb){
    const root=document.getElementById('troothUnifiedNetworkFeed');if(!root)return;
    const cards=[...root.querySelectorAll('[data-content-type="post"][data-content-id]')];if(!cards.length)return;
    const ids=[...new Set(cards.map(x=>x.dataset.contentId))];
    const pr=await sb.from('posts').select('id,user_id,body,media_url,media_type').in('id',ids);const posts=pr.data||[];
    const uids=[...new Set(posts.map(x=>x.user_id).filter(Boolean))];let profiles=[];
    if(uids.length){const r=await sb.from('profiles').select('id,display_name,avatar_url,bio').in('id',uids);profiles=r.data||[];}
    const pm=new Map(profiles.map(x=>[x.id,x]));const userR=await sb.auth.getUser();const user=userR.data&&userR.data.user||null;
    for(const card of cards){
      const post=posts.find(x=>x.id===card.dataset.contentId);if(!post)continue;const p=pm.get(post.user_id)||{};
      const head='<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'+(p.avatar_url?'<img src="'+esc(p.avatar_url)+'" alt="" style="width:42px;height:42px;border-radius:50%;object-fit:cover">':'<div style="width:42px;height:42px;border-radius:50%;background:#d8e9de;display:grid;place-items:center;font-weight:900">👤</div>')+'<div><strong>'+esc(p.display_name||'Trooth User')+'</strong><div class="muted" style="font-size:12px">'+(post.user_id===user?.id?'You':'Social Post')+'</div></div></div>';
      const body=card.querySelector('p');card.insertAdjacentHTML('afterbegin',head);
      if(post.media_url){const m=post.media_type&&post.media_type.startsWith('video')?'<video controls style="width:100%;max-height:420px;border-radius:14px;margin-top:8px"><source src="'+esc(post.media_url)+'"></video>':'<img loading="lazy" src="'+esc(post.media_url)+'" alt="Post media" style="width:100%;max-height:420px;object-fit:cover;border-radius:14px;margin-top:8px">';if(body)body.insertAdjacentHTML('afterend',m);}
      let box=card.querySelector('[data-trooth-post-interactions]');if(!box){box=document.createElement('div');box.dataset.troothPostInteractions='1';box.style.marginTop='12px';card.appendChild(box);}
      if(window.TroothInteractions) await window.TroothInteractions.render(sb,user,'group',post.id,box).catch(()=>{});
      // Social posts use the same post tables as groups; render a lightweight personal-post action bar.
      const likeR=await sb.from('post_likes').select('user_id').eq('post_id',post.id);const likes=likeR.data||[];const liked=!!user&&likes.some(x=>x.user_id===user.id);
      box.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap"><button data-p-like type="button" style="border:1px solid #d8e9de;border-radius:999px;padding:9px 13px;background:#fff;font-weight:800">'+(liked?'❤️ Liked':'🤍 Like')+' ('+likes.length+')</button><button data-p-share type="button" style="border:1px solid #d8e9de;border-radius:999px;padding:9px 13px;background:#fff;font-weight:800">🔄 Share</button></div>';
      box.querySelector('[data-p-like]').onclick=async()=>{if(!user)return;const q=liked?sb.from('post_likes').delete().eq('post_id',post.id).eq('user_id',user.id):sb.from('post_likes').insert({post_id:post.id,user_id:user.id});if(!(await q).error)enhance(sb)};
      box.querySelector('[data-p-share]').onclick=async()=>{const url=location.href.split('#')[0]+'#post-'+encodeURIComponent(post.id);if(navigator.share){try{await navigator.share({title:'Trooth Social Post',url})}catch(e){}}else if(navigator.clipboard)await navigator.clipboard.writeText(url);};
    }
  }
  async function boot(){const sb=await ready();const run=()=>enhance(sb);run();new MutationObserver(run).observe(document.body,{childList:true,subtree:true});window.addEventListener('trooth-content-interaction-refresh',run);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
