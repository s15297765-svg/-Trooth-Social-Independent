// Trooth — open, highlight, and focus a post from notification/share links (v3)
(function(){
  if(window.__troothPostDeepLinkV3)return;window.__troothPostDeepLinkV3=true;
  function hydrate(root){
    (root||document).querySelectorAll('.post:not([data-post-id])').forEach(function(card){
      var btn=card.querySelector('[onclick*="likePost"],[onclick*="commentPost"],[onclick*="sharePost"]');
      if(!btn)return;
      var raw=btn.getAttribute('onclick')||'',m=raw.match(/(?:likePost|commentPost|sharePost)\(\\?['\"]([^'\"]+)["']\?\)/);
      if(m&&m[1])card.setAttribute('data-post-id',m[1]);
    });
  }
  function boot(){
    var postId=new URLSearchParams(location.search).get('post');
    hydrate(document);
    if(!postId)return;
    function find(){
      hydrate(document.getElementById('feed')||document);
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
    var root=document.getElementById('feed')||document.body,tries=0,timer=null;
    var obs=new MutationObserver(function(){if(find()){obs.disconnect();clearInterval(timer)}});
    obs.observe(root,{childList:true,subtree:true});
    timer=setInterval(function(){if(find()||++tries>40){clearInterval(timer);obs.disconnect()}},500);
    window.addEventListener('trooth-feed-refreshed',find);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();