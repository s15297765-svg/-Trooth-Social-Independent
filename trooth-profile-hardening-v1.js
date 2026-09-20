// Trooth profile hardening — 2026-09-20
(function(){
  if(window.__troothProfileHardeningV1)return;
  window.__troothProfileHardeningV1=true;
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])||c)}
  function client(){return window.troothSupabase}
  async function ensureProfile(sb,u){
    const meta=u?.user_metadata||{};
    const seed={id:u.id,display_name:meta.display_name||meta.full_name||u.email?.split('@')[0]||'Trooth Member',bio:meta.bio||'',is_public:true};
    const q=await sb.from('profiles').select('id,display_name,bio,is_public,avatar_url,cover_url,updated_at').eq('id',u.id).maybeSingle();
    if(q.error)throw q.error;
    if(q.data)return q.data;
    const ins=await sb.from('profiles').upsert(seed,{onConflict:'id'}).select('id,display_name,bio,is_public,avatar_url,cover_url,updated_at').maybeSingle();
    if(ins.error)throw ins.error;
    if(!ins.data)throw new Error('Profile record could not be created.');
    return ins.data;
  }
  async function upload(kind,file){
    const busyKey='__troothProfileUpload_'+kind;
    if(window[busyKey])return;
    window[busyKey]=true;
    try{
      const sb=client(),u=(await sb.auth.getUser()).data.user,status=document.getElementById('status');
      if(!sb||!u){if(status)status.textContent='Please login again.';return}
      if(!file){return}
      if(!file.type.startsWith('image/')){if(status)status.textContent='Please choose an image file.';return}
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)){if(status)status.textContent='Use JPG, PNG or WebP.';return}
      if(file.size>8*1024*1024){if(status)status.textContent='Image must be 8 MB or smaller.';return}
      if(status)status.textContent='Uploading '+(kind==='avatar'?'profile photo':'cover photo')+'…';
      let profile=await ensureProfile(sb,u);
      const img=await new Promise((resolve,reject)=>{
        const im=new Image(),url=URL.createObjectURL(file);
        im.onload=()=>{try{
          const max=kind==='avatar'?900:1600,scale=Math.min(1,max/Math.max(im.width,im.height));
          const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));
          c.getContext('2d').drawImage(im,0,0,c.width,c.height);
          c.toBlob(b=>{URL.revokeObjectURL(url);b?resolve(b):reject(new Error('Image preparation failed.'))},'image/jpeg',.86);
        }catch(e){URL.revokeObjectURL(url);reject(e)}};
        im.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Could not read the selected image.'))};
        im.src=url;
      });
      const path=u.id+'/'+kind+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.jpg';
      const up=await sb.storage.from('profile-media').upload(path,img,{upsert:true,contentType:'image/jpeg',cacheControl:'3600'});
      if(up.error)throw up.error;
      const base=sb.storage.from('profile-media').getPublicUrl(path).data.publicUrl;
      const url=base+'?v='+Date.now();
      const patch={};patch[kind==='avatar'?'avatar_url':'cover_url']=url;patch.updated_at=new Date().toISOString();
      const r=await sb.from('profiles').upsert({id:u.id,...patch},{onConflict:'id'}).select('id,display_name,bio,is_public,avatar_url,cover_url,updated_at').maybeSingle();
      if(r.error)throw r.error;
      profile=r.data;
      window.profile=profile;
      const av=document.getElementById('avatar'),cv=document.getElementById('cover');
      if(kind==='avatar'&&av){av.classList.remove('media-fallback');av.innerHTML='<img src="'+esc(url)+'" alt="Profile photo">'}
      if(kind==='cover'&&cv){cv.classList.remove('media-fallback');cv.style.backgroundImage='url("'+esc(url)+'")';cv.dataset.mediaUrl=url}
      const ai=document.getElementById('avatarInput'),ci=document.getElementById('coverInput');
      if(ai)ai.value=profile.avatar_url||'';if(ci)ci.value=profile.cover_url||'';
      if(status)status.textContent=(kind==='avatar'?'Profile photo':'Cover photo')+' updated ✓';
      window.dispatchEvent(new CustomEvent('trooth-profile-updated',{detail:{profile:profile}}));
    }catch(e){if(status)status.textContent='Upload failed: '+(e?.message||'Please try again.')}
    finally{window[busyKey]=false}
  }
  async function save(){
    if(window.__troothProfileSaveBusy)return;
    window.__troothProfileSaveBusy=true;
    try{
      const sb=client(),status=document.getElementById('status'),u=(await sb?.auth.getUser?.()).data?.user;
      if(!sb||!u){if(status)status.textContent='Please login again.';return}
      const existing=await ensureProfile(sb,u);
      const patch={id:u.id,display_name:(document.getElementById('displayName')?.value||'').trim()||existing.display_name||'Trooth Member',bio:(document.getElementById('bioInput')?.value||'').trim(),avatar_url:(document.getElementById('avatarInput')?.value||'').trim()||existing.avatar_url||null,cover_url:(document.getElementById('coverInput')?.value||'').trim()||existing.cover_url||null,is_public:existing.is_public!==false,updated_at:new Date().toISOString()};
      const r=await sb.from('profiles').upsert(patch,{onConflict:'id'}).select('id,display_name,bio,is_public,avatar_url,cover_url,updated_at').maybeSingle();
      if(r.error)throw r.error;
      window.profile=r.data;
      if(status)status.textContent='Profile saved ✓';
      if(typeof window.renderProfile==='function')window.renderProfile();
      window.dispatchEvent(new CustomEvent('trooth-profile-updated',{detail:{profile:r.data}}));
    }catch(e){if(status)status.textContent='Save failed: '+(e?.message||'Please try again.')}
    finally{window.__troothProfileSaveBusy=false}
  }
  window.uploadProfileImage=upload;
  window.saveProfile=save;
})();