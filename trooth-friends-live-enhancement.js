// Trooth — Friends live enhancement
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    async function refresh(){
      var r=await sb.auth.getUser(),u=r.data&&r.data.user;if(!u)return;
      var q=await sb.from('friend_requests').select('id').eq('receiver_id',u.id).eq('status','pending');
      var count=(q.data||[]).length;
      document.querySelectorAll('[data-trooth-friend-request-count]').forEach(function(el){el.textContent=String(count);el.hidden=count===0});
      window.dispatchEvent(new CustomEvent('trooth-friend-requests-refresh',{detail:{count:count}}));
    }
    refresh();
    sb.auth.onAuthStateChange(function(){setTimeout(refresh,0)});
    sb.channel('trooth-friends-request-badge').on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},refresh).subscribe();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
