// Trooth Social Independent — Live post interactions
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var feed=document.getElementById('feed'); if(!feed)return;
    var esc=window.troothEsc||function(s){return String(s??'').replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})};
    var user=null;
    function decorate(){
      feed.querySelectorAll('.post').forEach(function(post){
        if(post.querySelector('.trooth-live-actions'))return;
        var id=(post.querySelector('[onclick*="likePost"]')?.getAttribute('onclick')||'').match(/likePost\('([^']+)'\)/)?.[1];
        if(!id)return;
        var old=post.querySelector('.postactions'); if(!old)return;
        old.classList.add('trooth-live-actions');
        var bar=document.createElement('div');bar.className='trooth-reaction-bar';
        bar.innerHTML='<span class="trooth-like-count">👍 0</span><span class="trooth-comment-count">💬 0 comments</span>';
        old.parentNode.insertBefore(bar,old);
        refresh(id,post);
      });
    }
    async function refresh(id,post){
      var lr=await sb.from('post_likes').select('user_id').eq('post_id',id);
      var cr=await sb.from('comments').select('id,user_id,body,created_at').eq('post_id',id).order('created_at',{ascending:false}).limit(5);
      var lc=post.querySelector('.trooth-like-count'),cc=post.querySelector('.trooth-comment-count');
      if(lc)lc.textContent='👍 '+((lr.data||[]).length);
      if(cc)cc.textContent='💬 '+((cr.data||[]).length)+' comments';
      var list=post.querySelector('.trooth-comments');
      if(!list){list=document.createElement('div');list.className='trooth-comments';post.appendChild(list)}
      list.innerHTML=(cr.data||[]).map(function(c){return '<div class="trooth-comment"><b>Trooth Member</b><span>'+esc(c.body)+'</span></div>'}).join('');
    }
    async function init(){user=(await sb.auth.getUser()).data.user||null;decorate();}
    var style=document.createElement('style');style.textContent='.trooth-reaction-bar{display:flex;justify-content:space-between;padding:8px 4px;color:#718276;font-size:13px;border-bottom:1px solid #e7efe9}.trooth-comments{margin-top:8px;display:grid;gap:6px}.trooth-comment{background:#f4f8f5;border-radius:12px;padding:8px 10px;font-size:13px}.trooth-comment b{margin-right:6px;color:#2d6a4f}.trooth-comment span{color:#334b3d}';document.head.appendChild(style);
    new MutationObserver(decorate).observe(feed,{childList:true,subtree:true});
    sb.channel('trooth-post-interactions-live').on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},function(e){var p=feed.querySelector('.post [onclick*="'+(e.new?.post_id||e.old?.post_id||'')+'"]');if(p){var post=p.closest('.post');if(post)refresh(e.new?.post_id||e.old?.post_id,post)}}).on('postgres_changes',{event:'*',schema:'public',table:'comments'},function(e){var id=e.new?.post_id||e.old?.post_id;var p=feed.querySelector('.post [onclick*="'+id+'"]');if(p){var post=p.closest('.post');if(post)refresh(id,post)}}).subscribe();
    init();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
