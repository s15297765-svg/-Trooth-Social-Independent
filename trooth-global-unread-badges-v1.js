// Trooth Social Independent — global unread notification/message badges v1
(function(){
  if(window.__troothGlobalUnreadBadgesV1)return;window.__troothGlobalUnreadBadgesV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    var user=null,channel=null,timer=null;
    function targets(){return [].slice.call(document.querySelectorAll('a[href="notifications-messages.html"],button[title="Notifications"],button[title="Messages"]'))}
    function addBadge(el,count){
      if(!el)return;
      if(getComputedStyle(el).position==='static')el.style.position='relative';
      var b=el.querySelector('.trooth-unread-badge');
      if(!b){b=document.createElement('span');b.className='trooth-unread-badge';b.style.cssText='position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#d62828;color:#fff;font:800 10px/18px Arial;text-align:center;box-shadow:0 2px 6px #0003;pointer-events:none;z-index:5';el.appendChild(b)}
      b.textContent=count>99?'99+':String(count);b.style.display=count?'block':'none';
    }
    async function refresh(){
      if(!user)return;
      var n=await sb.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',user.id).eq('is_read',false);
      var m=await sb.from('messages').select('id',{count:'exact',head:true}).eq('receiver_id',user.id).eq('is_read',false);
      var nc=n.count||0,mc=m.count||0;
      targets().forEach(function(el){var h=(el.getAttribute('title')||'').toLowerCase();var text=(el.textContent||'').toLowerCase();if(h==='notifications'||text.indexOf('notification')>-1)addBadge(el,nc);else if(h==='messages'||text.indexOf('message')>-1)addBadge(el,mc);});
    }
    function schedule(){clearTimeout(timer);timer=setTimeout(refresh,180)}
    async function init(){try{var r=await sb.auth.getUser();user=r.data&&r.data.user||null}catch(e){user=null}if(!user)return;refresh();if(channel)try{channel.unsubscribe()}catch(e){}channel=sb.channel('trooth-global-unread-badges-v1').on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},schedule).on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},schedule).subscribe();}
    var obs=new MutationObserver(schedule);if(document.body)obs.observe(document.body,{childList:true,subtree:true});window.addEventListener('trooth-notifications-refresh',schedule);window.addEventListener('trooth-saved-content-refresh',schedule);init();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
