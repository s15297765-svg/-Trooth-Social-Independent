// Trooth Social Independent — Live Comment Composer
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var feed=document.getElementById('feed');if(!feed)return;
    var user=null;
    function getId(post){return (post.querySelector('[onclick*="likePost"]')?.getAttribute('onclick')||'').match(/likePost\('([^']+)'\)/)?.[1]||null;}
    async function addComment(id,post,input){
      var body=(input.value||'').trim();if(!body)return;
      if(!user){alert('Please login to comment.');return;}
      var r=await sb.from('comments').insert({post_id:id,user_id:user.id,body:body});
      if(r.error){console.error(r.error);alert('Comment failed. Please try again.');return;}
      input.value='';
      window.dispatchEvent(new CustomEvent('trooth-comment-added',{detail:{postId:id}}));
    }
    function decorate(){
      feed.querySelectorAll('.post').forEach(function(post){
        if(post.querySelector('.trooth-comment-composer'))return;
        var id=getId(post);if(!id)return;
        var box=document.createElement('div');box.className='trooth-comment-composer';
        box.innerHTML='<input type="text" maxlength="1000" placeholder="Write a comment…" aria-label="Write a comment"><button type="button">Comment</button>';
        var input=box.querySelector('input'),btn=box.querySelector('button');
        btn.onclick=function(){addComment(id,post,input)};
        input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addComment(id,post,input)}});
        var comments=post.querySelector('.trooth-comments');
        if(comments)comments.parentNode.insertBefore(box,comments);else post.appendChild(box);
      });
    }
    var style=document.createElement('style');style.textContent='.trooth-comment-composer{display:flex;gap:8px;margin-top:8px}.trooth-comment-composer input{flex:1;min-width:0;border:1px solid #d9e8df;border-radius:20px;padding:10px 13px;outline:none;background:#fff}.trooth-comment-composer input:focus{border-color:#74b98c}.trooth-comment-composer button{border:0;border-radius:20px;padding:9px 14px;background:#2d6a4f;color:#fff;font-weight:700;cursor:pointer}.trooth-comment-composer button:hover{opacity:.9}';document.head.appendChild(style);
    new MutationObserver(decorate).observe(feed,{childList:true,subtree:true});
    sb.auth.getUser().then(function(r){user=r.data&&r.data.user||null;decorate();});
    sb.channel('trooth-comments-composer-live').on('postgres_changes',{event:'INSERT',schema:'public',table:'comments'},function(e){var id=e.new?.post_id;if(id)decorate();}).subscribe();
    decorate();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();