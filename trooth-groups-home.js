/* Trooth Groups -> Home Feed integration */
(function(){
  function boot(){
    const sb=window.troothSupabase;
    const host=document.getElementById('groupsHub')||document.getElementById('myGroups');
    if(!sb||!host)return;
    sb.auth.getUser().then(async ({data})=>{
      const user=data&&data.user;
      if(!user){host.innerHTML='<div class="empty">Login to see your groups.</div>';return;}
      async function load(){
        const m=await sb.from('group_members').select('group_id').eq('user_id',user.id);
        const ids=(m.data||[]).map(x=>x.group_id);
        if(!ids.length){host.innerHTML='<div class="empty">No groups yet. <a href="groups.html">Discover Groups →</a></div>';return;}
        const g=await sb.from('groups').select('id,name,description,privacy,created_at').in('id',ids).order('created_at',{ascending:false}).limit(8);
        if(g.error){host.innerHTML='<div class="empty">Unable to load groups.</div>';return;}
        host.innerHTML=(g.data||[]).map(x=>'<a class="group-card" href="group.html?id='+encodeURIComponent(x.id)+'"><span class="tag">'+(x.privacy==='private'?'🔒 Private':'🌐 Public')+'</span><h3>👥 '+esc(x.name)+'</h3><p>'+esc(x.description||'Community group')+'</p><b>Open Group →</b></a>').join('')||'<div class="empty">No groups yet.</div>';
      }
      const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
      await load();
      if(window.troothGroupsHomeChannel)sb.removeChannel(window.troothGroupsHomeChannel);
      window.troothGroupsHomeChannel=sb.channel('trooth-groups-home').on('postgres_changes',{event:'*',schema:'public',table:'group_members'},load).on('postgres_changes',{event:'*',schema:'public',table:'groups'},load).subscribe();
    });
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
