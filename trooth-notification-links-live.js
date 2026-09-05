// Trooth Social Independent — clickable notification routing
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,300);
    var user=null;
    function route(n){
      if(!n)return 'index.html';
      if(n.kind==='message')return 'chat.html';
      if(n.kind==='follow'||n.kind==='friend_request'||n.kind==='friend_accept')return 'friends.html';
      if(n.kind==='like'||n.kind==='comment'||n.kind==='share')return n.post_id?'index.html?post='+encodeURIComponent(n.post_id):'index.html';
      return 'notifications.html';
    }
    function decorate(){
      document.querySelectorAll('[data-trooth-notification-id]').forEach(function(el){
        if(el.dataset.troothNotificationLinked)return;
        var id=el.getAttribute('data-trooth-notification-id');
        var n=(window.troothNotifications||[]).find(function(x){return x.id===id});
        if(!n)return;
        el.dataset.troothNotificationLinked='1';el.style.cursor='pointer';
        el.addEventListener('click',async function(){
          if(!n.is_read)await sb.from('notifications').update({is_read:true}).eq('id',n.id).eq('user_id',user.id);
          location.href=route(n);
        });
      });
    }
    sb.auth.getUser().then(function(r){user=r.data&&r.data.user||null;if(user)decorate()});
    window.addEventListener('trooth-notifications-refresh',decorate);
    window.addEventListener('trooth-notification-added',decorate);
    new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();