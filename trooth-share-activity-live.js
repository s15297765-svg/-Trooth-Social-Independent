// Trooth Social Independent — Live Share + Activity
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var feed=document.getElementById('feed');if(!feed)return;
    var esc=window.troothEsc||function(s){return String(s??'').replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})};
    var user=null;
    function postId(post){return (post.querySelector('[onclick*="likePost"]')?.getAttribute('onclick')||'').match(/likePost\('([^']+)'\)/)?.[1]||null;}
    async function refreshShares(id,post){
      var r=await sb.from('post_shares').select('id').eq('post_id',id);
      var n=(r.data||[]).length;
      var el=post.querySelector('.trooth-share-count');
      if(!el){el=document.createElement('span');el.className='trooth-share-count';var bar=post.querySelector('.trooth-reaction-bar')||post.querySelector('.postactions');if(bar)bar.parentNode.insertBefore(el,bar.nextSibling);}
      el.textContent='↗ '+n+' shares';
    }
    async function share(id,post){
      if(!user){alert('Please login to share this post.');return;}
      var r=await sb.from('post_shares').insert({post_id:id,user_id:user.id});
      if(r.error && r.error.code!=='23505'){console.error(r.error);alert('Share failed. Please try again.');return;}
      await refreshShares(id,post);
      var url=location.origin+location.pathname+'?post='+encodeURIComponent(id);
      try{if(navigator.share){await navigator.share({title:'Trooth Social Independent',text:'Check this post on Trooth',url:url})}else if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('Post link copied!')}else{prompt('Copy post link:',url)}}catch(e){}
      window.dispatchEvent(new CustomEvent('trooth-post-shared',{detail:{postId:id}}));
    }
    function decorate(){
      feed.querySelectorAll('.post').forEach(function(post){
        var id=postId(post);if(!id)return;
        if(!post.querySelector('.trooth-share-live')){
          var actions=post.querySelector('.postactions');if(!actions)return;
          var b=document.createElement('button');b.className='trooth-share-live';b.type='button';b.textContent='↗ Share';b.onclick=function(){share(id,post)};actions.appendChild(b);
        }
        refreshShares(id,post);
      });
    }
    var style=document.createElement('style');style.textContent='.trooth-share-live{border:0;background:transparent;color:#2d6a4f;font-weight:700;cursor:pointer;padding:8px 10px;border-radius:10px}.trooth-share-live:hover{background:#e8f5ed}.trooth-share-count{display:block;padding:6px 4px;color:#718276;font-size:13px}';document.head.appendChild(style);
    new MutationObserver(decorate).observe(feed,{childList:true,subtree:true});
    sb.channel('trooth-post-shares-live').on('postgres_changes',{event:'*',schema:'public',table:'post_shares'},function(e){var id=e.new?.post_id||e.old?.post_id;if(!id)return;feed.querySelectorAll('.post').forEach(function(post){if(postId(post)===id)refreshShares(id,post)});}).subscribe();
    sb.auth.getUser().then(function(r){user=r.data&&r.data.user||null;decorate();});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();