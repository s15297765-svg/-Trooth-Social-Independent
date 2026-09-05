// Trooth Social Independent — messenger online presence bridge
(function(){
  function boot(){
    if(window.__troothChatPresenceUI)return;window.__troothChatPresenceUI=true;
    if(location.pathname.toLowerCase().indexOf('chat.html')===-1)return;
    var sb=window.troothSupabase;if(!sb||!sb.channel)return setTimeout(boot,1200);
    var current=null,peer=null,ch=null,online={};
    function getPeer(){var q=new URLSearchParams(location.search).get('user');if(q)return q;var el=document.querySelector('[data-user-id][data-active="true"],[data-user-id].active');return el?el.getAttribute('data-user-id'):null}
    function flatten(state){var out={};Object.keys(state||{}).forEach(function(k){(state[k]||[]).forEach(function(x){if(x&&x.user_id)out[x.user_id]=x})});return out}
    function render(){var id=peer,head=document.getElementById('chatHead');if(!head||!id)return;var dot=head.querySelector('.trooth-chat-online');if(!dot){dot=document.createElement('span');dot.className='trooth-chat-online';dot.style='display:inline-block;width:9px;height:9px;border-radius:50%;margin-left:6px;background:#b7c1ba;box-shadow:0 0 0 2px #fff';var label=head.querySelector('.online')||head.querySelector('.muted');if(label)label.appendChild(dot);else head.appendChild(dot)}dot.style.background=online[id]?'#2ecc71':'#b7c1ba';dot.title=online[id]?'Online now':'Offline'}
    function connect(){if(!current||!peer)return;if(ch)try{sb.removeChannel(ch)}catch(e){};ch=sb.channel('trooth-chat-presence-'+[current.id,peer].sort().join('-'));ch.on('presence',{event:'sync'},function(){online=flatten(ch.presenceState());render()});ch.on('presence',{event:'join'},function(){online=flatten(ch.presenceState());render()});ch.on('presence',{event:'leave'},function(){online=flatten(ch.presenceState());render()});ch.subscribe(function(status){if(status==='SUBSCRIBED')ch.track({user_id:current.id,chat_peer:peer,online_at:new Date().toISOString()})})}
    sb.auth.getUser().then(function(r){current=r.data&&r.data.user;if(!current)return;peer=getPeer();connect();render()});
    setInterval(function(){var p=getPeer();if(p!==peer){peer=p;connect()}render()},2500);
    window.addEventListener('trooth-chat-peer-change',function(e){peer=e.detail&&e.detail.userId||getPeer();connect();render()});
    window.addEventListener('trooth-presence-sync',function(e){online=flatten(e.detail&&e.detail.state);render()});
    window.addEventListener('beforeunload',function(){if(ch)ch.untrack().catch(function(){})});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2200)},{once:true});else setTimeout(boot,2200);
})();
