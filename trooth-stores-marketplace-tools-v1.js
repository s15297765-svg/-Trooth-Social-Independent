// Trooth Social Independent — Stores Marketplace tools v1
(function(){
  if(window.__troothStoresMarketplaceToolsV1)return;window.__troothStoresMarketplaceToolsV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1800);}
  function boot(){
    if(!location.pathname.toLowerCase().endsWith('stores.html'))return;
    function enhance(){
      document.querySelectorAll('.store').forEach(function(card){
        if(card.dataset.troothMarketTools)return;card.dataset.troothMarketTools='1';
        var id=card.dataset.id;if(!id)return;
        var row=card.querySelector('.feed-share');
        var share=document.createElement('button');share.type='button';share.textContent='🔗 Copy Link';share.className='market-copy';
        share.onclick=function(e){e.stopPropagation();var url=location.origin+location.pathname+'#listing-'+encodeURIComponent(id);if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){toast('🔗 Listing link copied')}).catch(function(){toast('🔗 Listing link ready')});else toast('🔗 Listing link ready');};
        (row&&row.parentNode?row.parentNode:card).appendChild(share);
      });
      var hash=location.hash.replace('#listing-','');if(hash){var target=document.querySelector('[data-id="'+CSS.escape(hash)+'"]');if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}
    }
    var observer=new MutationObserver(function(){clearTimeout(window.__troothStoreToolsTimer);window.__troothStoreToolsTimer=setTimeout(enhance,120)});observer.observe(document.body,{childList:true,subtree:true});enhance();
    window.addEventListener('hashchange',enhance);window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
