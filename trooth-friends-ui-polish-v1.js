// Trooth Social Independent — Friends UI polish v1
(function(){
 if(window.__troothFriendsUIPolishV1)return;window.__troothFriendsUIPolishV1=true;
 function boot(){
  var s=document.createElement('style');s.textContent='.trooth-mobile-action{min-height:42px!important}.person button,.composer button{touch-action:manipulation}.chatPeople{scrollbar-width:thin}@media(max-width:760px){.person{padding:15px 12px}.person .info{min-width:calc(100% - 62px)}.person button{flex:1;min-width:105px}.chatBox{padding:8px}.messages{height:45vh;min-height:260px}.chatHead{position:sticky;top:0;z-index:2}.tabs{position:sticky;top:56px;z-index:3;background:#fff;padding:8px;border-radius:12px}.tab{flex:1;min-width:82px}.profileActions .btn{flex:1}}';document.head.appendChild(s);
  document.querySelectorAll('.person button,.composer button').forEach(function(x){x.classList.add('trooth-mobile-action')});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
