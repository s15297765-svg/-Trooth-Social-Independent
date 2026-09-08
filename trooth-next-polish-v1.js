// Trooth Social Independent — next safe UI polish
(function(){
  if(window.__troothNextPolishV1)return;
  window.__troothNextPolishV1=true;
  function sb(){return window.troothSupabase||null;}
  function ready(){if(sb())return Promise.resolve(sb());return new Promise(function(r){window.addEventListener('trooth-supabase-ready',function(){r(sb());},{once:true});});}
  async function decorate(){
    var s=sb(),feed=document.getElementById('feed');
    if(!s||!feed)return;
    var cards=[].slice.call(feed.querySelectorAll('[data-post-id]')),ids=cards.map(function(c){return c.getAttribute('data-post-id');}).filter(Boolean);
    if(!ids.length)return;
    try{
      var l=await s.from('post_likes').select('post_id').in('post_id',ids);
      var c=await s.from('comments').select('post_id').in('post_id',ids),lc={},cc={};
      (l.data||[]).forEach(function(x){lc[x.post_id]=(lc[x.post_id]||0)+1;});
      (c.data||[]).forEach(function(x){cc[x.post_id]=(cc[x.post_id]||0)+1;});
      cards.forEach(function(card){
        var id=card.getAttribute('data-post-id'),b=card.querySelectorAll('.postactions .action');
        if(b[0]){b[0].setAttribute('data-count',lc[id]||0);b[0].textContent='👍 Like '+(lc[id]||0);}
        if(b[1]){b[1].setAttribute('data-count',cc[id]||0);b[1].textContent='💬 Comment '+(cc[id]||0);}
      });
    }catch(e){}
  }
  function start(){var f=document.getElementById('feed');if(!f)return;new MutationObserver(function(){clearTimeout(window.__troothNextPolishTimer);window.__troothNextPolishTimer=setTimeout(decorate,300);}).observe(f,{childList:true,subtree:true});decorate();}
  ready().then(start);
})();
