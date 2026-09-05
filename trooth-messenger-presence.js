// Trooth Social Independent — messenger presence + live unread pulse
(function(){
  function boot(){
    if(window.__troothMessengerPresence)return;window.__troothMessengerPresence=true;
    function notify(text){
      var t=document.createElement('div');t.textContent=text;t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003';document.body.appendChild(t);setTimeout(function(){t.remove()},2800)
    }
    function connect(){
      var sb=window.troothSupabase;if(!sb||!navigator.onLine)return;
      sb.auth.getUser().then(function(r){
        var u=r.data&&r.data.user;if(!u)return;
        if(window.__troothMsgChannel){try{sb.removeChannel(window.__troothMsgChannel)}catch(e){}}
        var c=sb.channel('trooth-message-presence-'+u.id);
        c.on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'receiver_id=eq.'+u.id},function(p){
          var m=p.new||{};if(m.sender_id===u.id)return;
          var active=document.visibilityState==='visible'&&location.pathname.toLowerCase().indexOf('chat.html')>-1;
          if(!active)notify('💬 نئی message موصول ہوئی ہے');
          window.dispatchEvent(new CustomEvent('trooth-messages-refresh'));
          window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
        }).subscribe();
        window.__troothMsgChannel=c;
      })
    }
    window.addEventListener('online',connect);window.addEventListener('visibilitychange',function(){if(!document.hidden)connect()});setTimeout(connect,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
