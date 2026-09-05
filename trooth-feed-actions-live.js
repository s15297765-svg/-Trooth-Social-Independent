// Trooth — polished live Home Feed actions v4
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    if(window.troothFeedActionsLiveV4)return;window.troothFeedActionsLiveV4=true;
    var refreshTimer=null,refreshing={};
    async function uid(){var r=await sb.auth.getUser();return r.data&&r.data.user?r.data.user.id:null}
    function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    async function refreshPost(postId){
      if(!postId||refreshing[postId])return;refreshing[postId]=true;
      try{
        var cards=document.querySelectorAll('.post[data-post-id="'+postId+'"]');if(!cards.length)return;
        var userId=await uid();
        var [l,c,sh]=await Promise.all([
          sb.from('post_likes').select('user_id').eq('post_id',postId),
          sb.from('comments').select('id,user_id,body,created_at').eq('post_id',postId).order('created_at',{ascending:false}).limit(5),
          sb.from('post_shares').select('user_id').eq('post_id',postId)
        ]);
        if(l.error||c.error||sh.error)return;
        var liked=userId&&(l.data||[]).some(x=>x.user_id===userId);
        cards.forEach(card=>{
          var a=card.querySelector('[data-feed-actions]'),meta=card.querySelector('[data-feed-meta]');
          if(a){var like=a.querySelector('[data-action="like"]');if(like){like.textContent='👍 '+(liked?'Liked':'Like')+' ('+(l.data||[]).length+')';like.dataset.liked=liked?'1':'0';like.setAttribute('aria-pressed',liked?'true':'false')}}
          if(meta)meta.textContent=(l.data||[]).length+' Likes • '+(c.data||[]).length+' Comments • '+(sh.data||[]).length+' Shares';
          var box=card.querySelector('[data-feed-comments]');
          if(box)box.innerHTML=(c.data||[]).map(x=>'<div class="feed-comment"><b>💬</b> '+esc(x.body)+'</div>').join('');
        });
      }finally{delete refreshing[postId]}
    }
    function refreshAll(){
      clearTimeout(refreshTimer);refreshTimer=setTimeout(function(){
        document.querySelectorAll('.post[data-post-id]').forEach(x=>refreshPost(x.dataset.postId));
      },140);
    }
    function refreshFromRealtime(payload){
      var id=payload&&((payload.new&&payload.new.post_id)||(payload.old&&payload.old.post_id));
      if(id)refreshPost(id);else refreshAll();
    }
    window.likePost=async function(postId){
      var userId=await uid();if(!userId){location.href='auth.html';return}
      var q=await sb.from('post_likes').select('post_id').eq('post_id',postId).eq('user_id',userId).maybeSingle();
      if(q.error){alert(q.error.message);return}
      var r=q.data?await sb.from('post_likes').delete().eq('post_id',postId).eq('user_id',userId):await sb.from('post_likes').insert({post_id:postId,user_id:userId});
      if(r.error)alert(r.error.message);else{await refreshPost(postId);window.dispatchEvent(new CustomEvent('trooth-post-liked',{detail:{postId:postId,liked:!q.data}}));}
    };
    window.commentPost=async function(postId){
      var userId=await uid();if(!userId){location.href='auth.html';return}
      var card=document.querySelector('.post[data-post-id="'+postId+'"]');if(!card)return;
      var box=card.querySelector('[data-feed-comment-input]');
      if(!box){var wrap=document.createElement('div');wrap.className='feed-comment-compose';wrap.innerHTML='<input data-feed-comment-input maxlength="1000" placeholder="Write a comment…"><button class="btn" data-send-comment>Post</button>';card.appendChild(wrap);box=wrap.querySelector('input');wrap.querySelector('[data-send-comment]').onclick=async function(){var body=box.value.trim();if(!body)return;var r=await sb.from('comments').insert({post_id:postId,user_id:userId,body:body});if(r.error)alert(r.error.message);else{box.value='';await refreshPost(postId);window.dispatchEvent(new CustomEvent('trooth-comment-added',{detail:{postId:postId}}));}};box.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();wrap.querySelector('[data-send-comment]').click()}}}
      box.focus();
    };
    window.sharePost=async function(postId){
      var userId=await uid();if(!userId){location.href='auth.html';return}
      var existing=await sb.from('post_shares').select('id').eq('post_id',postId).eq('user_id',userId).maybeSingle();
      if(existing.error){alert(existing.error.message);return}
      if(!existing.data){var r=await sb.from('post_shares').insert({post_id:postId,user_id:userId});if(r.error&&r.error.code!=='23505'){alert(r.error.message);return}}
      var url=location.origin+location.pathname+'?post='+encodeURIComponent(postId);
      try{if(navigator.share)await navigator.share({title:'Trooth Social Independent',text:'Check this post on Trooth',url:url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('Post link copied!')}else prompt('Post link:',url)}catch(e){}
      await refreshPost(postId);window.dispatchEvent(new CustomEvent('trooth-post-shared',{detail:{postId:postId}}));
    };
    if(sb.channel)sb.channel('trooth-feed-actions-live-v4').on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},refreshFromRealtime).on('postgres_changes',{event:'*',schema:'public',table:'comments'},refreshFromRealtime).on('postgres_changes',{event:'*',schema:'public',table:'post_shares'},refreshFromRealtime).subscribe();
    window.addEventListener('trooth-feed-refreshed',refreshAll);window.addEventListener('trooth-home-hub-refresh',refreshAll);
    setTimeout(refreshAll,700);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
