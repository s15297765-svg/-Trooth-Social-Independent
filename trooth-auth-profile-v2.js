/* Trooth Social Independent — Auth + Profile V2
   Additive integration: does not replace existing page code. */
(function(){
  function boot(){
    const sb=window.troothSupabase;if(!sb||!sb.auth)return;
    const ready=()=>window.dispatchEvent(new CustomEvent('trooth-auth-profile-ready'));
    async function sync(){
      const {data}=await sb.auth.getUser();
      const user=data&&data.user;
      window.troothCurrentUser=user||null;
      document.querySelectorAll('[data-trooth-auth-only]').forEach(e=>e.hidden=!user);
      document.querySelectorAll('[data-trooth-guest-only]').forEach(e=>e.hidden=!!user);
      if(user){
        const {data:p}=await sb.from('profiles').select('id,display_name,bio,avatar_url,cover_url,is_public').eq('id',user.id).maybeSingle();
        window.troothCurrentProfile=p||null;
        if(p){
          document.querySelectorAll('[data-trooth-display-name]').forEach(e=>e.textContent=p.display_name||user.email||'Trooth User');
          document.querySelectorAll('[data-trooth-avatar]').forEach(e=>{if(p.avatar_url)e.src=p.avatar_url});
        }
      }
      ready();
    }
    window.troothSignOut=async()=>{const r=await sb.auth.signOut();if(!r.error)location.href='index.html';return r};
    window.troothUpdateProfile=async function(patch){
      const {data:{user}}=await sb.auth.getUser();
      if(!user)throw new Error('Please login first');
      const allowed={display_name:patch.display_name,bio:patch.bio,avatar_url:patch.avatar_url,cover_url:patch.cover_url,is_public:patch.is_public};
      Object.keys(allowed).forEach(k=>allowed[k]===undefined&&delete allowed[k]);
      const r=await sb.from('profiles').update(allowed).eq('id',user.id).select().single();
      if(r.error)throw r.error; window.troothCurrentProfile=r.data; await sync(); return r.data;
    };
    sb.auth.onAuthStateChange(function(){setTimeout(sync,0)});
    sync();
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();