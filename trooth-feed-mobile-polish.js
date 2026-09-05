// Trooth — Home Feed mobile polish
(function(){
  function boot(){
    if(document.getElementById('trooth-mobile-polish'))return;
    var style=document.createElement('style');style.id='trooth-mobile-polish';style.textContent=`
      .post{overflow:hidden}.postactions{align-items:stretch}.postactions .action{min-height:42px;transition:.15s}.postactions .action[data-liked="1"]{background:#d8f3dc;font-weight:900}.feed-meta{font-size:12px;color:#718276;padding-top:9px}.feed-comments{display:grid;gap:6px;margin-top:9px}.feed-comment{background:#f4f8f5;border-radius:12px;padding:8px 10px;font-size:13px}.feed-comment-compose{display:flex;gap:7px;margin-top:9px}.feed-comment-compose input{min-width:0;flex:1;border:1px solid #dcebe1;border-radius:20px;padding:10px 13px;outline:0;background:#fbfefc}.feed-comment-compose .btn{white-space:nowrap}.postmedia{display:block;width:100%;object-fit:contain}@media(max-width:650px){.post{padding:12px}.postactions{gap:4px}.postactions .action{font-size:12px;padding:8px 3px}.postbody{font-size:14px}.posthead{gap:8px}.postmedia{max-height:380px}.feed-comment-compose .btn{padding:8px 11px}}
    `;document.head.appendChild(style);
    function decorate(){document.querySelectorAll('.post').forEach(function(card){
      if(!card.dataset.postId){var b=card.querySelector('.postactions button');var m=b&&b.getAttribute('onclick')||'';var x=m.match(/likePost\\('([^']+)'\\)/);if(x)card.dataset.postId=x[1]}
      if(card.querySelector('[data-feed-actions]'))return;
      var actions=card.querySelector('.postactions');if(!actions)return;actions.dataset.feedActions='1';
      Array.from(actions.querySelectorAll('button')).forEach(function(b,i){b.dataset.action=i===0?'like':i===1?'comment':'share'});
      var meta=document.createElement('div');meta.className='feed-meta';meta.dataset.feedMeta='1';actions.parentNode.insertBefore(meta,actions);
      var comments=document.createElement('div');comments.className='feed-comments';comments.dataset.feedComments='1';actions.parentNode.insertBefore(comments,actions);
    }
    decorate();new MutationObserver(decorate).observe(document.getElementById('feed')||document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();