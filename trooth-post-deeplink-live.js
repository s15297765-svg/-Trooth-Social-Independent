// Trooth — open, highlight, and focus a post from notification/share links (v2)
(function(){
  if(window.__troothPostDeepLinkV2)return;window.__troothPostDeepLinkV2=true;
  function boot(){
    var postId=new URLSearchParams(location.search).get('post');
    if(!postId)return;
    function find(){
      var card=document.querySelector('.post[data-post-id="'+CSS.escape(postId)+'"]');
      if(!card)return false;
      card.setAttribute('tabindex','-1');
      card.style.transition='box-shadow .25s,transform .25s';
      card.style.boxShadow='0 0 0 4px #74c69d,0 8px 30px #16653433';
      card.scrollIntoView({behavior:'smooth',block:'center'});
      try{card.focus({preventScroll:true})}catch(e){}
      setTimeout(function(){card.style.boxShadow=''},5000);
      return true;
    }
    if(find())return;
    var root=document.getElementById('feed')||document.body,tries=0;
    var obs=new MutationObserver(function(){if(find()){obs.disconnect();clearInterval(timer)}});
    obs.observe(root,{childList:true,subtree:true});
    var timer=setInterval(function(){if(find()||++tries>40){clearInterval(timer);obs.disconnect()}},500);
    window.addEventListener('trooth-feed-refreshed',find,{once:false});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();