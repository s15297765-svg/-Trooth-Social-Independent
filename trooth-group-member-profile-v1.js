// Trooth Social Independent — Group member profile bridge v1
(function(){
  if(window.__troothGroupMemberProfileV1)return;window.__troothGroupMemberProfileV1=true;
  function boot(){
    if(!location.pathname.toLowerCase().endsWith('group.html'))return;
    function enhance(){
      document.querySelectorAll('.member').forEach(function(member){
        if(member.__troothProfileAction)return;
        var remove=member.querySelector('.mini');
        var id='';
        if(remove){var m=(remove.getAttribute('onclick')||'').match(/removeMember\\?\\(\\?['\"]([^'\"]+)/);if(m)id=m[1]}
        if(!id)return;
        member.__troothProfileAction=true;
        var btn=document.createElement('button');btn.type='button';btn.className='mini';btn.textContent='👤 Profile';
        btn.onclick=function(e){e.stopPropagation();location.href='profile.html?id='+encodeURIComponent(id)};
        member.appendChild(btn);
      });
    }
    var observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});enhance();
    window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
