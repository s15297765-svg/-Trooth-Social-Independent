// Trooth Social Independent — Modern feed layer v2
(function(){
  if(window.__troothFeedModernV2)return; window.__troothFeedModernV2=true;
  const wait=()=>new Promise(r=>window.troothSupabase?r(window.troothSupabase):window.addEventListener('trooth-supabase-ready',()=>r(window.troothSupabase),{once:true}));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function style(){if(document.getElementById('trooth-modern-feed-style'))return;const s=document.createElement('style');s.id='trooth-modern-feed-style';s.textContent=`
    .trooth-stories{display:flex;gap:10px;overflow:auto;padding:12px;margin:0 0 14px;scrollbar-width:none}.trooth-stories::-webkit-scrollbar{display:none}
    .trooth-story{min-width:92px;height:132px;border-radius:18px;overflow:hidden;position:relative;border:2px solid #b7e8ca;background:linear-gradient(160deg,#74c69d,#d8f3dc);color:#145238;font-weight:800;cursor:pointer;box-shadow:0 5px 16px rgba(39,132,91,.12)}
    .trooth-story img,.trooth-story video{width:100%;height:100%;object-fit:cover}.trooth-story span{position:absolute;left:7px;right:7px;bottom:7px;color:#fff;text-shadow:0 1px 5px #123;background:linear-gradient(transparent,rgba(0,0,0,.58));padding-top:24px;font-size:12px}
    .trooth-story.add{display:grid;place-items:center;text-align:center;font-size:28px}.trooth-story.add small{display:block;font-size:11px;margin-top:5px}
    .trooth-quick{display:flex;gap:7px;overflow:auto;padding:2px 0 10px}.trooth-quick button{white-space:nowrap;border:1px solid #d7ebdf;background:#fff;border-radius:999px;padding:9px 13px;color:#2d6a4f;font-weight:800}.trooth-quick button:hover{background:#e9f8ef}
    .trooth-story-view{position:fixed;inset:0;background:rgba(8,25,17,.78);z-index:10050;display:grid;place-items:center;padding:18px}.trooth-story-view .inner{width:min(520px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:24px;padding:18px;box-shadow:0 20px 70px rgba(0,0,0,.3)}.trooth-story-view img,.trooth-story-view video{width:100%;max-height:62vh;object-fit:contain;border-radius:16px;background:#10261b}.trooth-story-view .close{float:right;border:0;background:#eaf8ef;border-radius:999px;padding:8px 12px;font-weight:900;color:#145238}
    @media(max-width:650px){.trooth-story{min-width:82px;height:118px}.trooth-quick button{font-size:12px}}
  `;document.head.appendChild(s)}
  async function mount(){style();const main=document.querySelector('section');if(!main||document.getElementById('trooth-modern-stories'))return;const hero=main.querySelector('.hero');if(!hero)return;
    const box=document.createElement('div');box.className='card';box.id='trooth-modern-stories';box.style.margin='0 0 14px';box.innerHTML='<div style="padding:12px 12px 0;font-weight:900;color:#285b43">Stories & Quick Create</div><div class="trooth-stories" id="trooth-story-row"><button class="trooth-story add" type="button">＋<small>Add Story</small></button></div><div class="trooth-quick"><button type="button" onclick="document.getElementById(\'body\')?.focus()">✍️ Post</button><button type="button" onclick="document.getElementById(\'photo\')?.click()">📷 Photo</button><button type="button" onclick="document.getElementById(\'video\')?.click()">🎥 Video</button><button type="button" onclick="location.href=\'news.html\'">📰 News</button><button type="button" onclick="location.href=\'business.html\'">💼 Business</button></div>';
    hero.after(box);box.querySelector('.add').onclick=createStory;await loadStories();
  }
  async function createStory(){
    const s=await wait(),u=(await s.auth.getUser()).data.user;if(!u){location.href='auth.html';return}
    const body=prompt('Write a short Trooth Story (optional if you choose media):')||'';
    const pick=document.createElement('input');pick.type='file';pick.accept='image/*,video/*';pick.style.display='none';document.body.appendChild(pick);pick.click();
    pick.onchange=async()=>{try{
      let media_url=null;
      const file=pick.files&&pick.files[0];
      if(file){const ext=(file.name.split('.').pop()||'bin').toLowerCase(),path=`stories/${u.id}/${Date.now()}.${ext}`;const up=await s.storage.from('post-media').upload(path,file,{upsert:false});if(up.error){alert(up.error.message);return}media_url=s.storage.from('post-media').getPublicUrl(path).data.publicUrl;}
      if(!body.trim()&&!media_url){return}
      const r=await s.from('stories').insert({user_id:u.id,content:body.trim()||null,media_url});if(r.error){alert(r.error.message);return}await loadStories();
    }finally{pick.remove()}};
  }
  async function loadStories(){try{const s=await wait();const r=await s.from('stories').select('id,user_id,content,media_url,created_at').order('created_at',{ascending:false}).limit(12);if(r.error)return;const row=document.getElementById('trooth-story-row');if(!row)return;const ids=[...new Set((r.data||[]).map(x=>x.user_id))];let ps={};if(ids.length){const p=await s.from('profiles').select('id,display_name,avatar_url').in('id',ids);(p.data||[]).forEach(x=>ps[x.id]=x)}const add=row.firstElementChild;row.innerHTML='';row.appendChild(add);(r.data||[]).forEach(x=>{const p=ps[x.user_id]||{},n=p.display_name||'Trooth Member',b=document.createElement('button');b.className='trooth-story';b.type='button';const media=x.media_url||'';b.innerHTML=media?(fileIsVideo(media)?'<video src="'+esc(media)+'" muted playsinline></video><span>'+esc(n)+'</span>':'<img src="'+esc(media)+'"><span>'+esc(n)+'</span>'):'<span>🌿 '+esc((x.content||'').slice(0,70))+'</span>';b.onclick=()=>openStory(x,n);row.appendChild(b)})}catch(_){} }
  function fileIsVideo(url){return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)}
  function openStory(x,name){const wrap=document.createElement('div');wrap.className='trooth-story-view';const media=x.media_url?(fileIsVideo(x.media_url)?'<video src="'+esc(x.media_url)+'" controls autoplay playsinline></video>':'<img src="'+esc(x.media_url)+'">'):'';wrap.innerHTML='<div class="inner"><button class="close" type="button">✕ Close</button><div style="clear:both"></div>'+media+'<h3 style="color:#145238;margin:12px 0 6px">'+esc(name)+'</h3><p style="white-space:pre-wrap;line-height:1.6;color:#315541">'+esc(x.content||'')+'</p><small style="color:#7b8b82">'+new Date(x.created_at).toLocaleString()+'</small></div>';wrap.querySelector('.close').onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};document.body.appendChild(wrap)}
  window.addEventListener('trooth-supabase-ready',()=>setTimeout(mount,300));if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,500),{once:true});else setTimeout(mount,500);
})();
