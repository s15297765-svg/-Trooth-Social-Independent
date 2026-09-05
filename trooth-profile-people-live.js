// Trooth — live Friends / Followers / Following profile lists
(function(){
  function boot(){
    const sb=window.troothSupabase;if(!sb)return;
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const avatar=(p)=>p?.avatar_url?`<img src="${esc(p.avatar_url)}" style="width:44px;height:44px;border-radius:50%;object-fit:cover">`:`<span style="width:44px;height:44px;border-radius:50%;background:#74c69d;color:#fff;display:grid;place-items:center;font-weight:800">${esc((p?.display_name||'T')[0].toUpperCase())}</span>`;
    async function load(){
      const user=(await sb.auth.getUser()).data.user;if(!user)return;
      const root=document.querySelector('[data-trooth-profile-people]');if(!root)return;
      const {data:con}=await sb.from('connections').select('follower_id,following_id,created_at').or(`follower_id.eq.${user.id},following_id.eq.${user.id}`);
      const ids=[...new Set((con||[]).flatMap(x=>[x.follower_id,x.following_id]).filter(id=>id!==user.id))];
      const {data:fr}=await sb.from('friend_requests').select('sender_id,receiver_id,status,created_at').eq('status','accepted').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      const friendIds=[...new Set((fr||[]).flatMap(x=>[x.sender_id,x.receiver_id]).filter(id=>id!==user.id))];
      const all=[...new Set([...ids,...friendIds])];
      const {data:profiles}=all.length?await sb.from('profiles').select('id,display_name,bio,avatar_url').in('id',all):{data:[]};
      const map=new Map((profiles||[]).map(p=>[p.id,p]));
      const following=(con||[]).filter(x=>x.follower_id===user.id).map(x=>map.get(x.following_id)).filter(Boolean);
      const followers=(con||[]).filter(x=>x.following_id===user.id).map(x=>map.get(x.follower_id)).filter(Boolean);
      const friends=friendIds.map(id=>map.get(id)).filter(Boolean);
      const card=(p)=>`<div style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #e0eee5;border-radius:12px;margin:8px 0">${avatar(p)}<div style="flex:1"><b>${esc(p.display_name||'Trooth Member')}</b><div style="font-size:12px;color:#718276">${esc(p.bio||'Trooth Community Member')}</div></div><a href="profile.html?id=${encodeURIComponent(p.id)}" style="background:#40916c;color:#fff;text-decoration:none;padding:8px 11px;border-radius:9px;font-weight:700">View Profile</a><a href="chat.html?user=${encodeURIComponent(p.id)}" style="background:#d8f3dc;color:#2d6a4f;text-decoration:none;padding:8px 11px;border-radius:9px;font-weight:700">Message</a></div>`;
      root.innerHTML=`<div data-list="friends"><h3>👥 Friends <small>(${friends.length})</small></h3>${friends.length?friends.map(card).join(''):'<p style="color:#718276">No friends yet.</p>'}</div><div data-list="followers"><h3>👤 Followers <small>(${followers.length})</small></h3>${followers.length?followers.map(card).join(''):'<p style="color:#718276">No followers yet.</p>'}</div><div data-list="following"><h3>➕ Following <small>(${following.length})</small></h3>${following.length?following.map(card).join(''):'<p style="color:#718276">Not following anyone yet.</p>'}</div>`;
    }
    load();
    const ch=sb.channel('trooth-profile-people-live').on('postgres_changes',{event:'*',schema:'public',table:'connections'},load).on('postgres_changes',{event:'*',schema:'public',table:'friend_requests'},load).subscribe();
    window.addEventListener('trooth-auth-profile-ready',load);window.addEventListener('trooth-profile-updated',load);window.troothProfilePeopleChannel=ch;
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();