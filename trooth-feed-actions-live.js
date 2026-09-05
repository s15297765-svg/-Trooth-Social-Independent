// Trooth — polished live Home Feed actions
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    async function uid(){var r=await sb.auth.getUser();return r.data&&r.data.user?r.data.user.id:null}
    window.likePost=async function(postId){
      var userId=await uid();if(!userId){location.href='auth.html';return}
      var q=await sb.from('post_likes').select('post_id').eq('post_id',postId).eq('user_id',userId).maybeSingle();
      if(q.error){alert(q.error.message);return}
      var r=q.data?await sb.from('post_likes').delete().eq('post_id',postId).eq('user_id',userId):await sb.from('post_likes').insert({post_id:postId,user_id:userId});
      if(r.error)alert(r.error.message);else window.dispatchEvent(new CustomEvent('trooth-feed-action',{detail:{type:'like',postId:postId}}));
    };
    window.commentPost=async function(postId){
      var userId=await uid();if(!userId){location.href='auth.html';return}
      var body=prompt('اپنا Comment لکھیں:');if(!body||!body.trim())return;
      var r=await sb.from('comments').insert({post_id:postId,user_id:userId,body:body.trim()});
      if(r.error)alert(r.error.message);else window.dispatchEvent(new CustomEvent('trooth-feed-action',{detail:{type:'comment',postId:postId}}));
    };
    window.sharePost=async function(postId){
      var userId=await uid();if(!userId){location.href='auth.html';return}
      var r=await sb.from('post_shares').insert({post_id:postId,user_id:userId});
      if(r.error && !String(r.error.message||'').toLowerCase().includes('duplicate')){alert(r.error.message);return}
      var url=location.origin+location.pathname+'?post='+encodeURIComponent(postId);
      try{if(navigator.share)await navigator.share({title:'Trooth Social Independent',text:'Check this post on Trooth',url:url});else if(navigator.clipboard)await navigator.clipboard.writeText(url);else prompt('Post link:',url)}catch(e){}
      window.dispatchEvent(new CustomEvent('trooth-feed-action',{detail:{type:'share',postId:postId}}));
    };
    if(sb.channel){sb.channel('trooth-feed-actions-live').on('postgres_changes',{event:'*',schema:'public',table:'post_likes'},function(){window.dispatchEvent(new CustomEvent('trooth-feed-refresh-actions'))}).on('postgres_changes',{event:'*',schema:'public',table:'comments'},function(){window.dispatchEvent(new CustomEvent('trooth-feed-refresh-actions'))}).on('postgres_changes',{event:'*',schema:'public',table:'post_shares'},function(){window.dispatchEvent(new CustomEvent('trooth-feed-refresh-actions'))}).subscribe()}
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();