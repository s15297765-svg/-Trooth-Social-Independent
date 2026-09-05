// Trooth Social Independent — Groups + Messenger deep-link bridge v1
(function(){
  if(window.__troothGroupsMessengerConnectV1)return;window.__troothGroupsMessengerConnectV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1800);}
  function boot(){
    var path=location.pathname.toLowerCase();
    var params=new URLSearchParams(location.search);
    var user=params.get('user')||params.get('id');
    var group=params.get('group')||params.get('group_id');
    if(path.endsWith('friends.html')&&user){
      var tries=0,t=setInterval(function(){
        tries++;
        if(typeof window.selectFriend==='function'){
          clearInterval(t);
          try{
            var tabs=document.querySelectorAll('.tab');
            var chatTab=null;
            tabs.forEach(function(b){if((b.textContent||'').toLowerCase().indexOf('chat')>-1)chatTab=b});
            if(typeof window.showTab==='function'&&chatTab)window.showTab('chat',chatTab);
            window.selectFriend(user);
          }catch(e){}
        }
        if(tries>40)clearInterval(t);
      },250);
    }
    if(path.endsWith('groups.html')&&group){
      var gt=0,g=setInterval(function(){
        gt++;
        var el=document.querySelector('[onclick*="openGroup(\\\''+group+'\\\')"]');
        if(el){clearInterval(g);el.scrollIntoView({behavior:'smooth',block:'center'});el.focus&&el.focus();toast('👥 مطلوب Group کھولنے کے لیے تیار ہے');}
        if(gt>40)clearInterval(g);
      },250);
    }
    window.addEventListener('trooth-groups-refresh',function(){if(path.endsWith('groups.html'))toast('🔄 Groups تازہ ہو گئے ہیں')});
    window.addEventListener('trooth-friends-refresh',function(){if(path.endsWith('friends.html'))toast('🔄 Friends تازہ ہو گئے ہیں')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
