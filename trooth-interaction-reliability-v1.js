// Trooth Social Independent — interaction reliability + Home Feed persistence v6
(function(){
  if(window.__troothInteractionReliabilityV6)return;window.__troothInteractionReliabilityV6=true;
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 15px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 28px);text-align:center';document.body.appendChild(t);setTimeout(function(){t.remove()},1900)}
  function copyFallback(url){var ta=document.createElement('textarea');ta.value=url;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();toast(ok?'🔗 Link copied':'Copy unavailable')}
  function copyLink(url){if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(url).then(function(){toast('🔗 Link copied')}).catch(function(){copyFallback(url)});else copyFallback(url)}
  function enhance(){document.querySelectorAll('.post').forEach(function(card){var id=card.getAttribute('data-post'),bar=card.querySelector('.postActions');if(!id||!bar||bar.querySelector('[data-trooth-save]'))return;});document.querySelectorAll('.post').forEach(function(card){var id=card.getAttribute('data-post'),bar=card.querySelector('.postActions');if(!id||!bar||bar.querySelector('[data-trooth-save]'))return;var b=document.createElement('button');b.type='button';b.setAttribute('data-trooth-save','1');b.textContent='🔖 Save';b.onclick=function(){window.troothSavePost&&window.troothSavePost(id)};bar.appendChild(b)})}
  function patchFeed(){
    if(typeof window.renderPosts!=='function'||!window.troothSupabase||!window.user)return false;
    if(!window.__troothFeedPatchedV6){
      window.__troothFeedPatchedV6=true;
      var oldRender=window.renderPosts;window.renderPosts=function(){var r=oldRender.apply(this,arguments);setTimeout(enhance,0);return r};
      window.troothSavePost=async function(id){var sb=window.troothSupabase,u=window.user;if(!u){location.href='auth.html';return}var q=await sb.from('saved_posts').select('id').eq('post_id',id).eq('user_id',u.id).maybeSingle();if(q.error){toast(q.error.message||'Save unavailable');return}if(q.data){var d=await sb.from('saved_posts').delete().eq('id',q.data.id);if(d.error){toast(d.error.message||'Could not remove save');return}toast('🔖 Removed from Saved')}else{var i=await sb.from('saved_posts').insert({post_id:id,user_id:u.id});if(i.error){toast(i.error.message||'Could not save post');return}toast('🔖 Post saved')}window.renderPosts()};
      window.likePost=async function(id){var sb=window.troothSupabase,u=window.user;if(!u){location.href='auth.html';return}var q=await sb.from('post_likes').select('post_id').eq('post_id',id).eq('user_id',u.id).maybeSingle();if(q.error){toast(q.error.message||'Like unavailable');return}var r=q.data?await sb.from('post_likes').delete().eq('post_id',id).eq('user_id',u.id):await sb.from('post_likes').insert({post_id:id,user_id:u.id});if(r.error){toast(r.error.message||'Like failed');return}var c=await sb.from('post_likes').select('post_id',{count:'exact',head:true}).eq('post_id',id),el=document.getElementById('lc-'+id);if(el)el.textContent=c.count||0;toast(q.data?'Like removed':'❤️ Liked')};
      window.sharePost=async function(id){var sb=window.troothSupabase,u=window.user;if(!u){location.href='auth.html';return}var url=location.origin+location.pathname+'#post-'+encodeURIComponent(id),ok=false;try{if(navigator.share){await navigator.share({title:'Trooth',text:'Check this post on Trooth',url:url});ok=true}else{copyLink(url);ok=true}}catch(e){if(e&&e.name==='AbortError')return;copyLink(url);ok=true}if(ok){var q=await sb.from('shares').select('id').eq('post_id',id).eq('user_id',u.id).maybeSingle();if(!q.error&&!q.data)await sb.from('shares').insert({post_id:id,user_id:u.id});toast('↗️ Shared')}};
      enhance();return true;
    }
    enhance();return true;
  }
  function boot(){var tries=0,t=setInterval(function(){tries++;if(patchFeed()||tries>100)clearInterval(t)},250)}
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
  window.addEventListener('online',function(){toast('🟢 Back online')});window.addEventListener('offline',function(){toast('🔴 You are offline')});
})();
