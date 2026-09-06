// Trooth Social Independent — Friends + Following social graph bridge v1
(function(){
  if(window.__troothFriendsSocialGraphV1)return;window.__troothFriendsSocialGraphV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var user=null,channel=null,timer=null;
    async function who(){try{var r=await sb.auth.getUser();user=r.data&&r.data.user||null}catch(e){user=null}}
    async function refresh(){
      if(!user)return;
      var root=document.querySelector('[data-trooth-social-graph]')||document.body;
      var badge=root.querySelector('.trooth-social-graph-live');
      if(!badge){badge=document.createElement('span');badge.className='trooth-social-graph-live';badge.textContent='🟢 Social graph live';badge.style.cssText='display:inline-block;margin:8px 0;padding:6px 10px;border-radius:999px;background:#d8f3dc;color:#2d6a4f;font:800 11px system-ui';root.prepend(badge)}
      try{
        var f=await sb.from('friend_requests').select('id',{count:'exact',head:true}).eq('receiver_id',user.id).eq('status','pending');
        var c=await sb.from('connections').select('follower_id',{count:'exact',head:true}).eq('following_id',user.id);
        var p=(f.count||0)+(c.count||0);badge.title=p+' incoming social connection(s)';
      }catch(e){}
    }
    function schedule(){clearTimeout(timer);timer=setTimeout(refresh,250)}
    who().then(function(){refresh();if(channel)try{channel.unsubscribe()}catch(e){};if(!user)return;channel=sb.channel('trooth-social-graph-v1').on('postgres_changes',{event:'*',schema:'public',table:'friend_requests',filter:'receiver_id=eq.'+user.id},schedule).on('postgres_changes',{event:'*',schema:'public',table:'connections',filter:'following_id=eq.'+user.id},schedule).subscribe();});
    window.addEventListener('trooth-social-graph-refresh',schedule);window.addEventListener('trooth-notifications-refresh',schedule);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
