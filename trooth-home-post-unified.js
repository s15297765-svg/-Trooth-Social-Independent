// Trooth Social Independent — unified Home post interactions v4
(function(){
  if(window.__troothHomePostUnified)return;
  window.__troothHomePostUnified=true;
  function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(m){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]})}
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 28px);text-align:center';document.body.appendChild(t);setTimeout(function(){t.remove()},2200)}
  async function enhancePost(post,sb,user){
    if(!post||post.dataset.homeInteractions==='1')return;
    var id=post.dataset.postId;if(!id)return;
    var actions=post.querySelector('.postactions');if(!actions)return;
    post.dataset.homeInteractions='1';
    var likeR=await sb.from('post_likes').select('user_id').eq('post_id',id);
    var commentR=await sb.from('comments').select('body,created_at,user_id').eq('post_id',id).order('created_at',{ascending:true});
    var shareR=await sb.from('post_shares').select('user_id').eq('post_id',id);
    var likes=likeR.data||[],comments=commentR.data||[],shares=shareR.data||[];
    var liked=!!user&&likes.some(function(x){return x.user_id===user.id});
    actions.innerHTML='<button class="action" data-like> '+(liked?'❤️ Liked':'🤍 Like')+' <span data-like-count>('+likes.length+')</span></button><button class="action" data-comment-focus>💬 Comment <span data-comment-count>('+comments.length+')</span></button><button class="action" data-share>↗ Share <span data-share-count>('+shares.length+')</span></button>';
    var panel=document.createElement('div');panel.style.cssText='margin-top:10px';panel.innerHTML='<div style="display:flex;gap:7px"><input data-comment-input aria-label="Write a comment" maxlength="1000" placeholder="Write a comment..." style="flex:1;min-width:0;border:1px solid #d8e9de;border-radius:999px;padding:10px 13px"><button data-send type="button" style="border:0;border-radius:999px;padding:9px 13px;background:#40916c;color:#fff;font-weight:800;cursor:pointer">💬 Send</button></div><div data-comments style="margin-top:8px"></div>';
    post.appendChild(panel);
    var commentsBox=panel.querySelector('[data-comments]');
    function render(){
      var lc=actions.querySelector('[data-like-count]'),cc=actions.querySelector('[data-comment-count]'),sc=actions.querySelector('[data-share-count]'),lb=actions.querySelector('[data-like]');
      if(lb)lb.innerHTML=(liked?'❤️ Liked':'🤍 Like')+' <span data-like-count>('+likes.length+')</span>';
      if(cc)cc.textContent='('+comments.length+')';
      if(sc)sc.textContent='('+shares.length+')';
      commentsBox.innerHTML=comments.map(function(x){var when=x.created_at?new Date(x.created_at).toLocaleString():'';return '<div style="padding:8px 4px;border-top:1px solid #e5eee8"><div>💬 '+esc(x.body)+'</div><small style="color:#718276">'+esc(when)+'</small></div>'}).join('')||'<small style="color:#718276">No comments yet.</small>';
    }
    render();
    async function sync(){
      var l=await sb.from('post_likes').select('user_id').eq('post_id',id);
      var c=await sb.from('comments').select('body,created_at,user_id').eq('post_id',id).order('created_at',{ascending:true});
      var s=await sb.from('post_shares').select('user_id').eq('post_id',id);
      if(!l.error){likes=l.data||[];liked=!!user&&likes.some(function(x){return x.user_id===user.id})}
      if(!c.error)comments=c.data||[];
      if(!s.error)shares=s.data||[];
      render();
    }
    function activityRefresh(){window.dispatchEvent(new CustomEvent('trooth-post-activity-refresh',{detail:{postId:id}}));}
    actions.querySelector('[data-like]').onclick=async function(){if(!user){location.href='auth.html';return}this.disabled=true;try{var r=liked?await sb.from('post_likes').delete().eq('post_id',id).eq('user_id',user.id):await sb.from('post_likes').insert({post_id:id,user_id:user.id});if(r.error)throw r.error;var wasLiked=liked;await sync();activityRefresh();toast(wasLiked?'Like removed':'❤️ Liked')}catch(e){toast(e.message||'Like failed')}finally{this.disabled=false}};
    actions.querySelector('[data-comment-focus]').onclick=function(){panel.querySelector('[data-comment-input]').focus()};
    panel.querySelector('[data-send]').onclick=send;
    panel.querySelector('[data-comment-input]').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
    async function send(){if(!user){location.href='auth.html';return}var input=panel.querySelector('[data-comment-input]'),body=input.value.trim(),btn=panel.querySelector('[data-send]');if(!body)return;btn.disabled=true;try{var r=await sb.from('comments').insert({post_id:id,user_id:user.id,body:body});if(r.error)throw r.error;await sync();input.value='';activityRefresh();toast('💬 Comment posted')}catch(e){toast(e.message||'Comment failed')}finally{btn.disabled=false}}
    actions.querySelector('[data-share]').onclick=async function(){if(!user){location.href='auth.html';return}var url=location.href.split('#')[0]+'?post='+encodeURIComponent(id),shared=false;try{if(navigator.share){await navigator.share({title:'Trooth',text:'Check this post on Trooth',url:url});shared=true}else if(navigator.clipboard){await navigator.clipboard.writeText(url);shared=true;toast('🔗 Link copied')}else toast('Share link: '+url)}catch(e){if(e&&e.name==='AbortError')return;if(navigator.clipboard)try{await navigator.clipboard.writeText(url);shared=true;toast('🔗 Link copied')}catch(_){} }if(shared){var sr=await sb.from('post_shares').insert({post_id:id,user_id:user.id});if(sr.error&&sr.error.code!=='23505')console.warn('post_shares:',sr.error);await sync();activityRefresh();window.dispatchEvent(new CustomEvent('trooth-post-shared',{detail:{postId:id}}));}};
    post.__troothHomePostSync=sync;
  }
  async function scan(){var sb=window.troothSupabase;if(!sb)return;var user=(await sb.auth.getUser()).data.user||null;document.querySelectorAll('.post[data-post-id]').forEach(function(p){enhancePost(p,sb,user)});}
  function start(){scan();var root=document.getElementById('feed')||document.body;new MutationObserver(function(){scan()}).observe(root,{childList:true,subtree:true});}
  function bootRealtime(){var sb=window.troothSupabase;if(!sb||!sb.channel)return;sb.channel('trooth-home-post-unified-live').on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},function(e){var id=e.new&&e.new.post_id||e.old&&e.old.post_id;var p=document.querySelector('.post[data-post-id="'+id+'"]');if(p&&p.__troothHomePostSync)p.__troothHomePostSync()}).on('postgres_changes',{event:'*',schema:'public',table:'comments'},function(e){var id=e.new&&e.new.post_id||e.old&&e.old.post_id;var p=document.querySelector('.post[data-post-id="'+id+'"]');if(p&&p.__troothHomePostSync)p.__troothHomePostSync()}).on('postgres_changes',{event:'*',schema:'public',table:'post_shares'},function(e){var id=e.new&&e.new.post_id||e.old&&e.old.post_id;var p=document.querySelector('.post[data-post-id="'+id+'"]');if(p&&p.__troothHomePostSync)p.__troothHomePostSync();window.dispatchEvent(new CustomEvent('trooth-post-share-live',{detail:{postId:id}}))}).subscribe();}
  function boot(){start();bootRealtime()}
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();