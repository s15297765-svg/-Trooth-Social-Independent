(function(){
  if(window.__troothFeedReliabilityV1)return;window.__troothFeedReliabilityV1=true;
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003';document.body.appendChild(t);setTimeout(function(){t.remove()},2000)}
  async function savePost(id){
    if(!window.sb||!window.user){location.href='auth.html';return}
    var q=await sb.from('saved_posts').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle();
    if(q.error){toast(q.error.message||'Save unavailable');return}
    if(q.data){var d=await sb.from('saved_posts').delete().eq('id',q.data.id);if(d.error){toast(d.error.message||'Could not remove save');return}toast('🔖 Removed from Saved')}
    else{var i=await sb.from('saved_posts').insert({post_id:id,user_id:user.id});if(i.error){toast(i.error.message||'Could not save post');return}toast('🔖 Post saved')}
    if(window.renderPosts)renderPosts();
  }
  async function sharePostReliable(id){
    if(!window.sb||!window.user){location.href='auth.html';return}
    var url=location.origin+location.pathname+'#post-'+encodeURIComponent(id),ok=false;
    try{if(navigator.share){await navigator.share({title:'Trooth',text:'Check this post on Trooth',url:url});ok=true}else if(navigator.clipboard){await navigator.clipboard.writeText(url);ok=true;toast('🔗 Post link copied')}}catch(e){if(e&&e.name==='AbortError')return;if(navigator.clipboard)try{await navigator.clipboard.writeText(url);ok=true;toast('🔗 Post link copied')}catch(_){} }
    if(ok){var q=await sb.from('shares').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle();if(!q.error&&!q.data)await sb.from('shares').insert({post_id:id,user_id:user.id});toast('↗️ Shared')}
  }
  async function likePostReliable(id){
    if(!window.sb||!window.user){location.href='auth.html';return}
    var q=await sb.from('post_likes').select('post_id').eq('post_id',id).eq('user_id',user.id).maybeSingle();
    if(q.error){toast(q.error.message||'Like unavailable');return}
    var r=q.data?await sb.from('post_likes').delete().eq('post_id',id).eq('user_id',user.id):await sb.from('post_likes').insert({post_id:id,user_id:user.id});
    if(r.error){toast(r.error.message||'Like failed');return}
    var c=await sb.from('post_likes').select('post_id',{count:'exact',head:true}).eq('post_id',id),el=document.getElementById('lc-'+id);if(el)el.textContent=c.count||0;toast(q.data?'Like removed':'❤️ Liked')
  }
  window.savePost=savePost;window.sharePost=sharePostReliable;window.likePost=likePostReliable;
  function enhance(){
    document.querySelectorAll('.post').forEach(function(card){
      var id=card.getAttribute('data-post');if(!id||card.querySelector('[data-trooth-save]'))return;
      var bar=card.querySelector('.postActions');if(!bar)return;
      var b=document.createElement('button');b.type='button';b.setAttribute('data-trooth-save','1');b.textContent='🔖 Save';b.onclick=function(){savePost(id)};bar.appendChild(b);
    });
  }
  var oldRender=window.renderPosts;window.renderPosts=function(){var r=oldRender&&oldRender.apply(this,arguments);setTimeout(enhance,0);return r};
  document.addEventListener('DOMContentLoaded',function(){setTimeout(enhance,500)});
})();
