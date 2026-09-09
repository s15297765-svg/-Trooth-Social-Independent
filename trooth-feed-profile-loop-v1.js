// Trooth Social Independent — Feed ↔ Profile ↔ Post loop v4
(function(){
  if(window.__troothFeedProfileLoopV4)return;
  window.__troothFeedProfileLoopV4=true;
  var lookupRunning=false,lookupAgain=false;
  function profileUrl(id){return 'auth.html?profile='+encodeURIComponent(id)}
  function decorate(root){
    root=root||document;
    var posts=root.querySelectorAll('[data-post],[data-post-id],[data-postId]');
    posts.forEach(function(post){
      var id=post.getAttribute('data-post')||post.getAttribute('data-post-id')||post.getAttribute('data-postId');
      if(!id)return;
      post.setAttribute('data-post-id',id);
      var authorId=post.getAttribute('data-user-id')||post.getAttribute('data-author-id');
      if(authorId)decorateAuthor(post,authorId);
    });
  }
  function decorateAuthor(post,authorId){
    post.setAttribute('data-user-id',authorId);
    var head=post.querySelector('.posthead');
    if(head&&!head.querySelector('a[data-trooth-profile]')){
      var targets=head.querySelectorAll('.avatar,.posthead b');
      targets.forEach(function(t){
        if(t.closest('a[data-trooth-profile]'))return;
        var a=document.createElement('a');
        a.href=profileUrl(authorId);
        a.setAttribute('data-trooth-profile','1');
        a.style.cssText='text-decoration:none;color:inherit;display:inline-flex;align-items:center';
        t.parentNode.insertBefore(a,t);a.appendChild(t);
      });
    }
    post.querySelectorAll('[data-author-name],[data-author-avatar]').forEach(function(t){
      if(t.closest('a[data-trooth-profile]'))return;
      var a=document.createElement('a');
      a.href=profileUrl(authorId);a.setAttribute('data-trooth-profile','1');
      a.style.cssText='text-decoration:none;color:inherit;display:inline-flex;align-items:center';
      t.parentNode.insertBefore(a,t);a.appendChild(t);
    });
  }
  function getSupabase(){return window.troothSupabase||null}
  async function resolveAuthors(){
    if(lookupRunning){lookupAgain=true;return}
    var s=getSupabase();if(!s)return;
    lookupRunning=true;
    try{
      var nodes=Array.prototype.slice.call(document.querySelectorAll('[data-post],[data-post-id],[data-postId]'));
      var ids=[];
      nodes.forEach(function(post){
        var id=post.getAttribute('data-post')||post.getAttribute('data-post-id')||post.getAttribute('data-postId');
        if(id&&!post.getAttribute('data-user-id')&&ids.indexOf(id)<0)ids.push(id);
      });
      if(!ids.length)return;
      var r=await s.from('posts').select('id,user_id').in('id',ids);
      if(r.error)return;
      var map={};(r.data||[]).forEach(function(x){map[String(x.id)]=x.user_id});
      nodes.forEach(function(post){
        var id=post.getAttribute('data-post')||post.getAttribute('data-post-id')||post.getAttribute('data-postId');
        var uid=map[String(id)];
        if(uid)decorateAuthor(post,uid);
      });
    }finally{
      lookupRunning=false;
      if(lookupAgain){lookupAgain=false;setTimeout(resolveAuthors,120)}
    }
  }
  function sync(){decorate(document);resolveAuthors()}
  function start(){
    sync();
    if(!document.body)return;
    var obs=new MutationObserver(function(ms){
      var changed=false;
      ms.forEach(function(m){if(m.addedNodes&&m.addedNodes.length)changed=true});
      if(changed){decorate(document);resolveAuthors()}
    });
    obs.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('trooth-post-update',function(){setTimeout(sync,250)});
    window.addEventListener('trooth-supabase-ready',function(){setTimeout(sync,120)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
