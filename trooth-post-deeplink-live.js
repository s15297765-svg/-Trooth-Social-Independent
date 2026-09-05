// Trooth — open and highlight a post from notification/share links
(function(){
  function boot(){
    var postId=new URLSearchParams(location.search).get('post');
    if(!postId)return;
    function find(){
      var card=document.querySelector('.post[data-post-id="'+CSS.escape(postId)+'"]');
      if(!card)return false;
      card.style.transition='box-shadow .25s,transform .25s';card.style.boxShadow='0 0 0 4px #22c55e,0 8px 30px #16653433';card.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(function(){card.style.boxShadow='';},5000);return true;
    }
    if(find())return;
    var root=document.getElementById('feed')||document.body,tries=0;
    var obs=new MutationObserver(function(){if(find()){obs.disconnect()}});obs.observe(root,{childList:true,subtree:true});
    var timer=setInterval(function(){if(find()||++tries>30){clearInterval(timer);obs.disconnect()}},500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();