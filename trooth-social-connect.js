/* Trooth Social Independent — connect Profile, Friends, Following and Chat */
(function(){
  const path=location.pathname.toLowerCase();
  const params=new URLSearchParams(location.search);
  const target=params.get('user')||params.get('id');

  function boot(){
    if(!window.troothSupabase) return;
    if(target && path.endsWith('chat.html')) openChat(target);
    if(target && path.endsWith('friends.html')) openFriendChat(target);
    window.addEventListener('trooth-friend-request',refreshProfile);
    window.addEventListener('trooth-friends-social-update',refreshProfile);
  }

  function openChat(id){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(typeof window.select==='function' && Array.isArray(window.people)){
        clearInterval(timer);
        if(window.people.some(p=>p.id===id)) window.select(id);
      }
      if(tries>40) clearInterval(timer);
    },250);
  }

  function openFriendChat(id){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(typeof window.selectFriend==='function'){
        clearInterval(timer);
        try{
          if(typeof window.showTab==='function') window.showTab('chat',document.querySelector('[data-tab="chat"]'));
          window.selectFriend(id);
        }catch(e){ console.warn('Trooth social connect:',e); }
      }
      if(tries>40) clearInterval(timer);
    },250);
  }

  function refreshProfile(){
    if(!path.endsWith('profile.html')) return;
    try{ if(typeof window.loadStats==='function') window.loadStats(); }catch(e){}
    try{ if(typeof window.renderActions==='function') window.renderActions(); }catch(e){}
  }

  window.troothOpenChat=function(id){
    if(id) location.href='chat.html?user='+encodeURIComponent(id);
  };

  if(window.troothSupabase) boot();
  else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
