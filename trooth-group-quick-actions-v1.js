// Trooth Social Independent — Group quick actions v1
(function(){
  if(window.__troothGroupQuickActionsV1)return;window.__troothGroupQuickActionsV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1800);}
  function boot(){
    if(!location.pathname.toLowerCase().endsWith('group.html'))return;
    function enhance(){
      document.querySelectorAll('.post').forEach(function(card){
        if(card.__troothQuickActions)return;
        var actions=card.querySelector('.actions');if(!actions)return;
        card.__troothQuickActions=true;
        var copy=document.createElement('button');copy.type='button';copy.className='mini';copy.textContent='🔗 Copy Link';
        copy.onclick=function(e){e.stopPropagation();var id=new URLSearchParams(location.search).get('id')||'';var url=location.origin+location.pathname+'?id='+encodeURIComponent(id);if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){toast('🔗 Group link copied')}).catch(function(){toast('🔗 Link ready')})}else toast('🔗 Link ready');};
        actions.appendChild(copy);
      });
    }
    var observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});enhance();
    window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
