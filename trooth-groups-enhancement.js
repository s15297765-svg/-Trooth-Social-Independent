// Trooth Social Independent — Groups phase enhancement
// Adds member leave controls, membership gates, and safer private-group UI without replacing existing pages.
(function(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const wait=fn=>{if(window.troothSupabase) fn(); else window.addEventListener('trooth-supabase-ready',fn,{once:true});};

  async function leaveGroup(id, after){
    if(!window.troothSupabase||!window.troothSupabase.auth) return;
    const u=await window.troothSupabase.auth.getUser(), user=u.data.user;
    if(!user) return location.href='auth.html';
    if(!confirm('Leave this group? You can join again later.')) return;
    const r=await window.troothSupabase.from('group_members').delete().eq('group_id',id).eq('user_id',user.id);
    if(r.error) return alert(r.error.message);
    if(typeof after==='function') after(); else location.reload();
  }
  window.troothLeaveGroup=leaveGroup;

  function enhanceGroups(){
    const addControls=()=>{
      if(!window.groups||!window.joined) return;
      document.querySelectorAll('#list article.group').forEach((card,i)=>{
        const g=window.groups[i];
        if(!g||!window.joined.has(g.id)||card.querySelector('.trooth-leave')) return;
        const b=document.createElement('button'); b.className='btn trooth-leave'; b.textContent='↩ Leave';
        b.onclick=()=>leaveGroup(g.id,window.loadGroups||null); card.appendChild(b);
      });
    };
    new MutationObserver(addControls).observe(document.body,{subtree:true,childList:true});
    setTimeout(addControls,300);
  }

  function enhanceGroup(){
    wait(async()=>{
      const sb=window.troothSupabase;
      const id=new URLSearchParams(location.search).get('id');
      if(!id) return;
      const u=await sb.auth.getUser(), user=u.data.user;
      const check=async()=>{
        if(!window.memberRows||!window.group) return;
        const member=user&&window.memberRows.some(x=>x.user_id===user.id);
        const owner=user&&window.group.created_by===user.id;
        const info=document.getElementById('info');
        if(info&&!document.getElementById('troothMembership')){
          const box=document.createElement('div'); box.id='troothMembership'; box.style.marginTop='14px'; info.appendChild(box);
        }
        const box=document.getElementById('troothMembership'); if(!box) return;
        if(owner){box.innerHTML='<span class="tag">⭐ Group Owner</span>';return;}
        if(member){
          box.innerHTML='<span class="tag">✓ Member</span> <button class="btn" id="troothLeave">↩ Leave Group</button>';
          document.getElementById('troothLeave').onclick=()=>leaveGroup(id);
          return;
        }
        box.innerHTML=window.group.privacy==='private'
          ? '<span class="tag">🔒 Private Group</span> <button class="btn" id="troothRequest">🔒 Request to Join</button>'
          : '<span class="tag">🌐 Public Group</span> <button class="btn" id="troothJoin">➕ Join Group</button>';
        if(document.getElementById('troothJoin')) document.getElementById('troothJoin').onclick=async()=>{
          if(!user) return location.href='auth.html';
          const r=await sb.from('group_members').insert({group_id:id,user_id:user.id,role:'member'});
          if(r.error) alert(r.error.message); else location.reload();
        };
        if(document.getElementById('troothRequest')) document.getElementById('troothRequest').onclick=async()=>{
          if(!user) return location.href='auth.html';
          const r=await sb.from('group_join_requests').upsert({group_id:id,user_id:user.id,status:'pending'},{onConflict:'group_id,user_id'});
          if(r.error) alert(r.error.message); else {document.getElementById('troothRequest').disabled=true;document.getElementById('troothRequest').textContent='⏳ Request Pending';}
        };
        if(window.group.privacy==='private'){
          const a=document.getElementById('announcements'), f=document.getElementById('feed');
          if(a&&!member) a.innerHTML='<h2>📢 Announcements</h2><div class="notice">Join this private group to view member announcements.</div>';
          if(f&&!member) f.innerHTML='<div class="notice">🔒 This is a private group. Join the group to view and interact with its community feed.</div>';
        }
      };
      new MutationObserver(check).observe(document.body,{subtree:true,childList:true});
      setTimeout(check,500); setTimeout(check,1500);
    });
  }

  if(path==='groups.html') wait(enhanceGroups);
  if(path==='group.html') enhanceGroup();
})();
