// Trooth Social Independent — unified Home Feed interaction actions v1
(function(){
  if(window.__troothHomeUnifiedFeedActionsV1)return;window.__troothHomeUnifiedFeedActionsV1=true;
  var key='trooth-unified-saved-content-v1';
  function getSaved(){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}}
  function setSaved(v){try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}}
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003';document.body.appendChild(t);setTimeout(function(){t.remove()},1800)}
  async function currentUser(sb){try{var r=await sb.auth.getUser();return r.data&&r.data.user||null}catch(e){return null}}
  async function decorate(){
    var root=document.getElementById('troothUnifiedNetworkFeed');if(!root||!window.troothSupabase)return;
    var user=await currentUser(window.troothSupabase);
    root.querySelectorAll('article[data-content-id]').forEach(function(article){
      if(article.querySelector('[data-unified-actions]'))return;
      var host=document.createElement('div');host.setAttribute('data-unified-actions','1');host.style.marginTop='10px';
      var type=article.getAttribute('data-content-type'),id=article.getAttribute('data-content-id');
      var saved=getSaved().indexOf(type+':'+id)>-1;
      host.innerHTML='<button data-save type="button" style="border:1px solid #d8e9de;border-radius:999px;padding:8px 12px;background:#fff;font-weight:800;cursor:pointer">'+(saved?'🔖 Saved':'🔖 Save')+'</button>';
      article.appendChild(host);
      var save=host.querySelector('[data-save]');save.onclick=function(){var arr=getSaved(),k=type+':'+id,idx=arr.indexOf(k);if(idx>-1){arr.splice(idx,1);save.textContent='🔖 Save';toast('Removed from Saved')}else{arr.push(k);save.textContent='🔖 Saved';toast('🔖 Saved on this device')}setSaved(arr)};
      if(window.TroothInteractions){var interactionBox=document.createElement('div');interactionBox.style.marginTop='8px';article.appendChild(interactionBox);window.TroothInteractions.render(window.troothSupabase,user,type,id,interactionBox)}
    });
  }
  function watch(){decorate();var root=document.getElementById('troothUnifiedNetworkFeed');if(root&&!root.__unifiedWatch){root.__unifiedWatch=true;new MutationObserver(function(){decorate()}).observe(root,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
  window.addEventListener('trooth-supabase-ready',watch);
})();
