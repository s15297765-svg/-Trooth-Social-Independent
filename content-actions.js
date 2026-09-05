// Trooth Social Independent — unified content actions
(function(){
  window.TroothContentActions=function(sb,user,contentType,contentId,host){
    if(!host)return;
    if(window.TroothInteractions&&typeof window.TroothInteractions.render==='function'){
      if(host.__troothUnifiedActions)return;
      host.__troothUnifiedActions=true;
      host.innerHTML='';
      var box=document.createElement('div');
      box.className='trooth-unified-actions';
      host.appendChild(box);
      try{window.TroothInteractions.render(sb,user,contentType,contentId,box)}catch(e){host.__troothUnifiedActions=false;}
      return;
    }
    var box=document.createElement('div');box.className='actions';box.style='margin-top:12px;padding-top:10px;border-top:1px solid #e2eee6';
    box.innerHTML='<button data-like>❤️ Like <span>0</span></button> <button data-share>🔄 Share</button><div style="margin-top:8px"><input data-comment placeholder="Write a comment..."><button data-send>💬 Comment</button></div><div data-comments style="margin-top:8px"></div>';
    host.appendChild(box);
    const likeBtn=box.querySelector('[data-like]'),shareBtn=box.querySelector('[data-share]'),sendBtn=box.querySelector('[data-send]'),input=box.querySelector('[data-comment]'),comments=box.querySelector('[data-comments]');
    async function load(){const l=await sb.from('content_likes').select('id,user_id').eq('content_type',contentType).eq('content_id',contentId);const ls=l.data||[];likeBtn.textContent=(user&&ls.some(x=>x.user_id===user.id)?'💚 Unlike ':'❤️ Like ')+ls.length;const c=await sb.from('content_comments').select('body,created_at').eq('content_type',contentType).eq('content_id',contentId).order('created_at',{ascending:false}).limit(20);comments.innerHTML=(c.data||[]).map(x=>'<div style="padding:5px 0;border-bottom:1px solid #edf4ef">💬 '+String(x.body).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))+'</div>').join('')||'<span style="color:#718276">No comments yet.</span>'}
    likeBtn.onclick=async()=>{if(!user){alert('Please login first.');return}const q=await sb.from('content_likes').select('id').eq('user_id',user.id).eq('content_type',contentType).eq('content_id',contentId).maybeSingle();if(q.data)await sb.from('content_likes').delete().eq('id',q.data.id);else await sb.from('content_likes').insert({user_id:user.id,content_type:contentType,content_id:contentId});load()};
    sendBtn.onclick=async()=>{if(!user){alert('Please login first.');return}const body=input.value.trim();if(!body)return;const r=await sb.from('content_comments').insert({user_id:user.id,content_type:contentType,content_id:contentId,body});if(r.error){alert(r.error.message);return}input.value='';load()};
    shareBtn.onclick=()=>{navigator.clipboard?.writeText(location.href.split('#')[0]+'#'+contentId);alert('Link copied!')};load();
  };
})();
