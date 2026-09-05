// Trooth — post deep-link resolver, highlight and focus (v5)
(function(){
  if(window.__troothPostDeepLinkV5)return;window.__troothPostDeepLinkV5=true;
  function getId(card){
    var existing=card.getAttribute('data-post-id');
    if(existing)return existing;
    var btn=card.querySelector('[onclick*="likePost"],[onclick*="commentPost"],[onclick*="sharePost"]');
    if(!btn)return '';
    var raw=btn.getAttribute('onclick')||'';
    var m=raw.match(/(?:likePost|commentPost|sharePost)\s*\(\s*[\'\"]([^\'\"]+)[\'\"]\s*\)/);
    if(m&&m[1]){card.setAttribute('data-post-id',m[1]);return m[1];}
    return '';
  }
  function hydrate(root){(root||document).querySelectorAll('.post').forEach(function(card){getId(card);});}
  function readPostId(){
    var q=new URLSearchParams(location.search).get('post');
    if(q)return q;
    var h=location.hash||'';
    var m=h.match(/^#post-(.+)$/);
    return m?decodeURIComponent(m[1]):'';
  }
  function boot(){
    var postId=readPostId();
    hydrate(document);
    if(!postId)return;
    var highlighted=null;
    function find(){
      var root=document.getElementById('feed')||document;
      hydrate(root);
      var cards=root.querySelectorAll('.post');
      for(var i=0;i<cards.length;i++){
        if(getId(cards[i])===postId){
          var card=cards[i];
          if(highlighted===card)return true;
          highlighted=card;
          card.setAttribute('tabindex','-1');
          card.setAttribute('aria-label','Trooth post '+postId);
          card.style.transition='box-shadow .25s,transform .25s';
          card.style.boxShadow='0 0 0 4px #74c69d,0 8px 30px #16653433';
          card.scrollIntoView({behavior:'smooth',block:'center'});
          try{card.focus({preventScroll:true})}catch(e){}
          setTimeout(function(){if(highlighted===card)card.style.boxShadow=''},5000);
          return true;
        }
      }
      return false;
    }
    if(find())return;
    var root=document.getElementById('feed')||document.body,tries=0,timer=null;
    var obs=new MutationObserver(function(){if(find()){obs.disconnect();clearInterval(timer)}});
    obs.observe(root,{childList:true,subtree:true});
    timer=setInterval(function(){if(find()||++tries>40){clearInterval(timer);obs.disconnect()}},500);
    window.addEventListener('trooth-feed-refreshed',find);
    window.addEventListener('hashchange',function(){postId=readPostId();highlighted=null;find();});
    window.addEventListener('beforeunload',function(){clearInterval(timer);obs.disconnect();},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();