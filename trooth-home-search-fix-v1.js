// Trooth Social Independent — Home search safety bridge v1
// Keeps the existing Home search input functional without changing the feed architecture.
(function(){
  if(window.__troothHomeSearchFixV1)return;
  window.__troothHomeSearchFixV1=true;
  window.filterPosts=function(){
    var input=document.getElementById('search');
    var query=String(input&&input.value||'').trim().toLowerCase();
    document.querySelectorAll('#feed .post').forEach(function(post){
      var text=String(post.getAttribute('data-text')||post.textContent||'').toLowerCase();
      post.style.display=!query||text.indexOf(query)!==-1?'':'none';
    });
  };
  window.addEventListener('trooth-home-live-refresh',window.filterPosts);
})();
