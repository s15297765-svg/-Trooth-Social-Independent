// Trooth Social Independent — Business Network Tools v1
(function(){
  if(window.__troothBusinessNetworkToolsV1)return;window.__troothBusinessNetworkToolsV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1800);}
  function boot(){
    if(!location.pathname.toLowerCase().endsWith('business.html'))return;
    function enhance(){
      document.querySelectorAll('.biz').forEach(function(card){
        if(card.__troothBizTools)return;card.__troothBizTools=true;
        var id=card.querySelector('[id^="i-"]');
        var bid=id?id.id.slice(2):'';
        var actions=card.querySelector('.actions');if(!actions||!bid)return;
        var share=document.createElement('button');share.type='button';share.textContent='↗️ Share';
        share.onclick=function(){
          var url=location.origin+location.pathname+'#business-'+encodeURIComponent(bid);
          var name=(card.querySelector('h2')||{}).textContent||'Trooth Business';
          if(navigator.share)navigator.share({title:name,text:'View this business on Trooth',url:url}).catch(function(){});
          else if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){toast('🔗 Business link copied')}).catch(function(){toast('🔗 Share link ready')});
          else toast('🔗 Share link ready');
        };
        var copy=document.createElement('button');copy.type='button';copy.textContent='🔗 Copy Link';
        copy.onclick=function(){var url=location.origin+location.pathname+'#business-'+encodeURIComponent(bid);if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){toast('🔗 Business link copied')}).catch(function(){toast('🔗 Copy link ready')});else toast('🔗 Copy link ready')};
        actions.appendChild(share);actions.appendChild(copy);
      });
    }
    var observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});enhance();
    function jump(){var h=location.hash||'';if(h.indexOf('#business-')!==0)return;var id=h.slice(10);var el=document.getElementById('i-'+decodeURIComponent(id));if(el){var card=el.closest('.biz');if(card)card.scrollIntoView({behavior:'smooth',block:'center'});var btn=card&&card.querySelector('button');if(btn)setTimeout(function(){btn.click()},150)}}
    window.addEventListener('hashchange',jump);setTimeout(jump,500);
    window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
