// Trooth Social Independent — live group announcement notice
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||!sb.channel)return;
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    if(path!=='group.html'&&path!=='group-admin.html')return;
    var groupId=new URLSearchParams(location.search).get('id');
    if(!groupId||window.troothGroupLiveNoticeReady)return;
    window.troothGroupLiveNoticeReady=true;
    var stopped=false,reconnectTimer=null,noticeTimer=null;
    var style=document.createElement('style');
    style.textContent='.trooth-live-notice{position:fixed;right:16px;bottom:18px;z-index:9999;max-width:360px;background:#fff;border:1px solid #b7dfc5;border-left:5px solid #40916c;border-radius:14px;padding:12px 14px;box-shadow:0 8px 28px #173b2926;font:14px Arial,sans-serif;color:#173b29}.trooth-live-notice b{display:block;margin-bottom:4px}.trooth-live-notice button{margin-top:8px;border:0;border-radius:8px;padding:7px 10px;background:#40916c;color:#fff;font-weight:bold;cursor:pointer}@media(max-width:600px){.trooth-live-notice{left:10px;right:10px;bottom:10px;max-width:none}}';
    document.head.appendChild(style);
    function esc(s){return String(s??'').replace(/[&<>\"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])})}
    function show(row){
      if(stopped)return;
      var old=document.querySelector('.trooth-live-notice');if(old)old.remove();
      clearTimeout(noticeTimer);
      var box=document.createElement('div');box.className='trooth-live-notice';
      box.innerHTML='<b>📢 نئی Group Announcement</b><div>'+esc(row.title||'اہم اعلان')+'</div><button type="button">دیکھیں</button>';
      box.querySelector('button').onclick=function(){box.remove();var el=document.getElementById('announcements');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});};
      document.body.appendChild(box);
      noticeTimer=setTimeout(function(){if(box.isConnected)box.remove()},8000);
    }
    function clearChannel(){
      clearTimeout(reconnectTimer);reconnectTimer=null;
      var ch=window.troothGroupLiveNoticeChannel;
      if(ch)try{sb.removeChannel(ch)}catch(e){}
      window.troothGroupLiveNoticeChannel=null;
    }
    function subscribe(){
      if(stopped||!sb||!sb.channel)return;
      clearChannel();
      var ch=sb.channel('trooth-group-live-notice-'+groupId+'-'+Date.now())
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'group_announcements',filter:'group_id=eq.'+groupId},function(e){
          show(e.new||{});
          window.dispatchEvent(new CustomEvent('trooth-group-announcement-live',{detail:e.new||{}}));
        })
        .subscribe(function(state){
          if((state==='CHANNEL_ERROR'||state==='TIMED_OUT')&&!stopped){clearChannel();reconnectTimer=setTimeout(subscribe,800);}
        });
      window.troothGroupLiveNoticeChannel=ch;
    }
    function stop(){stopped=true;clearTimeout(noticeTimer);clearChannel();var old=document.querySelector('.trooth-live-notice');if(old)old.remove();}
    function resume(){stopped=false;subscribe();}
    subscribe();
    if(sb.auth&&sb.auth.onAuthStateChange){
      sb.auth.onAuthStateChange(function(event){
        if(event==='SIGNED_OUT'||event==='USER_DELETED')stop();
        else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')resume();
      });
    }
    window.addEventListener('beforeunload',stop,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
