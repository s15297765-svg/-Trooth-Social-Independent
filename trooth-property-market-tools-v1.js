// Trooth Social Independent — Property marketplace tools v1
(function(){
  if(window.__troothPropertyMarketToolsV1)return;window.__troothPropertyMarketToolsV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1800);}
  function boot(){
    if(!location.pathname.toLowerCase().endsWith('property.html'))return;
    function enhance(){
      document.querySelectorAll('.property').forEach(function(card){
        if(card.__troothPropertyTools)return;
        var actions=card.querySelector('.actions');if(!actions)return;
        var shareFeed=actions.querySelector('[onclick*="sharePropertyToFeed"]');
        if(!shareFeed)return;
        card.__troothPropertyTools=true;
        var copy=document.createElement('button');copy.type='button';copy.className='feed-share';copy.textContent='🔗 Copy Listing Link';
        copy.onclick=function(e){e.stopPropagation();var id=(shareFeed.getAttribute('onclick')||'').match(/sharePropertyToFeed\(['"]([^'"]+)/);var gid=id?id[1]:'';var url=location.origin+location.pathname+(gid?'?id='+encodeURIComponent(gid):'');if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){toast('🔗 Property link copied')}).catch(function(){toast('🔗 Link ready')})}else toast('🔗 Link ready');};
        actions.appendChild(copy);
      });
    }
    var observer=new MutationObserver(function(){setTimeout(enhance,80)});observer.observe(document.body,{childList:true,subtree:true});enhance();
    window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
