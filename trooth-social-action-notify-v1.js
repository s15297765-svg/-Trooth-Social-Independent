// Trooth Social Independent — realtime Like/Comment/Share notification bridge v1
(function(){
  if(window.__troothSocialActionNotifyV1)return;window.__troothSocialActionNotifyV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var user=null,seen={};
    async function who(){try{var r=await sb.auth.getUser();user=r.data&&r.data.user||null}catch(e){user=null}}
    function pick(d){d=d||{};return {postId:d.postId||d.contentId||d.id||d.post_id,ownerId:d.ownerId||d.authorId||d.userId||d.author_id,actorId:d.actorId||d.user_id||user&&user.id}}
    async function notify(kind,detail){
      if(!user)return;var x=pick(detail);if(!x.postId||!x.ownerId||x.ownerId===user.id)return;
      var key=kind+':'+x.postId+':'+x.actorId;if(seen[key])return;seen[key]=1;
      var body=kind==='like'?'❤️ Someone liked your post':kind==='comment'?'💬 Someone commented on your post':'↗️ Someone shared your post';
      try{await sb.from('notifications').insert({user_id:x.ownerId,actor_id:x.actorId,kind:kind,body:body,is_read:false});window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'social-action-notify',kind:kind}}))}catch(e){console.warn('Trooth notification bridge:',e.message)}
    }
    ['trooth-post-liked','trooth-comment-added','trooth-post-shared'].forEach(function(ev){window.addEventListener(ev,function(e){notify(ev==='trooth-post-liked'?'like':ev==='trooth-comment-added'?'comment':'share',e.detail||{})})});
    who();sb.auth.onAuthStateChange(function(){who()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true})},{once:true});else if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
