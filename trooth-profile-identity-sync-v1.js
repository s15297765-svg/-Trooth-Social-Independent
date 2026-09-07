// Trooth Social Independent — profile identity sync v1.1
(function(){
 if(window.__troothProfileIdentitySyncV11)return;window.__troothProfileIdentitySyncV11=true;
 function boot(){
  var sb=window.troothSupabase;if(!sb)return;
  async function sync(){
   try{
    var r=await sb.auth.getUser(),u=r.data&&r.data.user;if(!u)return;
    var p=await sb.from('profiles').select('display_name,full_name,name,avatar_url,bio').eq('id',u.id).maybeSingle();
    var x=p.data||{},name=x.display_name||x.full_name||x.name||(u.user_metadata&&u.user_metadata.display_name)||u.phone||'Trooth User';
    document.querySelectorAll('#sideName,[data-trooth-user-name]').forEach(function(el){el.textContent=name});
    document.querySelectorAll('#sideAvatar,[data-trooth-user-avatar],#composerAvatar').forEach(function(el){if(x.avatar_url)el.innerHTML='<img src="'+String(x.avatar_url).replace(/"/g,'&quot;')+'" alt="" loading="lazy">';else el.textContent=name.trim().charAt(0).toUpperCase()||'T'});
    window.dispatchEvent(new CustomEvent('trooth-profile-identity-synced',{detail:{userId:u.id,name:name}}));
   }catch(e){}
  }
  sync();window.addEventListener('trooth-auth-changed',sync);window.addEventListener('trooth-profile-social-refresh',sync);window.addEventListener('focus',sync);
  // Profile-access safety net: if auth.html is still stuck on its loading card,
  // expose its login screen instead of leaving the user on an unusable page.
  if(/(?:^|\/)auth\.html(?:$|[?#])/.test(location.pathname+location.search)){
   setTimeout(function(){
    try{
     var app=document.getElementById('app');
     if(app&&/Loading Trooth Profile/i.test(app.textContent||'')&&typeof window.showLogin==='function')window.showLogin();
    }catch(e){}
   },7000);
  }
 }
 if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
