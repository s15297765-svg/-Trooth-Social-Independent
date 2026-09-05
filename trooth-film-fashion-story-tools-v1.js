// Trooth Social Independent — Film & Fashion Story Space tools v1
(function(){
  if(window.__troothFilmFashionStoryToolsV1)return;window.__troothFilmFashionStoryToolsV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1800);}
  function boot(){
    if(!location.pathname.toLowerCase().endsWith('film-fashion.html'))return;
    function enhance(){
      document.querySelectorAll('.story').forEach(function(card){
        if(card.dataset.troothStoryTools)return;card.dataset.troothStoryTools='1';
        var id=card.dataset.id;if(!id)return;
        var actions=card.querySelector('.actions');if(!actions)return;
        var copy=document.createElement('button');copy.type='button';copy.className='feedbtn';copy.textContent='🔗 Copy Story Link';
        copy.onclick=function(e){e.stopPropagation();var url=location.origin+location.pathname+'#story-'+encodeURIComponent(id);if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){toast('🔗 Story link copied')}).catch(function(){toast('🔗 Story link ready')});else toast('🔗 Story link ready');};
        actions.appendChild(copy);
      });
      var hash=location.hash.replace('#story-','');if(hash){var target=document.querySelector('[data-id="'+CSS.escape(hash)+'"]');if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}
    }
    var observer=new MutationObserver(function(){clearTimeout(window.__troothFilmFashionToolsTimer);window.__troothFilmFashionToolsTimer=setTimeout(enhance,120)});observer.observe(document.body,{childList:true,subtree:true});enhance();
    window.addEventListener('hashchange',enhance);window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
