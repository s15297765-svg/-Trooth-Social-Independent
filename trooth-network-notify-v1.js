// Trooth Social Independent — network activity toast + refresh bridge v1
(function(){
  if(window.__troothNetworkNotifyV1)return;window.__troothNetworkNotifyV1=true;
  function toast(msg){
    var t=document.getElementById('trooth-network-toast');
    if(!t){t=document.createElement('div');t.id='trooth-network-toast';t.style.cssText='position:fixed;right:16px;bottom:76px;z-index:99999;background:#fff;border:1px solid #bfe8cf;color:#155c39;padding:11px 15px;border-radius:14px;box-shadow:0 8px 26px rgba(0,0,0,.14);font:600 13px system-ui;max-width:290px';document.body.appendChild(t)}
    t.textContent=msg;t.style.display='block';clearTimeout(t.__hide);t.__hide=setTimeout(function(){t.style.display='none'},2200);
  }
  function boot(){
    window.addEventListener('trooth-network-activity',function(e){
      var d=e.detail||{},k=d.kind||'';
      if(k==='friend_request')toast('🤝 Friends میں نئی activity ہوئی ہے');
      else if(k==='group_member')toast('👥 Group membership update ہوئی ہے');
      else if(k==='group_join_request')toast('📨 Group join request update ہوئی ہے');
      else if(k==='group_announcement')toast('📢 Group میں نئی announcement ہے');
      if(window.refreshTroothHeaderBadges)window.refreshTroothHeaderBadges();
    });
    window.addEventListener('trooth-friends-refresh',function(){document.dispatchEvent(new CustomEvent('trooth-network-refresh',{detail:{area:'friends'}}))});
    window.addEventListener('trooth-groups-refresh',function(){document.dispatchEvent(new CustomEvent('trooth-network-refresh',{detail:{area:'groups'}}))});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
