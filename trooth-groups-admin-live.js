/* Trooth Social Independent — Group Admin Live Sync */
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||!sb.channel)return;
    if(window.troothGroupsAdminLiveReady)return;
    window.troothGroupsAdminLiveReady=true;
    var path=(location.pathname||'').split('/').pop();
    if(path!=='group-admin.html')return;
    var id=new URLSearchParams(location.search).get('id');
    if(!id)return;
    var timer=null;
    function refresh(){
      clearTimeout(timer);
      timer=setTimeout(function(){
        window.dispatchEvent(new CustomEvent('trooth-group-admin-refresh'));
        location.reload();
      },250);
    }
    var ch=sb.channel('trooth-group-admin-live-'+id)
      .on('postgres_changes',{event:'*',schema:'public',table:'groups',filter:'id=eq.'+id},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'group_announcements',filter:'group_id=eq.'+id},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'group_join_requests',filter:'group_id=eq.'+id},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'group_members',filter:'group_id=eq.'+id},refresh)
      .subscribe();
    window.troothGroupsAdminLiveChannel=ch;
    window.addEventListener('beforeunload',function(){try{sb.removeChannel(ch)}catch(e){}});
  }
  if(window.troothSupabase)boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
