// Trooth Social Independent — realtime messenger typing indicator
(function(){
  if(window.__troothChatTyping)return;window.__troothChatTyping=true;
  function boot(){
    if(location.pathname.toLowerCase().indexOf('chat.html')===-1)return;
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,500);
    var channel=null,timer=null,idle=null,currentUser=null,peerId=null;
    function toastTyping(show){
      var el=document.getElementById('trooth-typing-indicator');
      if(!el){el=document.createElement('div');el.id='trooth-typing-indicator';el.textContent='typing…';el.style.cssText='display:none;margin:0 14px 8px;color:#40916c;font:700 13px system-ui';var box=document.querySelector('textarea,input[type="text"]');if(box&&box.parentElement)box.parentElement.insertBefore(el,box);else document.body.appendChild(el)}
      el.style.display=show?'block':'none';
    }
    async function user(){try{var r=await sb.auth.getUser();return r.data&&r.data.user?r.data.user:null}catch(e){return null}}
    function getPeer(){var q=new URLSearchParams(location.search).get('user');if(q)return q;var el=document.querySelector('[data-user-id][data-active="true"],[data-user-id].active');return el?el.getAttribute('data-user-id'):null}
    function connect(){
      if(!currentUser||!peerId)return;
      if(channel)try{sb.removeChannel(channel)}catch(e){}
      var room=[currentUser.id,peerId].sort().join('-');
      channel=sb.channel('trooth-typing-'+room);
      channel.on('broadcast',{event:'typing'},function(p){var d=p.payload||{};if(d.from===peerId&&d.to===currentUser.id){toastTyping(!!d.typing);clearTimeout(timer);if(d.typing)timer=setTimeout(function(){toastTyping(false)},2500)}}).subscribe();
    }
    function send(flag){if(!channel||!peerId||!currentUser)return;channel.send({type:'broadcast',event:'typing',payload:{from:currentUser.id,to:peerId,typing:!!flag}})}
    function wire(){
      var inputs=[].slice.call(document.querySelectorAll('textarea,input[type="text"]')).filter(function(x){return !/search/i.test((x.placeholder||'')+' '+(x.name||''))});
      if(!inputs.length)return setTimeout(wire,800);
      var input=inputs[inputs.length-1];input.addEventListener('input',function(){send(true);clearTimeout(idle);idle=setTimeout(function(){send(false)},1100)});input.addEventListener('blur',function(){send(false)});
    }
    function start(){user().then(function(u){currentUser=u;if(!u)return;peerId=getPeer();connect();wire()})}
    window.addEventListener('popstate',function(){peerId=getPeer();connect()});window.addEventListener('trooth-chat-peer-change',function(e){peerId=e.detail&&e.detail.userId||getPeer();toastTyping(false);connect();wire()});
    start();setInterval(function(){var p=getPeer();if(p!==peerId){peerId=p;toastTyping(false);connect();wire()}},1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
