// Trooth Social Independent — Demo connection health v1
(function(){
 if(window.__troothDemoHealthV1)return;window.__troothDemoHealthV1=true;
 function boot(){
  var box=document.getElementById('trooth-demo-health');if(!box)return;
  function row(name,ok,detail){return '<div style="display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid #dfeee5"><span><b>'+name+'</b><small style="display:block;color:#718276">'+detail+'</small></span><b style="color:'+(ok?'#145238':'#9a4b24')+'">'+(ok?'✓ Ready':'! Check')+'</b></div>'}
  var sup=!!window.troothSupabase;
  var mods=window.troothLoadedModules||[];
  var auth='Not signed in';
  box.innerHTML='<h2 style="margin:0 0 6px">🩺 Connection Health</h2><p style="margin:0 0 8px;color:#718276;font-size:13px">Quick client-side checks only. No database changes are made.</p>'+row('Supabase client',sup,sup?'Client is available':'Client script is not available')+row('Loaded modules',mods.length>20,mods.length+' modules reported loaded')+row('Demo data',!!window.TroothDemoData,window.TroothDemoData?'Safe sample data loaded':'Demo data module missing')+row('Navigation helpers',!!window.TroothSocialFlow||!!window.TroothNotificationFlow, 'Profile / Friends / Chat / Notification routing helpers')+'<div id="trooth-demo-auth" style="padding-top:8px;color:#718276;font-size:13px">🔐 Checking authentication…</div>';
  if(sup&&sup.auth){sup.auth.getUser().then(function(r){var u=r&&r.data&&r.data.user;var a=document.getElementById('trooth-demo-auth');if(a)a.textContent=u?'🔐 Signed in — session detected':'🔐 '+auth;}).catch(function(){var a=document.getElementById('trooth-demo-auth');if(a)a.textContent='🔐 Auth check unavailable';});}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();