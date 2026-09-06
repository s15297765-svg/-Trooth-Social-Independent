// Trooth Social Independent — realtime Like/Comment/Share notification bridge v2
(function(){
  if(window.__troothSocialActionNotifyV2)return;window.__troothSocialActionNotifyV2=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var user=null,seen={};
    async function who(){try{var r=await sb.auth.getUser();user=r.data&&r.data.user||null}catch(e){user=null}}
    function pick(d){d=d||{};return {postId:d.postId||d.contentId||d.post_id||d.content_id||d.id,ownerId:d.ownerId||d.authorId||d.userId||d.author_id||d.owner_id,actorId:d.actorId||d.actor_id||d.user_id||(user&&user.id)}}
    function refresh(kind){window.dispatchEvent(new CustomEvent('trooth-notifications-refresh',{detail:{source:'social-action-notify',kind:kind}}))}
    async function notify(kind,detail){
      if(!user)return;
      var x=pick(detail);if(!x.postId||!x.ownerId||x.ownerId===user.id||!x.actorId)return;
      var key=kind+':'+x.postId+':'+x.actorId;if(seen[key])return;
      var body=kind==='like'?'❤️ Someone liked your post':kind==='comment'?'💬 Someone commented on your post':'↗️ Someone shared your post';
      try{
        var r=await sb.from('notifications').insert({user_id:x.ownerId,actor_id:x.actorId,kind:kind,body:body,is_read:false});
        if(r.error)throw r.error;
        seen[key]=1;refresh(kind);
      }catch(e){console.warn('Trooth notification bridge:',e.message);delete seen[key]}
    }
    ['trooth-post-liked','trooth-comment-added','trooth-post-shared'].forEach(function(ev){
      window.addEventListener(ev,function(e){notify(ev==='trooth-post-liked'?'like':ev==='trooth-comment-added'?'comment':'share',e.detail||{})});
    });
    who();sb.auth.onAuthStateChange(function(){who();seen={};refresh('auth')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true})},{once:true});else if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
