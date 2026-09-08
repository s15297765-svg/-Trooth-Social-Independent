/* Trooth profile bridge: keeps logged-in users one tap away from their public profile. */
(function(){
  'use strict';
  function addPublicProfileLink(user){
    if(!user || document.querySelector('[data-trooth-public-profile]')) return;
    var host=document.querySelector('.mediaBtns') || document.querySelector('.quick') || document.querySelector('.top');
    if(!host) return;
    var a=document.createElement('a');
    a.setAttribute('data-trooth-public-profile','1');
    a.href='profile.html?id='+encodeURIComponent(user.id);
    a.textContent='🌐 Public Profile';
    a.style.cssText='display:inline-block;text-decoration:none;background:#e3f8eb;color:#145238;border:1px solid #bfe5ce;border-radius:10px;padding:9px 12px;font-weight:800;margin:4px 0;';
    host.appendChild(a);
  }
  function start(){
    var sb=window.troothSupabase;
    if(!sb) return;
    sb.auth.getUser().then(function(r){ addPublicProfileLink(r && r.data && r.data.user); }).catch(function(){});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  window.addEventListener('trooth-supabase-ready',start,{once:true});
})();
