/* Trooth Social Independent — Auth + Profile V2
   Additive integration: does not replace existing page code. */
(function(){
  function boot(){
    const sb=window.troothSupabase;if(!sb||!sb.auth)return;
    if(window.troothAuthProfileV2Booted)return;
    window.troothAuthProfileV2Booted=true;
    let stopped=false, syncing=false, queued=false, authSub=null, syncTimer=null;
    const ready=()=>window.dispatchEvent(new CustomEvent('trooth-auth-profile-ready'));
    const scheduleSync=(delay=0)=>{
      clearTimeout(syncTimer);
      syncTimer=setTimeout(()=>{syncTimer=null;if(!stopped)sync();},delay);
    };
    async function sync(){
      if(stopped||syncing){queued=true;return;}
      syncing=true;queued=false;
      try{
        const {data}=await sb.auth.getUser();
        if(stopped)return;
        const user=data&&data.user;
        window.troothCurrentUser=user||null;
        document.querySelectorAll('[data-trooth-auth-only]').forEach(e=>e.hidden=!user);
        document.querySelectorAll('[data-trooth-guest-only]').forEach(e=>e.hidden=!!user);
        if(user){
          const {data:p,error}=await sb.from('profiles').select('id,display_name,bio,avatar_url,cover_url,is_public').eq('id',user.id).maybeSingle();
          if(stopped)return;
          if(error)console.warn('Trooth profile sync:',error);
          window.troothCurrentProfile=p||null;
          if(p){
            document.querySelectorAll('[data-trooth-display-name]').forEach(e=>e.textContent=p.display_name||user.email||'Trooth User');
            document.querySelectorAll('[data-trooth-avatar]').forEach(e=>{if(p.avatar_url)e.src=p.avatar_url});
          }
        }else window.troothCurrentProfile=null;
        ready();
      }catch(e){if(!stopped)console.warn('Trooth auth/profile sync:',e)}
      finally{
        syncing=false;
        if(!stopped&&queued)scheduleSync(40);
      }
    }
    window.troothSignOut=async()=>{const r=await sb.auth.signOut();if(!r.error)location.href='index.html';return r};
    window.troothUpdateProfile=async function(patch){
      const {data:{user}}=await sb.auth.getUser();
      if(!user)throw new Error('Please login first');
      const allowed={display_name:patch.display_name,bio:patch.bio,avatar_url:patch.avatar_url,cover_url:patch.cover_url,is_public:patch.is_public};
      Object.keys(allowed).forEach(k=>allowed[k]===undefined&&delete allowed[k]);
      const r=await sb.from('profiles').update(allowed).eq('id',user.id).select().single();
      if(r.error)throw r.error;
      window.troothCurrentProfile=r.data; scheduleSync(0); return r.data;
    };
    authSub=sb.auth.onAuthStateChange(function(event,session){
      if(event==='SIGNED_OUT'||event==='USER_DELETED'){
        stopped=true;clearTimeout(syncTimer);syncTimer=null;
        window.troothCurrentUser=null;window.troothCurrentProfile=null;
        document.querySelectorAll('[data-trooth-auth-only]').forEach(e=>e.hidden=true);
        document.querySelectorAll('[data-trooth-guest-only]').forEach(e=>e.hidden=false);
        ready();
        stopped=false;
        return;
      }
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')scheduleSync(30);
    });
    sync();
    window.addEventListener('beforeunload',()=>{
      stopped=true;clearTimeout(syncTimer);
      try{authSub?.data?.subscription?.unsubscribe()}catch(e){}
    },{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();