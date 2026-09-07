// Trooth Social Independent — safe demo preview renderer v1
(function(){
  if(window.__troothDemoRenderV1)return;window.__troothDemoRenderV1=true;
  function boot(){
    var d=window.TroothDemoData;if(!d||!d.enabled)return;
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    if(path!=='index.html'&&path!=='')return;
    if(document.getElementById('trooth-demo-preview'))return;
    var wrap=document.createElement('section');wrap.id='trooth-demo-preview';
    wrap.style.cssText='margin:0 0 18px;padding:16px;border:1px solid #cfe8da;border-radius:18px;background:linear-gradient(135deg,#f4fff8,#e9f8ef);box-shadow:0 8px 24px rgba(20,82,56,.07)';
    var html='<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><b style="font-size:18px;color:#145238">🌿 Trooth Demo Preview</b><div style="font-size:12px;color:#718276;margin-top:3px">Safe sample data — does not write to your Supabase database.</div></div><button id="troothDemoHide" type="button" style="border:0;background:#fff;border:1px solid #cfe8da;border-radius:10px;padding:8px 11px;color:#145238;font-weight:800">Hide</button></div>';
    html+='<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px">';
    (d.posts||[]).forEach(function(p){html+='<article style="background:#fff;border:1px solid #dfeee5;border-radius:14px;padding:12px"><div style="font-weight:850;color:#145238">'+escapeHtml(p.user)+'</div><p style="font-size:13px;line-height:1.45;color:#496456">'+escapeHtml(p.text)+'</p><div style="font-size:11px;color:#718276">❤️ '+p.likes+' · 💬 '+p.comments+' · ↗️ '+p.shares+'</div></article>'});
    html+='</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">';
    (d.profiles||[]).forEach(function(p){html+='<a href="profile.html?user='+encodeURIComponent(p.id)+'" style="background:#145238;color:#fff;border-radius:10px;padding:9px 12px;font-size:12px;font-weight:800">👤 '+escapeHtml(p.name)+'</a>'});
    html+='</div>';
    wrap.innerHTML=html;
    var feed=document.getElementById('feed');if(feed&&feed.parentNode)feed.parentNode.insertBefore(wrap,feed);else document.body.appendChild(wrap);
    var h=document.getElementById('troothDemoHide');if(h)h.onclick=function(){wrap.remove()};
  }
  function escapeHtml(s){return String(s||'').replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();