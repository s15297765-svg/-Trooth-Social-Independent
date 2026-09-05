// Trooth Social Independent — online presence UI
(function(){
  function boot(){
    if(window.__troothPresenceUI)return;window.__troothPresenceUI=true;
    var online={};
    function flatten(state){
      var out={};Object.keys(state||{}).forEach(function(key){(state[key]||[]).forEach(function(item){if(item&&item.user_id)out[item.user_id]=item})});return out;
    }
    function render(){
      document.querySelectorAll('[data-user-id]').forEach(function(el){
        var id=el.getAttribute('data-user-id');if(!id)return;
        var dot=el.querySelector('.trooth-online-dot');
        if(!dot){dot=document.createElement('span');dot.className='trooth-online-dot';dot.style='display:inline-block;width:9px;height:9px;border-radius:50%;margin-left:5px;vertical-align:middle;background:#b7c1ba;box-shadow:0 0 0 2px #fff';el.appendChild(dot)}
        var is=!!online[id];dot.style.background=is?'#2ecc71':'#b7c1ba';dot.title=is?'Online':'Offline';
      });
    }
    window.addEventListener('trooth-presence-sync',function(e){online=flatten(e.detail&&e.detail.state);render()});
    window.addEventListener('trooth-presence-join',function(e){var x=e.detail&&e.detail.newPresences||[];x.forEach(function(v){if(v.user_id)online[v.user_id]=v});render()});
    window.addEventListener('trooth-presence-leave',function(e){var x=e.detail&&e.detail.leftPresences||[];x.forEach(function(v){if(v.user_id)delete online[v.user_id]});render()});
    setInterval(render,5000);render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
