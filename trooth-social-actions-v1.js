/* Trooth social actions v1: adds live Like/Comment counts without replacing the existing feed. */
(function(){
  'use strict';
  function sb(){ return window.troothSupabase; }
  async function refreshPost(article){
    var id=article && article.getAttribute('data-post-id');
    var s=sb();
    if(!id || !s) return;
    var results=await Promise.all([
      s.from('post_likes').select('post_id',{count:'exact',head:true}).eq('post_id',id),
      s.from('comments').select('post_id',{count:'exact',head:true}).eq('post_id',id)
    ]);
    var likes=results[0] && results[0].count;
    var comments=results[1] && results[1].count;
    var buttons=article.querySelectorAll('.postactions .action');
    if(buttons[0] && likes!=null) buttons[0].setAttribute('data-count',likes);
    if(buttons[1] && comments!=null) buttons[1].setAttribute('data-count',comments);
    if(buttons[0] && likes!=null) buttons[0].innerHTML='👍 Like <span class="trooth-count">'+likes+'</span>';
    if(buttons[1] && comments!=null) buttons[1].innerHTML='💬 Comment <span class="trooth-count">'+comments+'</span>';
    if(buttons[2]) buttons[2].innerHTML='↗ Share';
  }
  function enhance(){
    document.querySelectorAll('.post[data-post-id]').forEach(function(article){
      if(article.getAttribute('data-social-ready')==='1') return;
      article.setAttribute('data-social-ready','1');
      var actions=article.querySelector('.postactions');
      if(!actions) return;
      actions.addEventListener('click',function(){ setTimeout(function(){refreshPost(article);},350); });
      refreshPost(article);
    });
  }
  function start(){
    enhance();
    new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  window.addEventListener('trooth-supabase-ready',enhance);
})();
