// Trooth Social Independent — mobile navigation polish v1
(function(){
 if(window.__troothMobileNavPolishV1)return;window.__troothMobileNavPolishV1=true;
 function boot(){
  var s=document.createElement('style');s.textContent='@media(max-width:760px){header,.header{position:sticky;top:0;z-index:20}.nav,.nav-links,.menu,.header nav{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;white-space:nowrap}.nav::-webkit-scrollbar,.nav-links::-webkit-scrollbar,.menu::-webkit-scrollbar,.header nav::-webkit-scrollbar{display:none}.nav a,.nav button,.nav-links a,.nav-links button{min-height:42px;padding:9px 11px}.container,main,.page{width:100%;box-sizing:border-box}.card{max-width:100%;box-sizing:border-box}}';document.head.appendChild(s);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
