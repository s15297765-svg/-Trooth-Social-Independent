// Trooth Social Independent — Feed ↔ Profile ↔ Post loop v2
(function(){
  if(window.__troothFeedProfileLoopV2)return;
  window.__troothFeedProfileLoopV2=true;
  function profileUrl(id){return 'auth.html?profile='+encodeURIComponent(id)}
  function decorate(root){
    root=root||document;
    var posts=root.querySelectorAll('[data-post],[data-post-id],[data-postId]');
    posts.forEach(function(post){
      var id=post.getAttribute('data-post')||post.getAttribute('data-post-id')||post.getAttribute('data-postId');
      if(!id)return;
      post.setAttribute('data-post-id',id);
      var authorId=post.getAttribute('data-user-id')||post.getAttribute('data-author-id');
      if(!authorId){
        var marked=post.querySelector('[data-user-id],[data-author-id]');
        if(marked)authorId=marked.getAttribute('data-user-id')||marked.getAttribute('data-author-id');
      }
      if(authorId){
        var targets=post.querySelectorAll('[data-author-name],[data-author-avatar]');
        targets.forEach(function(t){
          if(t.closest('a[data-trooth-profile]'))return;
          var a=document.createElement('a');
          a.href=profileUrl(authorId);
          a.setAttribute('data-trooth-profile','1');
          a.style.cssText='text-decoration:none;color:inherit;display:inline-flex;align-items:center';
          t.parentNode.insertBefore(a,t);a.appendChild(t);
        });
      }
      // Sharing is intentionally owned by feed-enhancements.js so one tap creates one share record.
      var share=post.querySelector('[data-share-post],[data-share]');
      if(share)share.removeAttribute('data-troothPostShareBound');
    });
  }
  function start(){
    decorate(document);
    if(!document.body)return;
    var obs=new MutationObserver(function(ms){
      ms.forEach(function(m){if(m.addedNodes&&m.addedNodes.length)decorate(m.target)})
    });
    obs.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
