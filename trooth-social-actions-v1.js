/* Trooth social actions v2: live counts + current-user Like state, without replacing the existing feed. */
(function(){
  'use strict';
  function sb(){ return window.troothSupabase; }
  function user(){ return window.currentUser || null; }
  function setCount(button,label,emoji,count){
    if(!button || count==null) return;
    button.setAttribute('data-count',String(count));
    button.innerHTML=emoji+' '+label+' <span class="trooth-count">'+count+'</span>';
  }
  function setLiked(button,liked){
    if(!button) return;
    button.classList.toggle('trooth-liked',!!liked);
    button.setAttribute('aria-pressed',liked?'true':'false');
    button.setAttribute('data-liked',liked?'1':'0');
  }
  async function refreshPost(article){
    var id=article && article.getAttribute('data-post-id');
    var s=sb();
    if(!id || !s || !s.from) return;
    try{
      var results=await Promise.all([
        s.from('post_likes').select('post_id',{count:'exact',head:true}).eq('post_id',id),
        s.from('comments').select('post_id',{count:'exact',head:true}).eq('post_id',id)
      ]);
      var likes=results[0] && results[0].count;
      var comments=results[1] && results[1].count;
      var buttons=article.querySelectorAll('.postactions .action');
      setCount(buttons[0],'Like','👍',likes);
      setCount(buttons[1],'Comment','💬',comments);
      if(buttons[2]) buttons[2].innerHTML='↗ Share';
      var u=user();
      if(u && buttons[0]){
        var mine=await s.from('post_likes').select('post_id').eq('post_id',id).eq('user_id',u.id).maybeSingle();
        setLiked(buttons[0],!!(mine && mine.data));
      }else if(buttons[0]) setLiked(buttons[0],false);
    }catch(e){
      /* Preserve the original feed actions if any live query is unavailable. */
    }
  }
  function enhance(){
    document.querySelectorAll('.post[data-post-id]').forEach(function(article){
      var actions=article.querySelector('.postactions');
      if(!actions) return;
      if(article.getAttribute('data-social-ready')!=='2'){
        article.setAttribute('data-social-ready','2');
        actions.addEventListener('click',function(){
          setTimeout(function(){refreshPost(article);},350);
          setTimeout(function(){refreshPost(article);},1200);
        });
      }
      refreshPost(article);
    });
  }
  function start(){
    enhance();
    if(window.MutationObserver && document.body){
      new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  window.addEventListener('trooth-supabase-ready',enhance);
})();
