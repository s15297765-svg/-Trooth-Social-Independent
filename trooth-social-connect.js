/* Trooth Social Independent — connect Profile, Friends, Following and Chat */
(function(){
  if(window.__troothSocialConnectV3)return;window.__troothSocialConnectV3=true;
  const path=location.pathname.toLowerCase();
  const params=new URLSearchParams(location.search);
  const target=params.get('user')||params.get('id');
  let refreshTimer=null,refreshBusy=false,refreshAgain=false;
  function boot(){
    if(!window.troothSupabase)return;
    ['trooth-friend-request','trooth-friend-request-sent','trooth-social-graph-refresh','trooth-friends-social-update','trooth-notifications-refresh'].forEach(function(ev){window.addEventListener(ev,scheduleRefresh)});
    if(target&&path.endsWith('chat.html')&&typeof window.select==='function')window.select(target);
    if(target&&path.endsWith('friends.html')&&typeof window.selectFriend==='function')window.selectFriend(target);
    scheduleRefresh();
  }
  function scheduleRefresh(){
    clearTimeout(refreshTimer);refreshTimer=setTimeout(refresh,140);
  }
  async function refresh(){
    if(refreshBusy){refreshAgain=true;return}
    refreshBusy=true;refreshAgain=false;
    try{
      if(path.endsWith('friends.html')){
        if(typeof window.loadSocial==='function')await window.loadSocial();
        if(typeof window.loadStats==='function')await window.loadStats();
        if(typeof window.renderPeople==='function'){
          var d=document.getElementById('discover');
          if(d&&d.classList.contains('active'))await window.renderPeople();
        }
      }
      if(path.endsWith('profile.html')&&typeof window.loadStats==='function')await window.loadStats();
    }catch(e){console.warn('Trooth social refresh:',e)}
    finally{refreshBusy=false;if(refreshAgain)scheduleRefresh()}
  }
  window.troothOpenChat=function(id){if(id)location.href='chat.html?user='+encodeURIComponent(id)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();