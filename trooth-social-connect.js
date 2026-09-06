/* Trooth Social Independent — connect Profile, Friends, Following and Chat */
(function(){
  if(window.__troothSocialConnectV2)return;window.__troothSocialConnectV2=true;
  const path=location.pathname.toLowerCase();
  const params=new URLSearchParams(location.search);
  const target=params.get('user')||params.get('id');
  function boot(){
    if(!window.troothSupabase)return;
    window.addEventListener('trooth-friend-request',refresh);
    window.addEventListener('trooth-friend-request-sent',refresh);
    window.addEventListener('trooth-social-graph-refresh',refresh);
    if(target&&path.endsWith('chat.html')&&typeof window.select==='function')window.select(target);
    if(target&&path.endsWith('friends.html')&&typeof window.selectFriend==='function')window.selectFriend(target);
  }
  function refresh(){
    if(path.endsWith('friends.html')){
      ['loadSocial','loadStats','renderPeople'].forEach(function(n){if(typeof window[n]==='function')try{window[n]()}catch(e){}});
    }
    if(typeof window.loadStats==='function'&&path.endsWith('profile.html'))try{window.loadStats()}catch(e){}
  }
  window.troothOpenChat=function(id){if(id)location.href='chat.html?user='+encodeURIComponent(id)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
