// Trooth Social Independent — global people search v1
(function(){
  if(window.__troothGlobalPeopleSearchV1)return;window.__troothGlobalPeopleSearchV1=true;
  function boot(){
    var sb=window.troothSupabase,input=document.getElementById('search');
    if(!sb||!input)return;
    var box=null,timer=null;
    function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
    function ensure(){if(box)return;box=document.createElement('div');box.id='troothPeopleSearchResults';box.style.cssText='position:absolute;left:0;right:0;top:calc(100% + 7px);background:#fff;border:1px solid #d8eadf;border-radius:14px;box-shadow:0 10px 28px #245c3a22;padding:7px;z-index:100;display:none;max-height:360px;overflow:auto';var p=input.parentElement;p.style.position='relative';p.appendChild(box)}
    async function run(){
      ensure();var q=String(input.value||'').trim().replace(/\s+/g,' ');if(q.length<2){box.style.display='none';return}
      box.style.display='block';box.innerHTML='<div style="padding:12px;color:#718276">🔎 People search…</div>';
      var r=await sb.from('profiles').select('id,display_name,bio,avatar_url').ilike('display_name','%'+q.replace(/[%_]/g,'')+'%').limit(8);
      if(r.error){box.innerHTML='<div style="padding:12px;color:#718276">People search unavailable right now.</div>';return}
      var rows=r.data||[];box.innerHTML=rows.length?rows.map(function(p){var n=p.display_name||'Trooth Member';var a=p.avatar_url?'<img src="'+esc(p.avatar_url)+'" style="width:40px;height:40px;border-radius:50%;object-fit:cover">':'<span style="width:40px;height:40px;border-radius:50%;background:#40916c;color:#fff;display:grid;place-items:center;font-weight:800">'+esc(n[0].toUpperCase())+'</span>';return '<a href="profile.html?id='+encodeURIComponent(p.id)+'" style="display:flex;align-items:center;gap:10px;padding:9px;border-radius:10px;color:#173b29;text-decoration:none"><span style="display:grid">'+a+'</span><span style="flex:1"><b>'+esc(n)+'</b><small style="display:block;color:#718276">'+esc(p.bio||'Trooth Community Member')+'</small></span><b style="color:#40916c">View →</b></a>'}).join(''):'<div style="padding:12px;color:#718276">No people found. Try another name.</div>';
    }
    function schedule(){clearTimeout(timer);timer=setTimeout(run,220)}
    input.addEventListener('input',schedule);input.addEventListener('focus',function(){if(input.value.trim().length>=2)run()});document.addEventListener('click',function(e){if(box&&!box.contains(e.target)&&e.target!==input)box.style.display='none'});
    window.addEventListener('trooth-profile-social-refresh',function(){if(input.value.trim().length>=2)run()});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
