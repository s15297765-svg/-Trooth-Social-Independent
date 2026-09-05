// Trooth Social Independent — Profile ↔ Home live sync
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb) return setTimeout(boot,300);
    function apply(p){
      if(!p) return;
      document.querySelectorAll('[data-trooth-display-name]').forEach(function(e){ if(p.display_name) e.textContent=p.display_name; });
      document.querySelectorAll('[data-trooth-avatar]').forEach(function(e){ if(p.avatar_url){ if(e.tagName==='IMG') e.src=p.avatar_url; else e.style.backgroundImage='url("'+p.avatar_url.replace(/"/g,'')+'")'; }});
    }
    if(window.troothCurrentProfile) apply(window.troothCurrentProfile);
    window.addEventListener('trooth-auth-profile-ready',function(){apply(window.troothCurrentProfile);});
    window.addEventListener('trooth-profile-updated',function(e){apply((e.detail&&e.detail.profile)||window.troothCurrentProfile);});
    var ch=sb.channel('trooth-profile-home-sync').on('postgres_changes',{event:'UPDATE',schema:'public',table:'profiles'},function(payload){
      if(window.troothCurrentUser && payload.new && payload.new.id===window.troothCurrentUser.id){ apply(payload.new); window.troothCurrentProfile=payload.new; window.dispatchEvent(new CustomEvent('trooth-profile-updated',{detail:{profile:payload.new}})); }
    }).subscribe();
  }
  boot();
})();
