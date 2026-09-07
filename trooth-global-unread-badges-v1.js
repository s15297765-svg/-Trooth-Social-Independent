// Trooth Social Independent — global unread notification/message badges v2
(function(){
  if(window.__troothGlobalUnreadBadgesV2)return;window.__troothGlobalUnreadBadgesV2=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var user=null,channel=null,timer=null;
    function targets(){return [].slice.call(document.querySelectorAll('a[href],button'))}
    function addBadge(el,count){
      if(!el)return;
      if(getComputedStyle(el).position==='static')el.style.position='relative';
      var b=el.querySelector('.trooth-unread-badge');
      if(!b){b=document.createElement('span');b.className='trooth-unread-badge';b.style.cssText='display:none;position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#145238;color:#fff;font:800 10px/18px Arial;text-align:center;box-shadow:0 2px 6px #0003;pointer-events:none;z-index:5';el.appendChild(b)}
      b.textContent=count>99?'99+':String(count);b.style.display=count?'block':'none';
    }
    async function refresh(){
      if(!user)return;
      var n=await sb.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',user.id).eq('is_read',false);
      var m=await sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',user.id).eq('is_read',false);
      var nc=n.count||0,mc=m.count||0;
      targets().forEach(function(el){
        var href=(el.getAttribute('href')||'').toLowerCase();
        var title=(el.getAttribute('title')||'').toLowerCase();
        var text=(el.textContent||'').toLowerCase();
        var isN=href.indexOf('notifications')===0||title.indexOf('notification')>-1||title==='alerts'||text.indexOf('notification')>-1||text==='alerts';
        var isM=href.indexOf('chat.html')===0||title.indexOf('message')>-1||text.indexOf('message')>-1;
        if(isN)addBadge(el,nc);else if(isM)addBadge(el,mc);
      });
    }
    function schedule(){clearTimeout(timer);timer=setTimeout(refresh,180)}
    async function init(){
      try{var r=await sb.auth.getUser();user=r.data&&r.data.user||null}catch(e){user=null}
      if(!user)return;
      refresh();
      if(channel)try{sb.removeChannel(channel)}catch(e){}
      channel=sb.channel('trooth-global-unread-badges-v2-'+user.id)
        .on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},schedule)
        .on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},schedule)
        .subscribe();
    }
    var obs=new MutationObserver(schedule);if(document.body)obs.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('trooth-notifications-refresh',schedule);window.addEventListener('trooth-messages-refresh',schedule);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
    init();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
