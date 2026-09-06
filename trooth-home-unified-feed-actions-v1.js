// Trooth Social Independent — unified Home Feed save + interaction actions v3
(function(){
  if(window.__troothHomeUnifiedFeedActionsV3)return;window.__troothHomeUnifiedFeedActionsV3=true;
  var key='trooth-unified-saved-content-v1';
  function getSaved(){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}}
  function setSaved(v){try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}}
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003';document.body.appendChild(t);setTimeout(function(){t.remove()},1800)}
  async function currentUser(sb){try{var r=await sb.auth.getUser();return r.data&&r.data.user||null}catch(e){return null}}
  async function isSaved(sb,user,type,id){if(!user)return getSaved().indexOf(type+':'+id)>-1;try{var r=await sb.from('saved_content').select('id').eq('user_id',user.id).eq('content_type',type).eq('content_id',id).limit(1);return !!(r.data&&r.data.length)}catch(e){return getSaved().indexOf(type+':'+id)>-1}}
  async function toggleSave(sb,user,type,id,button){
    if(!user){toast('Login required to save');location.href='auth.html';return}
    button.disabled=true;
    try{
      var r=await sb.from('saved_content').select('id').eq('user_id',user.id).eq('content_type',type).eq('content_id',id).limit(1);
      if(r.error)throw r.error;
      if(r.data&&r.data.length){var d=await sb.from('saved_content').delete().eq('id',r.data[0].id);if(d.error)throw d.error;button.textContent='🔖 Save';toast('Removed from Saved')}
      else{var i=await sb.from('saved_content').insert({user_id:user.id,content_type:type,content_id:id});if(i.error)throw i.error;button.textContent='🔖 Saved';toast('🔖 Saved')}
      var arr=getSaved(),k=type+':'+id,idx=arr.indexOf(k);if(button.textContent.indexOf('Saved')>-1&&idx<0)arr.push(k);if(button.textContent==='🔖 Save'&&idx>-1)arr.splice(idx,1);setSaved(arr);
      window.dispatchEvent(new CustomEvent('trooth-saved-content-refresh',{detail:{type:type,id:id}}));
    }catch(e){toast(e.message||'Save failed')}finally{button.disabled=false}
  }
  async function decorate(){
    var root=document.getElementById('troothUnifiedNetworkFeed');if(!root||!window.troothSupabase)return;
    var sb=window.troothSupabase,user=await currentUser(sb);
    var articles=[].slice.call(root.querySelectorAll('article[data-content-id]'));
    for(var ai=0;ai<articles.length;ai++){
      var article=articles[ai],type=article.getAttribute('data-content-type'),id=article.getAttribute('data-content-id');
      if(!type||!id)continue;
      var host=article.querySelector('[data-unified-actions]');
      if(!host){
        host=document.createElement('div');host.setAttribute('data-unified-actions','1');host.style.marginTop='10px';
        host.innerHTML='<button data-save type="button" style="border:1px solid #d8e9de;border-radius:999px;padding:8px 12px;background:#fff;font-weight:800;cursor:pointer">🔖 Save</button>';
        article.appendChild(host);
        var save=host.querySelector('[data-save]');save.onclick=function(type,id,save){return function(){toggleSave(sb,user,type,id,save)}}(type,id,save);
      }
      var saveBtn=host.querySelector('[data-save]');
      if(saveBtn){var saved=await isSaved(sb,user,type,id);saveBtn.textContent=saved?'🔖 Saved':'🔖 Save'}
      if(window.TroothInteractions&&!host.querySelector('[data-interactions-box]')){
        var interactionBox=document.createElement('div');interactionBox.setAttribute('data-interactions-box','1');interactionBox.style.marginTop='8px';host.appendChild(interactionBox);window.TroothInteractions.render(sb,user,type,id,interactionBox)
      }
    }
  }
  function watch(){decorate();var root=document.getElementById('troothUnifiedNetworkFeed');if(root&&!root.__unifiedWatch){root.__unifiedWatch=true;new MutationObserver(function(){decorate()}).observe(root,{childList:true,subtree:true})}}
  window.addEventListener('trooth-saved-content-refresh',decorate);
  window.addEventListener('trooth-notifications-refresh',function(){setTimeout(decorate,60)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
  window.addEventListener('trooth-supabase-ready',watch);
  if(window.troothSupabase)window.troothSupabase.auth.onAuthStateChange(function(){setTimeout(decorate,80)});
  else window.addEventListener('trooth-supabase-ready',function(){window.troothSupabase.auth.onAuthStateChange(function(){setTimeout(decorate,80)})},{once:true});
})();
