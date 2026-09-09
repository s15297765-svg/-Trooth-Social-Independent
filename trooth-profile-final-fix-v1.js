// Trooth Social Independent — Profile final fix v2
(function(){
  if(window.__troothProfileFinalFixV2)return; window.__troothProfileFinalFixV2=true;
  function isAuth(){return /(?:^|\/)auth\.html(?:$|[?#])/.test(location.pathname+location.search)}
  function loginCard(app,msg){
    if(!app)return;
    app.innerHTML='<div class="card"><h2>Welcome to Trooth 👋</h2><p class="muted">Login یا نیا Trooth Profile بنائیں۔</p><button class="btn" id="troothForceLogin">📱 Login / Create Account</button>'+(msg?'<div class="status">'+msg+'</div>':'')+'</div>';
    var b=document.getElementById('troothForceLogin'); if(b)b.onclick=function(){if(typeof window.showLogin==='function')window.showLogin();else location.reload()};
  }
  async function boot(){
    if(!isAuth())return;
    var sb=window.troothSupabase,app=document.getElementById('app'); if(!sb||!app)return;
    var qs=new URLSearchParams(location.search),target=qs.get('profile')||qs.get('id')||qs.get('user');
    try{
      var r=await sb.auth.getUser(),u=r.data&&r.data.user;
      if(target&&(!u||target!==u.id)){
        var p=await sb.from('profiles').select('id,display_name,bio,avatar_url,cover_url').eq('id',target).maybeSingle();
        if(p.error||!p.data){loginCard(app,'یہ Profile دستیاب نہیں ہے۔');return}
        var x=p.data,initial=(x.display_name||'T').trim().charAt(0).toUpperCase();
        app.innerHTML='<div class="card"><div class="cover" style="'+(x.cover_url?'background-image:url(\"'+String(x.cover_url).replace(/"/g,'&quot;')+'\")':'')+'"><div class="avatar">'+(x.avatar_url?'<img src="'+String(x.avatar_url).replace(/"/g,'&quot;')+'" alt="Profile photo">':initial)+'</div></div><div class="profileHead"><h1>'+x.display_name+'</h1><p class="muted">'+(x.bio||'Trooth Member')+'</p></div><div class="quick"><a href="index.html">🏠 Home</a><a href="friends.html">👥 Friends</a></div></div>';
        return;
      }
      if(!u){loginCard(app);return;}
      var p=await sb.from('profiles').select('*').eq('id',u.id).maybeSingle();
      if(p.error)throw p.error;
      if(!p.data){
        var name=(u.user_metadata&&u.user_metadata.display_name)||u.phone||'Trooth User';
        var ins=await sb.from('profiles').insert({id:u.id,display_name:name,bio:'',is_public:true}).select('*').single();
        if(ins.error)throw ins.error;
        p=ins;
      }
      // Let the original profile renderer finish; if it is still showing the loader, force it.
      if(typeof window.init==='function')await window.init();
      setTimeout(function(){
        if(/loading trooth profile/i.test(app.textContent||'')){
          app.innerHTML='<div class="card"><h2>👤 '+(p.data.display_name||'Trooth User')+'</h2><p class="muted">Profile تیار ہے۔</p><button class="btn" id="troothOpenLogin">✏️ Profile Edit / Login</button></div>';
          var b=document.getElementById('troothOpenLogin');if(b)b.onclick=function(){if(typeof window.showLogin==='function')window.showLogin()};
        }
      },3500);
    }catch(e){console.warn('Trooth profile final fix v2',e);loginCard(app,'Profile load نہیں ہو سکا۔ دوبارہ Login کریں۔')}
  }
  function start(){setTimeout(boot,1000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('trooth-supabase-ready',start);
})();
