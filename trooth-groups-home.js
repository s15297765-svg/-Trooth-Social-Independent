/* Trooth Groups -> Home Feed integration */
(function(){
  let booted=false, stopped=false, channel=null, authSub=null, refreshTimer=null, loading=false, pending=false;

  function clearChannel(){
    if(refreshTimer){clearTimeout(refreshTimer);refreshTimer=null;}
    if(channel&&window.troothSupabase){try{window.troothSupabase.removeChannel(channel);}catch(e){}}
    channel=null;
    window.troothGroupsHomeChannel=null;
  }

  function scheduleLoad(){
    if(stopped||refreshTimer)return;
    refreshTimer=setTimeout(()=>{refreshTimer=null;load()},120);
  }

  async function load(){
    if(stopped||loading){pending=true;return;}
    const sb=window.troothSupabase;
    const host=document.getElementById('groupsHub')||document.getElementById('myGroups');
    if(!sb||!host)return;
    loading=true;pending=false;
    try{
      const {data}=await sb.auth.getUser();
      const user=data&&data.user;
      if(stopped)return;
      if(!user){host.innerHTML='<div class="empty">Login to see your groups.</div>';return;}
      const m=await sb.from('group_members').select('group_id').eq('user_id',user.id);
      if(stopped)return;
      if(m.error){host.innerHTML='<div class="empty">Unable to load groups.</div>';return;}
      const ids=(m.data||[]).map(x=>x.group_id);
      if(!ids.length){host.innerHTML='<div class="empty">No groups yet. <a href="groups.html">Discover Groups →</a></div>';return;}
      const g=await sb.from('groups').select('id,name,description,privacy,created_at').in('id',ids).order('created_at',{ascending:false}).limit(8);
      if(stopped)return;
      if(g.error){host.innerHTML='<div class="empty">Unable to load groups.</div>';return;}
      const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
      host.innerHTML=(g.data||[]).map(x=>'<a class="group-card" href="group.html?id='+encodeURIComponent(x.id)+'"><span class="tag">'+(x.privacy==='private'?'🔒 Private':'🌐 Public')+'</span><h3>👥 '+esc(x.name)+'</h3><p>'+esc(x.description||'Community group')+'</p><b>Open Group →</b></a>').join('')||'<div class="empty">No groups yet.</div>';
    }catch(e){
      if(!stopped)console.warn('Trooth groups home:',e);
    }finally{
      loading=false;
      if(!stopped&&pending){pending=false;scheduleLoad();}
    }
  }

  function connect(){
    if(stopped||!window.troothSupabase)return;
    clearChannel();
    const sb=window.troothSupabase;
    channel=sb.channel('trooth-groups-home-'+Date.now())
      .on('postgres_changes',{event:'*',schema:'public',table:'group_members'},()=>scheduleLoad())
      .on('postgres_changes',{event:'*',schema:'public',table:'groups'},()=>scheduleLoad())
      .subscribe(status=>{
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
          clearChannel();
          if(!stopped)refreshTimer=setTimeout(()=>{refreshTimer=null;connect()},700);
        }
      });
    window.troothGroupsHomeChannel=channel;
    scheduleLoad();
  }

  function cleanup(full){
    clearChannel();
    if(full&&authSub){try{authSub.unsubscribe();}catch(e){}authSub=null;}
  }

  function stop(){stopped=true;cleanup(true);}

  function boot(){
    if(booted)return;
    booted=true;stopped=false;
    const sb=window.troothSupabase;if(!sb)return;
    authSub=sb.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT'||event==='USER_DELETED'){stopped=true;clearChannel();return;}
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED'){
        stopped=false;clearChannel();setTimeout(()=>{connect()},80);
      }
    }).data.subscription;
    connect();
  }

  window.addEventListener('trooth-groups-refresh',()=>scheduleLoad());
  window.addEventListener('beforeunload',stop,{once:true});
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
