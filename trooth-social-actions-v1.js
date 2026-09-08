/* Trooth social actions v4: live counts + current-user Like state + instant feedback, without replacing the existing feed. */
(function(){
  'use strict';
  var authUserPromise=null;
  function sb(){ return window.troothSupabase; }
  function user(){ return window.currentUser || null; }
  function currentUser(){
    var u=user();
    if(u) return Promise.resolve(u);
    var s=sb();
    if(!s || !s.auth || !s.auth.getUser) return Promise.resolve(null);
    if(!authUserPromise){
      authUserPromise=s.auth.getUser().then(function(r){
        return r && r.data && r.data.user || null;
      }).catch(function(){ return null; });
    }
    return authUserPromise;
  }
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
    button.style.fontWeight=liked?'700':'';
    button.style.transform=liked?'translateY(-1px)':'';
    button.style.filter=liked?'brightness(.9)':'';
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
      var u=await currentUser();
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
      if(article.getAttribute('data-social-ready')!=='4'){
        article.setAttribute('data-social-ready','4');
        actions.addEventListener('click',function(ev){
          var target=ev.target && ev.target.closest ? ev.target.closest('.action') : null;
          if(target && target.parentElement===actions && target===actions.querySelector('.action')){
            var liked=target.getAttribute('data-liked')==='1';
            setLiked(target,!liked);
          }
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
  window.addEventListener('trooth-supabase-ready',function(){ authUserPromise=null; enhance(); });
  window.addEventListener('trooth-auth-changed',function(){ authUserPromise=null; enhance(); });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
