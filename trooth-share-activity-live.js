// Trooth Social Independent — Live Share + Activity
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var feed=document.getElementById('feed');if(!feed)return;
    if(window.troothShareActivityLiveReady)return;window.troothShareActivityLiveReady=true;
    var user=null,channel=null,timer=null,authSub=null,refreshing=new Set();
    function postId(post){
      var direct=post.getAttribute('data-post-id');if(direct)return direct;
      return (post.querySelector('[onclick*="likePost"]')?.getAttribute('onclick')||'').match(/likePost\(['"]([^'"]+)['"]\)/)?.[1]||null;
    }
    async function refreshShares(id,post){
      if(!id||!post||refreshing.has(id))return;refreshing.add(id);
      try{var r=await sb.from('post_shares').select('id').eq('post_id',id);if(r.error)return;var el=post.querySelector('.trooth-share-count');
        if(!el){el=document.createElement('span');el.className='trooth-share-count';var bar=post.querySelector('.trooth-reaction-bar')||post.querySelector('.postactions');if(bar)bar.parentNode.insertBefore(el,bar.nextSibling)}
        if(el)el.textContent='↗ '+((r.data||[]).length)+' shares';
      }finally{refreshing.delete(id)}
    }
    async function share(id,post){
      if(!user){alert('Please login to share this post.');return}
      var r=await sb.from('post_shares').insert({post_id:id,user_id:user.id});
      if(r.error&&r.error.code!=='23505'){console.error(r.error);alert('Share failed. Please try again.');return}
      await refreshShares(id,post);var url=location.origin+location.pathname+'?post='+encodeURIComponent(id);
      try{if(navigator.share)await navigator.share({title:'Trooth Social Independent',text:'Check this post on Trooth',url:url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('Post link copied!')}else prompt('Copy post link:',url)}catch(e){}
      window.dispatchEvent(new CustomEvent('trooth-post-shared',{detail:{postId:id}}));window.dispatchEvent(new CustomEvent('trooth-navigation-refresh',{detail:{type:'share',postId:id}}));
    }
    function decorate(){feed.querySelectorAll('.post').forEach(function(post){var id=postId(post);if(!id)return;post.setAttribute('data-post-id',id);if(!post.querySelector('.trooth-share-live')){var actions=post.querySelector('.postactions');if(!actions)return;var b=document.createElement('button');b.className='trooth-share-live';b.type='button';b.textContent='↗ Share';b.setAttribute('aria-label','Share this post');b.onclick=function(){share(id,post)};actions.appendChild(b)}refreshShares(id,post)})}
    var style=document.createElement('style');style.textContent='@media(max-width:650px){.trooth-share-live{min-height:42px;padding:9px 10px}.trooth-share-count{font-size:12px}}.trooth-share-live{border:0;background:transparent;color:#2d6a4f;font-weight:700;cursor:pointer;padding:8px 10px;border-radius:10px}.trooth-share-live:hover{background:#e8f5ed}.trooth-share-count{display:block;padding:6px 4px;color:#718276;font-size:13px}';document.head.appendChild(style);
    function cleanup(){clearTimeout(timer);timer=null;if(channel){try{sb.removeChannel(channel)}catch(e){}channel=null}if(authSub){try{authSub.unsubscribe()}catch(e){}authSub=null}window.troothShareActivityLiveChannel=null}
    function subscribe(){if(channel)return;channel=sb.channel('trooth-post-shares-live-'+(user?.id||'guest')).on('postgres_changes',{event:'*',schema:'public',table:'post_shares'},function(e){var id=e.new?.post_id||e.old?.post_id;if(!id)return;feed.querySelectorAll('.post').forEach(function(post){if(postId(post)===id)refreshShares(id,post)})}).subscribe();window.troothShareActivityLiveChannel=channel}
    async function syncAuth(){var r=await sb.auth.getUser();user=r.data&&r.data.user||null;if(user)subscribe();else cleanup();decorate()}
    new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(decorate,80)}).observe(feed,{childList:true,subtree:true});syncAuth();
    var ar=sb.auth.onAuthStateChange(function(event,session){user=session?.user||null;if(event==='SIGNED_OUT'||!session){cleanup();return}if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){cleanup();subscribe();decorate()}});authSub=ar&&ar.data&&ar.data.subscription||null;
    window.addEventListener('beforeunload',cleanup);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
