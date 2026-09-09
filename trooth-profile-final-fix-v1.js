// Trooth Social Independent — Profile final fix v1
(function(){
  if(window.__troothProfileFinalFixV1)return;
  window.__troothProfileFinalFixV1=true;
  function esc(s){return String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  function isAuthPage(){return /(?:^|\/)auth\.html(?:$|[?#])/.test(location.pathname+location.search)}
  async function publicProfile(sb,id,app){
    if(!id||!app)return;
    app.innerHTML='<div class="card"><p class="muted">Loading Trooth profile…</p></div>';
    try{
      const p=await sb.from('profiles').select('id,display_name,bio,avatar_url,cover_url,created_at').eq('id',id).maybeSingle();
      if(p.error)throw p.error;
      if(!p.data){app.innerHTML='<div class="card"><h2>Profile not found</h2><a class="btn" href="index.html">🏠 Home Feed</a></div>';return;}
      const x=p.data;
      const posts=(await sb.from('posts').select('id,body,created_at,media_url,media_type').eq('user_id',id).order('created_at',{ascending:false}).limit(30))).data||[];
      const initial=esc((x.display_name||'T').trim().charAt(0).toUpperCase()||'T');
      const postHtml=posts.length?posts.map(q=>'<div class="post"><b>📝 '+esc(x.display_name||'Trooth User')+'</b><p>'+esc(q.body||'')+'</p>'+(q.media_url?(String(q.media_type||'').startsWith('video')?'<video src="'+esc(q.media_url)+'" controls style="max-width:100%;border-radius:10px"></video>':'<img src="'+esc(q.media_url)+'" style="max-width:100%;border-radius:10px">'):'')+'<br><small class="muted">'+new Date(q.created_at).toLocaleString()+'</small></div>').join(''):'<p class="muted">No posts yet.</p>';
      app.innerHTML='<div class="card"><div class="cover" style="'+(x.cover_url?'background-image:url(\"'+esc(x.cover_url)+'\")':'')+'"><div class="avatar">'+(x.avatar_url?'<img src="'+esc(x.avatar_url)+'" alt="Profile photo">':initial)+'</div></div><div class="profileHead"><h1>'+esc(x.display_name||'Trooth User')+'</h1><p class="muted">'+esc(x.bio||'Trooth Member • Independent Social & Business Network')+'</p><div class="stats"><div class="stat"><b>'+posts.length+'</b><br>Posts</div></div></div><div class="quick"><a href="index.html">🏠 Home</a><a href="friends.html">👥 Friends</a><a href="chat.html?user='+encodeURIComponent(id)+'">💬 Message</a></div></div><div class="card"><h3>📝 Posts</h3>'+postHtml+'</div>';
    }catch(e){console.warn('Trooth profile final fix',e);app.innerHTML='<div class="card"><h2>Profile could not be loaded</h2><p class="muted">Please refresh and try again.</p><a class="btn" href="index.html">🏠 Home Feed</a></div>';}
  }
  async function boot(){
    const sb=window.troothSupabase;if(!sb)return;
    if(!isAuthPage())return;
    const app=document.getElementById('app');if(!app)return;
    const qs=new URLSearchParams(location.search);
    const target=qs.get('profile')||qs.get('id')||qs.get('user');
    try{
      const r=await sb.auth.getUser();
      const uid=r.data&&r.data.user&&r.data.user.id;
      if(target&&target!==uid){publicProfile(sb,target,app);return;}
      // Give the page's own profile initializer a clean second chance after all modules are ready.
      setTimeout(function(){
        const text=(app.textContent||'').toLowerCase();
        if(/loading trooth profile/.test(text)&&typeof window.init==='function')window.init();
      },1200);
    }catch(e){setTimeout(function(){if(typeof window.init==='function')window.init()},1200);}
  }
  function ready(){setTimeout(boot,900)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  window.addEventListener('trooth-supabase-ready',ready);
})();
