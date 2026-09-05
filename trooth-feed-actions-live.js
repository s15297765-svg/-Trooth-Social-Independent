// Trooth — polished live Home Feed actions
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    async function uid(){var r=await sb.auth.getUser();return r.data&&r.data.user?r.data.user.id:null}
    async function refreshPost(postId){
      var cards=document.querySelectorAll('.post[data-post-id="'+postId+'"]');
      if(!cards.length)return;
      var userId=await uid();
      var [l,c,sh]=await Promise.all([
        sb.from('post_likes').select('user_id').eq('post_id',postId),
        sb.from('comments').select('id,user_id,body,created_at').eq('post_id',postId).order('created_at',{ascending:false}).limit(5),
        sb.from('post_shares').select('user_id').eq('post_id',postId)
      ]);
      var liked=userId&&(l.data||[]).some(x=>x.user_id===userId);
      cards.forEach(card=>{
        var a=card.querySelector('[data-feed-actions]'); if(!a)return;
        var like=a.querySelector('[data-action="like"]'),meta=card.querySelector('[data-feed-meta]');
        if(like){like.textContent='👍 '+(liked?'Liked':'Like')+' ('+(l.data||[]).length+')';like.dataset.liked=liked?'1':'0'}
        if(meta)meta.textContent=(l.data||[]).length+' Likes • '+(c.data||[]).length+' Comments • '+(sh.data||[]).length+' Shares';
        var box=card.querySelector('[data-feed-comments]');
        if(box)box.innerHTML=(c.data||[]).map(x=>'<div class="feed-comment"><b>💬</b> '+esc(x.body)+'</div>').join('');
      });
    }
    function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    async function refreshAll(){document.querySelectorAll('.post[data-post-id]').forEach(x=>refreshPost(x.dataset.postId))}
    window.likePost=async function(postId){var userId=await uid();if(!userId){location.href='auth.html';return}var q=await sb.from('post_likes').select('post_id').eq('post_id',postId).eq('user_id',userId).maybeSingle();if(q.error){alert(q.error.message);return}var r=q.data?await sb.from('post_likes').delete().eq('post_id',postId).eq('user_id',userId):await sb.from('post_likes').insert({post_id:postId,user_id:userId});if(r.error)alert(r.error.message);else await refreshPost(postId)};
    window.commentPost=async function(postId){var userId=await uid();if(!userId){location.href='auth.html';return}var card=document.querySelector('.post[data-post-id="'+postId+'"]');if(!card)return;var box=card.querySelector('[data-feed-comment-input]');if(!box){var wrap=document.createElement('div');wrap.className='feed-comment-compose';wrap.innerHTML='<input data-feed-comment-input placeholder="Write a comment…"><button class="btn" data-send-comment>Post</button>';card.appendChild(wrap);box=wrap.querySelector('input');wrap.querySelector('[data-send-comment]').onclick=async function(){var body=box.value.trim();if(!body)return;var r=await sb.from('comments').insert({post_id:postId,user_id:userId,body:body});if(r.error)alert(r.error.message);else{box.value='';await refreshPost(postId)}};box.onkeydown=function(e){if(e.key==='Enter')wrap.querySelector('[data-send-comment]').click()}}box.focus()};
    window.sharePost=async function(postId){var userId=await uid();if(!userId){location.href='auth.html';return}var r=await sb.from('post_shares').insert({post_id:postId,user_id:userId});if(r.error&&!String(r.error.message||'').toLowerCase().includes('duplicate')){alert(r.error.message);return}var url=location.origin+location.pathname+'?post='+encodeURIComponent(postId);try{if(navigator.share)await navigator.share({title:'Trooth Social Independent',text:'Check this post on Trooth',url:url});else if(navigator.clipboard)await navigator.clipboard.writeText(url);else prompt('Post link:',url)}catch(e){}await refreshPost(postId)};
    if(sb.channel){sb.channel('trooth-feed-actions-live-v2').on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},refreshAll).on('postgres_changes',{event:'*',schema:'public',table:'comments'},refreshAll).on('postgres_changes',{event:'*',schema:'public',table:'post_shares'},refreshAll).subscribe()}
    setTimeout(refreshAll,700);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();