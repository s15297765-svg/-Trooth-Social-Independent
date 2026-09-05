// Trooth Social Independent — Group member Messenger bridge v1
(function(){
  if(window.__troothGroupMemberMessengerV1)return;window.__troothGroupMemberMessengerV1=true;
  function boot(){
    if(!location.pathname.toLowerCase().endsWith('group.html'))return;
    function enhance(){
      document.querySelectorAll('.member').forEach(function(member){
        if(member.__troothMessenger)return;member.__troothMessenger=true;
        var remove=member.querySelector('.mini');
        var id='';
        if(remove){var m=(remove.getAttribute('onclick')||'').match(/removeMember\\?\\(\\?['\"]([^'\"]+)/);if(m)id=m[1]}
        if(!id)return;
        var btn=document.createElement('button');btn.type='button';btn.className='mini';btn.textContent='💬 Message';
        btn.onclick=function(e){e.stopPropagation();location.href='chat.html?user='+encodeURIComponent(id)};
        member.appendChild(btn);
      });
    }
    var observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});
    enhance();
    window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
