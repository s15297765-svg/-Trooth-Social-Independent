// Trooth Social Independent — profile/post/notification deep-link v3
(function(){
  if(window.__troothProfileDeepLinkV3)return;
  window.__troothProfileDeepLinkV3=true;
  const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function publicProfile(){
    const qs=new URLSearchParams(location.search),id=qs.get('profile');
    if(!id)return;
    function start(){
      const sb=window.troothSupabase,app=document.getElementById('app');
      if(!sb||!app)return;
      sb.auth.getUser().then(async r=>{
        if(r.data?.user?.id===id)return;
        app.innerHTML='<div class="card"><p class="muted">Loading Trooth profile…</p></div>';
        const p=await sb.from('profiles').select('id,display_name,bio,avatar_url,cover_url,created_at').eq('id',id).maybeSingle();
        if(p.error||!p.data){app.innerHTML='<div class="card"><h2>Profile not found</h2><a class="btn" href="index.html">🏠 Home Feed</a></div>';return;}
        const x=p.data,initial=esc((x.display_name||'T')[0].toUpperCase());
        const posts=(await sb.from('posts').select('id,body,created_at,media_url,media_type').eq('user_id',id).order('created_at',{ascending:false}).limit(30)).data||[];
        const postHtml=posts.length?posts.map(q=>'<div class="post" data-post="'+esc(q.id)+'" data-post-id="'+esc(q.id)+'"><b>📝 '+esc(x.display_name||'Trooth User')+'</b><p>'+esc(q.body||'')+'</p>'+(q.media_url?(String(q.media_type||'').startsWith('video')?'<video src="'+esc(q.media_url)+'" controls style="max-width:100%;border-radius:10px"></video>':'<img src="'+esc(q.media_url)+'" style="max-width:100%;border-radius:10px">'):'')+'<br><small class="muted">'+new Date(q.created_at).toLocaleString()+'</small><div class="trooth-profile-post-actions" data-post-actions="'+esc(q.id)+'"></div></div>').join(''):'<p class="muted">No posts yet.</p>';
        app.innerHTML='<div class="card"><div class="cover" style="'+(x.cover_url?'background-image:url(\"'+esc(x.cover_url)+'\")':'')+'"><div class="avatar">'+(x.avatar_url?'<img src="'+esc(x.avatar_url)+'" alt="Profile photo">':initial)+'</div></div><div class="profileHead"><h1>'+esc(x.display_name||'Trooth User')+'</h1><p class="muted">'+esc(x.bio||'Trooth Member • Independent Social & Business Network')+'</p><div class="stats"><div class="stat"><b>'+posts.length+'</b><br>Posts</div></div></div><div class="quick"><a href="index.html">🏠 Home</a><a href="friends.html">👥 Friends</a><a href="chat.html?user='+encodeURIComponent(id)+'">💬 Message</a></div></div><div class="card"><h3>📝 Posts</h3>'+postHtml+'</div>';
        setTimeout(function(){window.dispatchEvent(new CustomEvent('trooth-post-update',{detail:{source:'public-profile-v3',profileId:id}}))},80);
      }).catch(()=>{app.innerHTML='<div class="card"><h2>Profile could not be loaded</h2></div>'});
    }
    if(window.troothSupabase)start();else window.addEventListener('trooth-supabase-ready',start,{once:true});
  }
  function notificationRoutes(){
    if(location.pathname.split('/').pop()!=='notifications.html')return;
    const original=window.openNotification;
    if(typeof original!=='function')return setTimeout(notificationRoutes,300);
    if(original.__troothV3)return;
    function open(n){
      if(n&&['follow','friend_request','friend_accept'].includes(n.kind)&&n.actor_id){
        if(!n.is_read&&window.troothSupabase&&window.troothSupabase.auth)window.troothSupabase.from('notifications').update({is_read:true}).eq('id',n.id).eq('user_id',n.user_id).then(()=>window.dispatchEvent(new CustomEvent('trooth-notification-read')));
        location.href='auth.html?profile='+encodeURIComponent(n.actor_id);return;
      }
      return original(n);
    }
    open.__troothV3=true;window.openNotification=open;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(notificationRoutes,350);publicProfile()},{once:true});else{setTimeout(notificationRoutes,350);publicProfile()}
})();
