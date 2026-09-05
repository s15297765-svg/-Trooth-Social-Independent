// Trooth Social Independent — unified content actions bridge
(function(){
  if(window.__troothContentActionsBridge)return;window.__troothContentActionsBridge=true;
  function boot(){
    if(!window.TroothContentActions||!window.TroothInteractions)return;
    var original=window.TroothContentActions;
    window.TroothContentActions=function(sb,user,type,id,host){
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
    };
  }
  function wait(){if(window.TroothInteractions&&window.TroothContentActions)boot();else setTimeout(wait,400)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
