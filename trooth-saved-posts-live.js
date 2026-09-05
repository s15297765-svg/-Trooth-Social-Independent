// Trooth Social Independent — Saved Posts
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var feed=document.getElementById('feed');if(!feed)return;
    var user=null;
    function getId(post){return (post.querySelector('[onclick*="likePost"]')?.getAttribute('onclick')||'').match(/likePost\('([^']+)'\)/)?.[1]||null;}
    async function refreshButton(id,post){
      if(!user)return;
      var r=await sb.from('saved_posts').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle();
      var b=post.querySelector('.trooth-save-live');if(b){b.textContent=r.data?'🔖 Saved':'🔖 Save';b.setAttribute('aria-pressed',r.data?'true':'false');}
    }
    async function toggle(id,post){
      if(!user){location.href='auth.html';return;}
      var r=await sb.from('saved_posts').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle();
      if(r.error){console.error(r.error);return;}
      if(r.data){var d=await sb.from('saved_posts').delete().eq('id',r.data.id);if(d.error){alert('Unable to remove saved post.');return}}
      else{var i=await sb.from('saved_posts').insert({post_id:id,user_id:user.id});if(i.error&&i.error.code!=='23505'){alert('Unable to save post.');return}}
      refreshButton(id,post);window.dispatchEvent(new CustomEvent('trooth-saved-posts-changed'));
    }
    function decorate(){feed.querySelectorAll('.post').forEach(function(post){var id=getId(post);if(!id||post.querySelector('.trooth-save-live'))return;var actions=post.querySelector('.postactions');if(!actions)return;var b=document.createElement('button');b.className='action trooth-save-live';b.type='button';b.textContent='🔖 Save';b.onclick=function(){toggle(id,post)};actions.appendChild(b);if(user)refreshButton(id,post)})}
    var style=document.createElement('style');style.textContent='.trooth-save-live[aria-pressed="true"]{background:#d8f3dc;color:#1b5e3a}.trooth-save-live{font-weight:800}';document.head.appendChild(style);
    new MutationObserver(decorate).observe(feed,{childList:true,subtree:true});
    sb.auth.getUser().then(function(r){user=r.data&&r.data.user||null;decorate()});
    sb.auth.onAuthStateChange(function(_e,s){user=s?.user||null;decorate()});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();