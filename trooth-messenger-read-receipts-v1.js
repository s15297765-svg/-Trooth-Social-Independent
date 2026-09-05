// Trooth Social Independent — Messenger read/seen realtime bridge v1
(function(){
  if(window.__troothMessengerReadReceiptsV1)return;window.__troothMessengerReadReceiptsV1=true;
  function boot(){
    if(window.__troothMessengerReadReceiptsBooted)return;window.__troothMessengerReadReceiptsBooted=true;
    var sb=window.troothSupabase;if(!sb)return;
    var channel=null,user=null,selected=null,timer=null;
    function ready(){return window.troothSupabase===sb}
    async function auth(){try{var r=await sb.auth.getUser();user=r.data&&r.data.user}catch(e){user=null}return user}
    async function mark(id){if(!user||!id)return;try{await sb.from('messages').update({is_read:true}).eq('sender_id',id).eq('receiver_id',user.id).eq('is_read',false);window.dispatchEvent(new CustomEvent('trooth-message-seen',{detail:{userId:id}}))}catch(e){}}
    function render(){
      document.querySelectorAll('.msg').forEach(function(el){
        var mine=el.classList.contains('mine');if(!mine)return;
        var small=el.querySelector('small');if(!small)return;
        var text=small.textContent||'';
        if(/✓✓|✓/.test(text)){
          var seen=text.indexOf('✓✓')>-1;
          small.setAttribute('data-trooth-seen',seen?'seen':'sent');
          small.title=seen?'Seen by recipient':'Sent';
        }
      });
    }
    function watch(){
      if(channel)try{sb.removeChannel(channel)}catch(e){}
      if(!user)return;
      channel=sb.channel('trooth-read-receipts-'+user.id).on('postgres_changes',{event:'UPDATE',schema:'public',table:'messages',filter:'receiver_id=eq.'+user.id},function(p){var m=p.new||{};if(m.is_read&&m.sender_id){window.dispatchEvent(new CustomEvent('trooth-message-seen',{detail:{userId:m.sender_id,messageId:m.id}}));render()}}).subscribe();
    }
    window.troothMarkConversationSeen=mark;
    window.addEventListener('trooth-chat-peer-change',function(e){selected=e.detail&&e.detail.userId;if(selected)mark(selected);render()});
    window.addEventListener('trooth-messages-refresh',function(){clearTimeout(timer);timer=setTimeout(render,120)});
    window.addEventListener('visibilitychange',function(){if(!document.hidden&&selected)mark(selected)});
    sb.auth.onAuthStateChange(async function(){user=await auth();watch()});
    auth().then(watch);
    setTimeout(render,500);
  }
  function start(){if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
