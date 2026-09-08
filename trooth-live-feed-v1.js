// Trooth Live Feed v1 — mobile-safe engagement polish without replacing the existing Feed system
(function(){
  if(window.__troothLiveFeedV1)return;
  window.__troothLiveFeedV1=true;
  function client(){return window.troothSupabase||null;}
  function style(){
    if(document.getElementById('trooth-live-feed-style'))return;
    var s=document.createElement('style');s.id='trooth-live-feed-style';s.textContent='[data-post] .postActions button{transition:background .15s ease,transform .15s ease}[data-post] .postActions button.trooth-liked{background:#d8f3dc;color:#2d6a4f;font-weight:800}[data-post] .postActions button:active{transform:scale(.97)}@media(max-width:650px){[data-post] .postActions{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}[data-post] .postActions button{min-height:42px;padding:8px 4px;font-size:12px}}';document.head.appendChild(s);
  }
  async function refresh(){
    var sb=client(), feed=document.getElementById('feed');
    if(!sb||!feed)return;
    var cards=[].slice.call(feed.querySelectorAll('[data-post]'));if(!cards.length)return;
    var ids=cards.map(function(c){return c.getAttribute('data-post');}).filter(Boolean);
    try{
      var likes=await sb.from('post_likes').select('post_id,user_id').in('post_id',ids);
      var comments=await sb.from('comments').select('post_id').in('post_id',ids);
      var lc={},cc={},mine={};
      (likes.data||[]).forEach(function(x){lc[x.post_id]=(lc[x.post_id]||0)+1;if(window.troothCurrentUser&&x.user_id===window.troothCurrentUser.id)mine[x.post_id]=true;});
      (comments.data||[]).forEach(function(x){cc[x.post_id]=(cc[x.post_id]||0)+1;});
      cards.forEach(function(card){
        var id=card.getAttribute('data-post'),bs=card.querySelectorAll('.postActions button');
        if(bs[0]){bs[0].innerHTML='👍 Like <span class="trooth-like-count">'+(lc[id]||0)+'</span>';bs[0].classList.toggle('trooth-liked',!!mine[id]);}
        if(bs[1]){bs[1].innerHTML='💬 Comment <span class="trooth-comment-count">'+(cc[id]||0)+'</span>';}
      });
    }catch(e){}
  }
  function start(){
    style();
    var sb=client();
    if(sb)sb.auth.getUser().then(function(r){window.troothCurrentUser=r.data&&r.data.user||null;refresh();});
    var feed=document.getElementById('feed');if(!feed)return;
    new MutationObserver(function(){clearTimeout(window.__troothLiveFeedTimer);window.__troothLiveFeedTimer=setTimeout(refresh,350);}).observe(feed,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
