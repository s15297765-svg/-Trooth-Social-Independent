// Trooth Social Independent — Home social post author + interaction bridge v2
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
      if(card.dataset.socialEnhanced==='2')continue;
      const post=posts.find(x=>x.id===card.dataset.contentId);if(!post)continue;const p=pm.get(post.user_id)||{};
      const head='<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'+(p.avatar_url?'<img src="'+esc(p.avatar_url)+'" alt="" loading="lazy" style="width:42px;height:42px;border-radius:50%;object-fit:cover">':'<div style="width:42px;height:42px;border-radius:50%;background:#d8e9de;display:grid;place-items:center;font-weight:900">👤</div>')+'<div><strong>'+esc(p.display_name||'Trooth User')+'</strong><div class="muted" style="font-size:12px">'+(post.user_id===user?.id?'You':'Social Post')+'</div></div></div>';
      card.insertAdjacentHTML('afterbegin',head);
      if(post.media_url&&!card.querySelector('[data-social-media]')){const m=post.media_type&&post.media_type.startsWith('video')?'<video data-social-media controls preload="metadata" style="width:100%;max-height:420px;border-radius:14px;margin-top:8px"><source src="'+esc(post.media_url)+'"></video>':'<img data-social-media loading="lazy" src="'+esc(post.media_url)+'" alt="Post media" style="width:100%;max-height:420px;object-fit:cover;border-radius:14px;margin-top:8px">';const body=card.querySelector('p');if(body)body.insertAdjacentHTML('afterend',m);}
      let box=card.querySelector('[data-trooth-post-interactions]');if(!box){box=document.createElement('div');box.dataset.troothPostInteractions='1';box.style.marginTop='12px';card.appendChild(box);}
      const [likeR,commentR,saveR]=await Promise.all([sb.from('post_likes').select('user_id').eq('post_id',post.id),sb.from('comments').select('id,user_id,body,created_at').eq('post_id',post.id).order('created_at',{ascending:true}),user?sb.from('saved_posts').select('id').eq('post_id',post.id).eq('user_id',user.id).maybeSingle():Promise.resolve({data:null})]);
      const likes=likeR.data||[],comments=commentR.data||[],liked=!!user&&likes.some(x=>x.user_id===user.id),saved=!!saveR.data;
      const commentHtml=comments.slice(-5).map(c=>'<div style="border-top:1px solid #e5eee8;padding:7px 2px;font-size:13px">💬 '+esc(c.body)+'</div>').join('');
      box.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap"><button data-p-like type="button" class="btn">'+(liked?'❤️ Liked':'🤍 Like')+' ('+likes.length+')</button><button data-p-save type="button" class="btn">'+(saved?'🔖 Saved':'🔖 Save')+'</button><button data-p-share type="button" class="btn">🔄 Share</button></div><div style="display:flex;gap:7px;margin-top:9px"><input data-p-comment placeholder="Write a comment..." style="flex:1;min-width:0;border:1px solid #d8e9de;border-radius:999px;padding:9px 12px"><button data-p-send type="button" class="btn">💬 Comment</button></div><div style="margin-top:7px">'+(commentHtml||'<small class="muted">No comments yet.</small>')+'</div>';
      box.querySelector('[data-p-like]').onclick=async()=>{if(!user)return location.href='auth.html';const q=liked?sb.from('post_likes').delete().eq('post_id',post.id).eq('user_id',user.id):sb.from('post_likes').insert({post_id:post.id,user_id:user.id});if(!(await q).error){card.dataset.socialEnhanced='';enhance(sb)}};
      box.querySelector('[data-p-save]').onclick=async()=>{if(!user)return location.href='auth.html';const q=saved?sb.from('saved_posts').delete().eq('id',saveR.data.id):sb.from('saved_posts').insert({post_id:post.id,user_id:user.id});if(!(await q).error){card.dataset.socialEnhanced='';enhance(sb)}};
      box.querySelector('[data-p-share]').onclick=async()=>{const url=location.href.split('#')[0]+'#post-'+encodeURIComponent(post.id);if(navigator.share){try{await navigator.share({title:'Trooth Social Post',text:'Check this post on Trooth',url})}catch(e){}}else if(navigator.clipboard){await navigator.clipboard.writeText(url);box.querySelector('[data-p-share]').textContent='✅ Link copied';}};
      box.querySelector('[data-p-send]').onclick=async()=>{if(!user)return location.href='auth.html';const input=box.querySelector('[data-p-comment]'),body=input.value.trim();if(!body)return;const q=await sb.from('comments').insert({post_id:post.id,user_id:user.id,body});if(!q.error){input.value='';card.dataset.socialEnhanced='';enhance(sb)}};
      card.dataset.socialEnhanced='2';
    }
  }
  async function boot(){const sb=await ready();const run=()=>enhance(sb);run();new MutationObserver(run).observe(document.body,{childList:true,subtree:true});window.addEventListener('trooth-content-interaction-refresh',run);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
