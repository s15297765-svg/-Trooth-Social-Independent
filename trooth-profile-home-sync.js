// Trooth Social Independent — Profile ↔ Home live sync v2
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb) return setTimeout(boot,300);

    function apply(p){
      if(!p) return;
      document.querySelectorAll('[data-trooth-display-name]').forEach(function(e){ if(p.display_name) e.textContent=p.display_name; });
      document.querySelectorAll('[data-trooth-avatar]').forEach(function(e){
        if(p.avatar_url){
          if(e.tagName==='IMG') e.src=p.avatar_url;
          else e.style.backgroundImage='url("'+String(p.avatar_url).replace(/"/g,'')+'")';
        }
      });
      var name=p.display_name||'Trooth Member';
      var avatar=p.avatar_url;
      document.querySelectorAll('#sideName,#profileName').forEach(function(e){e.textContent=name;});
      document.querySelectorAll('#sideAvatar,#profileAvatar,#composerAvatar').forEach(function(e){
        if(!avatar) return;
        if(e.tagName==='IMG') e.src=avatar;
        else e.innerHTML='<img src="'+String(avatar).replace(/"/g,'&quot;')+'" style="width:100%;height:100%;object-fit:cover">';
      });
    }

    sb.auth.getUser().then(function(res){
      var u=res && res.data ? res.data.user : null;
      window.troothCurrentUser=u||null;
      window.user=u||null;
      if(!u){
        injectProfileAccess(false);
        return;
      }
      sb.from('profiles').select('*').eq('id',u.id).maybeSingle().then(function(r){
        var p=r.data;
        if(!p){
          var display=(u.user_metadata&&u.user_metadata.display_name)||((u.email||'Trooth User').split('@')[0]);
          return sb.from('profiles').insert({id:u.id,display_name:display,bio:''}).select('*').single();
        }
        return {data:p};
      }).then(function(r){
        var p=r&&r.data;
        if(p){
          window.troothCurrentProfile=p;
          apply(p);
        }
        document.dispatchEvent(new CustomEvent('trooth-auth-profile-ready'));
        window.dispatchEvent(new CustomEvent('trooth-auth-profile-ready'));
        injectProfileAccess(true,p);
      });
    }).catch(function(){ injectProfileAccess(false); });

    function injectProfileAccess(loggedIn,p){
      var nav=document.querySelector('a[href="auth.html"]');
      if(nav){ nav.textContent=loggedIn?'👤 My Profile':'👤 Login / Create Profile'; }
      var hero=document.querySelector('.hero');
      if(hero && !document.getElementById('troothProfileAccess')){
        var box=document.createElement('div');
        box.id='troothProfileAccess';
        box.style.cssText='margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center';
        box.innerHTML=loggedIn
          ? '<a href="auth.html" style="background:#40916c;color:#fff;border-radius:10px;padding:10px 15px;font-weight:800;text-decoration:none">👤 My Profile</a><span style="color:#587064;font-size:13px">'+escapeHtml((p&&p.display_name)||'Trooth Member')+'</span>'
          : '<a href="auth.html" style="background:#40916c;color:#fff;border-radius:10px;padding:10px 15px;font-weight:800;text-decoration:none">👤 Login / Create Profile</a>';
        hero.appendChild(box);
      }
    }
    function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]);});}

    if(window.troothCurrentProfile) apply(window.troothCurrentProfile);
    window.addEventListener('trooth-auth-profile-ready',function(){apply(window.troothCurrentProfile);});
    window.addEventListener('trooth-profile-updated',function(e){apply((e.detail&&e.detail.profile)||window.troothCurrentProfile);});
    sb.channel('trooth-profile-home-sync-v2').on('postgres_changes',{event:'UPDATE',schema:'public',table:'profiles'},function(payload){
      if(window.troothCurrentUser && payload.new && payload.new.id===window.troothCurrentUser.id){
        apply(payload.new);
        window.troothCurrentProfile=payload.new;
        window.dispatchEvent(new CustomEvent('trooth-profile-updated',{detail:{profile:payload.new}}));
      }
    }).subscribe();
  }
  boot();
})();
