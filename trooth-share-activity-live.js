// Trooth Social Independent — Live Share + Activity
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var feed=document.getElementById('feed');if(!feed)return;
    var esc=window.troothEsc||function(s){return String(s??'').replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})};
    function decorate(){
      feed.querySelectorAll('.post').forEach(function(post){
        if(post.querySelector('.trooth-share-live'))return;
        var id=(post.querySelector('[onclick*="likePost"]')?.getAttribute('onclick')||'').match(/likePost\('([^']+)'\)/)?.[1];if(!id)return;
        var actions=post.querySelector('.postactions');if(!actions)return;
        var b=document.createElement('button');b.className='trooth-share-live';b.type='button';b.textContent='↗ Share';
        b.onclick=function(){share(id,post)};actions.appendChild(b);
      });
    }
    async function share(id,post){
      var url=location.origin+location.pathname+'?post='+encodeURIComponent(id);
      try{if(navigator.share){await navigator.share({title:'Trooth Social Independent',text:'Check this post on Trooth',url:url})}else if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('Post link copied!')}else{prompt('Copy post link:',url)}}catch(e){}
      window.dispatchEvent(new CustomEvent('trooth-post-shared',{detail:{postId:id}}));
    }
    var style=document.createElement('style');style.textContent='.trooth-share-live{border:0;background:transparent;color:#2d6a4f;font-weight:700;cursor:pointer;padding:8px 10px;border-radius:10px}.trooth-share-live:hover{background:#e8f5ed}';document.head.appendChild(style);
    new MutationObserver(decorate).observe(feed,{childList:true,subtree:true});decorate();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();