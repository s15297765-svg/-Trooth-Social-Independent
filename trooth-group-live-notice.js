// Trooth Social Independent — live group announcement notice
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||!sb.channel)return;
    var params=new URLSearchParams(location.search),groupId=params.get('id');
    if(!groupId)return;
    if(window.troothGroupLiveNoticeReady)return;
    window.troothGroupLiveNoticeReady=true;
    var style=document.createElement('style');
    style.textContent='.trooth-live-notice{position:fixed;right:16px;bottom:18px;z-index:9999;max-width:360px;background:#fff;border:1px solid #b7dfc5;border-left:5px solid #40916c;border-radius:14px;padding:12px 14px;box-shadow:0 8px 28px #173b2926;font:14px Arial,sans-serif;color:#173b29}.trooth-live-notice b{display:block;margin-bottom:4px}.trooth-live-notice button{margin-top:8px;border:0;border-radius:8px;padding:7px 10px;background:#40916c;color:#fff;font-weight:bold;cursor:pointer}.trooth-live-notice.hide{display:none}@media(max-width:600px){.trooth-live-notice{left:10px;right:10px;bottom:10px;max-width:none}}';
    document.head.appendChild(style);
    function show(row){
      var old=document.querySelector('.trooth-live-notice');if(old)old.remove();
      var box=document.createElement('div');box.className='trooth-live-notice';
      box.innerHTML='<b>📢 نئی Group Announcement</b><div>'+esc(row.title||'اہم اعلان')+'</div><button type="button">دیکھیں</button>';
      box.querySelector('button').onclick=function(){box.remove();document.getElementById('announcements')?.scrollIntoView({behavior:'smooth',block:'start'});};
      document.body.appendChild(box);setTimeout(function(){if(box.isConnected)box.remove()},8000);
    }
    function esc(s){return String(s??'').replace(/[&<>\"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])})}
    sb.channel('trooth-group-live-notice-'+groupId)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'group_announcements',filter:'group_id=eq.'+groupId},function(e){show(e.new||{});window.dispatchEvent(new CustomEvent('trooth-group-announcement-live',{detail:e.new||{}}));})
      .subscribe();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
