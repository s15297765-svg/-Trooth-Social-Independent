// Trooth Social Independent — unified content actions bridge v2
(function(){
  if(window.__troothContentActionsBridgeV2)return;window.__troothContentActionsBridgeV2=true;
  var started=Date.now(),timer=null;
  function boot(){
    if(!window.TroothContentActions||!window.TroothInteractions)return false;
    var original=window.TroothContentActions;
    if(original.__troothBridgeWrapped)return true;
    function unified(sb,user,type,id,host){
      if(!host)return;
      try{
        if(host.__troothUnifiedActions)return;
        host.__troothUnifiedActions=true;
        host.innerHTML='';
        var box=document.createElement('div');
        box.className='trooth-unified-actions';
        box.__troothType=type;box.__troothId=id;
        host.appendChild(box);
        window.TroothInteractions.render(sb,user,type,id,box);
      }catch(e){
        host.__troothUnifiedActions=false;
        try{original(sb,user,type,id,host)}catch(_){ }
      }
    }
    unified.__troothBridgeWrapped=true;
    unified.__troothOriginal=original;
    window.TroothContentActions=unified;
    return true;
  }
  function wait(){
    if(boot()){if(timer){clearTimeout(timer);timer=null}return;}
    if(Date.now()-started<30000)timer=setTimeout(wait,400);
  }
  ['trooth-supabase-ready','trooth-content-interaction-refresh','trooth-home-live-refresh'].forEach(function(ev){window.addEventListener(ev,wait);});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
