// Trooth Social Independent — Business Network UX v1
(function(){
 if(window.__troothBusinessUXV1)return;window.__troothBusinessUXV1=true;
 function boot(){
  var s=document.createElement('style');s.textContent='body{background:radial-gradient(circle at top,#effcf3 0,#f4faf6 42%,#edf7f0 100%)}header{box-shadow:0 6px 24px rgba(20,82,56,.13)}.biz{transition:.18s;box-shadow:0 4px 18px rgba(24,91,57,.06)}.biz:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(24,91,57,.11)}.biz .actions button{min-height:40px}.biz .actions a{display:inline-block}.modalbox{border:1px solid #dcebe1;box-shadow:0 20px 60px rgba(20,82,56,.2)}@media(max-width:600px){header{position:sticky;top:0}.nav{display:flex;gap:7px;overflow-x:auto;white-space:nowrap}.nav a{background:#f5fbf7;border:1px solid #dcebe2;border-radius:20px;padding:8px 10px;margin:0}.card{border-radius:18px}.bizbody{padding:14px}.biz .actions{display:grid;grid-template-columns:1fr 1fr}.biz .actions button{width:100%}.modal{padding:8px}.modalbox{max-height:94vh;padding:14px}}';document.head.appendChild(s);
  var search=document.getElementById('search');if(search)search.setAttribute('aria-label','Search businesses');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
