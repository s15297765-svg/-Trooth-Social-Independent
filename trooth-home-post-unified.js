// Trooth Social Independent — unified Home post interactions
(function(){
  if(window.__troothHomePostUnified)return;
  window.__troothHomePostUnified=true;
  function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(m){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]})}
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 28px);text-align:center';document.body.appendChild(t);setTimeout(function(){t.remove()},2200)}
  function ready(){return window.troothSupabase?Promise.resolve(window.troothSupabase):new Promise(function(resolve){window.addEventListener('trooth-supabase-ready',function(){resolve(window.troothSupabase)},{once:true})})}
  async function enhancePost(post,sb,user){
    if(!post||post.dataset.homeInteractions==='1')return;
    var id=post.dataset.postId;if(!id)return;
    post.dataset.homeInteractions='1';
    var actions=post.querySelector('.postactions');if(!actions)return;
    var likeR=await sb.from('post_likes').select('user_id').eq('post_id',id);
    var commentR=await sb.from('comments').select('body,created_at,user_id').eq('post_id',id).order('created_at',{ascending:true});
    var likes=likeR.data||[],comments=commentR.data||[],liked=!!user&&likes.some(function(x){return x.user_id===user.id});
    actions.innerHTML='<button class="action" data-like> '+(liked?'❤️ Liked':'🤍 Like')+' <span data-like-count>('+likes.length+')</span></button><button class="action" data-comment-focus>💬 Comment <span data-comment-count>('+comments.length+')</span></button><button class="action" data-share>↗ Share</button>';
    var panel=document.createElement('div');panel.style.cssText='margin-top:10px';panel.innerHTML='<div style="display:flex;gap:7px"><input data-comment-input aria-label="Write a comment" placeholder="Write a comment..." style="flex:1;min-width:0;border:1px solid #d8e9de;border-radius:999px;padding:10px 13px"><button data-send type="button" style="border:0;border-radius:999px;padding:9px 13px;background:#40916c;color:#fff;font-weight:800;cursor:pointer">💬 Send</button></div><div data-comments style="margin-top:8px"></div>';
    post.appendChild(panel);
    var commentsBox=panel.querySelector('[data-comments]');
    function renderComments(){commentsBox.innerHTML=comments.map(function(x){return '<div style="padding:8px 4px;border-top:1px solid #e5eee8">💬 '+esc(x.body)+'</div>'}).join('')||'<small style="color:#718276">No comments yet.</small>'}
    renderComments();
    async function notify(kind,body){if(!user)return;var owner=post.querySelector('.posthead b');var r=await sb.from('posts').select('user_id').eq('id',id).maybeSingle();var ownerId=r.data&&r.data.user_id;if(ownerId&&ownerId!==user.id)await sb.from('notifications').insert({user_id:ownerId,actor_id:user.id,kind:kind,body:body,is_read:false})}
    actions.querySelector('[data-like]').onclick=async function(){if(!user){location.href='auth.html';return}this.disabled=true;try{var r;if(liked)r=await sb.from('post_likes').delete().eq('post_id',id).eq('user_id',user.id);else r=await sb.from('post_likes').insert({post_id:id,user_id:user.id});if(r.error)throw r.error;liked=!liked;likes.length+=liked?1:-1;this.innerHTML=(liked?'❤️ Liked':'🤍 Like')+' <span data-like-count>('+likes.length+')</span>';if(liked)await notify('Like','Someone liked your Trooth post.');toast(liked?'❤️ Liked':'Like removed')}catch(e){toast(e.message||'Like failed')}finally{this.disabled=false}};
    actions.querySelector('[data-comment-focus]').onclick=function(){panel.querySelector('[data-comment-input]').focus()};
    panel.querySelector('[data-send]').onclick=send;
    panel.querySelector('[data-comment-input]').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
    async function send(){if(!user){location.href='auth.html';return}var input=panel.querySelector('[data-comment-input]'),body=input.value.trim(),btn=panel.querySelector('[data-send]');if(!body)return;btn.disabled=true;try{var r=await sb.from('comments').insert({post_id:id,user_id:user.id,body:body});if(r.error)throw r.error;comments.push({body:body,created_at:new Date().toISOString(),user_id:user.id});renderComments();actions.querySelector('[data-comment-count]').textContent='('+comments.length+')';input.value='';await notify('Comment','Someone commented on your Trooth post.');toast('💬 Comment posted')}catch(e){toast(e.message||'Comment failed')}finally{btn.disabled=false}}
    actions.querySelector('[data-share]').onclick=async function(){if(!user){location.href='auth.html';return}var url=location.href.split('#')[0]+'#post-'+encodeURIComponent(id),shared=false;try{if(navigator.share){await navigator.share({title:'Trooth',text:'Check this post on Trooth',url:url});shared=true}else if(navigator.clipboard){await navigator.clipboard.writeText(url);shared=true;toast('🔗 Link copied')}else toast('Share link: '+url)}catch(e){if(e&&e.name==='AbortError')return;if(navigator.clipboard)try{await navigator.clipboard.writeText(url);shared=true;toast('🔗 Link copied')}catch(_){} }if(shared){var sr=await sb.from('post_shares').insert({post_id:id,user_id:user.id});if(sr.error&&sr.error.code!=='23505')console.warn('post_shares:',sr.error);await notify('Share','Someone shared your Trooth post.')}};
  }
  async function scan(){var sb=window.troothSupabase;if(!sb)return;var user=(await sb.auth.getUser()).data.user||null;document.querySelectorAll('.post[data-post-id]').forEach(function(p){enhancePost(p,sb,user)});}
  function start(){scan();var root=document.getElementById('feed')||document.body;new MutationObserver(function(){scan()}).observe(root,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
