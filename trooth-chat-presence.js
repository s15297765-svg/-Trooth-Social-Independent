// Trooth Social Independent — lightweight realtime chat presence
(function(){
  if(window.__troothChatPresence)return;window.__troothChatPresence=true;
  function boot(){
    if(location.pathname.toLowerCase().indexOf('chat.html')===-1)return;
    var sb=window.troothSupabase;if(!sb)return setTimeout(boot,500);
    var me=null,channel=null,peer=null,lastSeen=0;
    function status(text,on){
      var el=document.getElementById('trooth-peer-presence');
      if(!el){el=document.createElement('div');el.id='trooth-peer-presence';el.style.cssText='margin:2px 14px 8px;color:#718276;font:600 12px system-ui';var h=document.querySelector('main')||document.body;h.insertBefore(el,h.firstChild)}
      el.textContent=text||'';el.style.color=on?'#40916c':'#718276';
    }
    function peerId(){var q=new URLSearchParams(location.search).get('user');if(q)return q;var el=document.querySelector('[data-user-id][data-active="true"],[data-user-id].active');return el&&el.getAttribute('data-user-id')||null}
    function connect(){
      if(!me||!peer)return;
      if(channel)try{sb.removeChannel(channel)}catch(e){}
      var room=[me.id,peer].sort().join('-');channel=sb.channel('trooth-presence-'+room,{config:{presence:{key:me.id}}});
      channel.on('presence',{event:'sync'},function(){var state=channel.presenceState();var online=!!state[peer];status(online?'● Online':'○ Offline',online)}).on('presence',{event:'join'},function(e){if(e.key===peer)status('● Online',true)}).on('presence',{event:'leave'},function(e){if(e.key===peer)status('○ Offline',false)}).subscribe(function(s){if(s==='SUBSCRIBED'){channel.track({online_at:new Date().toISOString()})}});
    }
    async function start(){try{var r=await sb.auth.getUser();me=r.data&&r.data.user}catch(e){}if(!me)return;peer=peerId();if(peer)connect()}
    window.addEventListener('trooth-chat-peer-change',function(e){peer=e.detail&&e.detail.userId||peerId();connect()});window.addEventListener('popstate',function(){peer=peerId();connect()});
    start();setInterval(function(){var p=peerId();if(p!==peer){peer=p;connect()}},2000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
