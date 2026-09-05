// Trooth Social Independent — Group social tools v1
(function(){
  if(window.__troothGroupSocialToolsV1)return;window.__troothGroupSocialToolsV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1700);}
  function boot(){
    var path=location.pathname.toLowerCase();
    if(!path.endsWith('group.html'))return;
    var id=new URLSearchParams(location.search).get('id');
    if(!id)return;
    function enhance(){
      var cards=document.querySelectorAll('.post');
      cards.forEach(function(card){
        if(card.__troothTools)return;card.__troothTools=true;
        var body=card.querySelector('.postbody');
        var actions=card.querySelector('.actions');
        if(!actions)return;
        var share=document.createElement('button');share.type='button';share.textContent='↗️ Share';
        share.onclick=function(){
          var text=body?body.textContent.trim():'';
          var url=location.origin+location.pathname+'?id='+encodeURIComponent(id);
          if(navigator.share){navigator.share({title:'Trooth Group',text:text.slice(0,180),url:url}).catch(function(){})}
          else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){toast('🔗 Group link copied')}).catch(function(){toast('🔗 Share link ready')})}
          else toast('🔗 Share link ready');
        };
        actions.appendChild(share);
      });
    }
    var observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});
    enhance();
    window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
