// Trooth Social Independent — Friends deep-link + mobile chat polish v1
(function(){
  if(window.__troothFriendsDeepLinkV1)return;window.__troothFriendsDeepLinkV1=true;
  function boot(){
    var qs=new URLSearchParams(location.search),chat=qs.get('chat');
    if(!chat)return;
    var tries=0;
    function open(){
      tries++;
      var input=document.getElementById('messageInput'),send=document.getElementById('sendBtn');
      var tabs=document.querySelectorAll('.tab');
      if(typeof window.selectFriend==='function'){
        try{window.selectFriend(chat);if(tabs[4]&&typeof window.showTab==='function')window.showTab('chat',tabs[4]);return}catch(e){}
      }
      if(tries<20)setTimeout(open,250);
    }
    open();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
