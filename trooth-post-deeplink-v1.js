// Trooth Social Independent — post deep-link v2
(function(){
  if(window.__troothPostDeepLinkV2)return;
  window.__troothPostDeepLinkV2=true;
  function boot(){
    var qs=new URLSearchParams(location.search),postId=qs.get('post');
    if(!postId){var h=location.hash||'',m=h.match(/^#post-(.+)$/);if(m)postId=decodeURIComponent(m[1]);}
    if(!postId)return;
    function findPost(){
      var nodes=document.querySelectorAll('[data-post],[data-post-id],[data-postId]');
      for(var i=0;i<nodes.length;i++){
        var el=nodes[i],id=el.getAttribute('data-post')||el.getAttribute('data-post-id')||el.getAttribute('data-postId');
        if(id===postId)return el;
      }
      return null;
    }
    function reveal(){
      var el=findPost();
      if(!el)return false;
      if(!document.getElementById('trooth-post-deeplink-style')){
        var s=document.createElement('style');s.id='trooth-post-deeplink-style';s.textContent='.trooth-post-deeplink-focus{outline:3px solid rgba(105,199,154,.65)!important;box-shadow:0 12px 34px rgba(20,82,56,.18)!important;scroll-margin-top:90px;transition:outline .2s,box-shadow .2s!important}';document.head.appendChild(s);
      }
      el.classList.add('trooth-post-deeplink-focus');
      el.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(function(){el.classList.remove('trooth-post-deeplink-focus')},4500);
      return true;
    }
    var tries=0;
    function wait(){tries++;if(reveal()||tries>=30)return;setTimeout(wait,300)}
    wait();
    window.TroothPostDeepLink={open:function(id){if(id)location.href='index.html?post='+encodeURIComponent(id)}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
