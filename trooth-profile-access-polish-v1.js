// Trooth Social Independent — profile access polish v1
(function(){
  if(window.__troothProfileAccessPolishV1)return;window.__troothProfileAccessPolishV1=true;
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    function style(){
      if(document.getElementById('trooth-profile-access-polish-v1'))return;
      var s=document.createElement('style');s.id='trooth-profile-access-polish-v1';s.textContent=`
        body.trooth-reference-home .profile-access-card{cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
        body.trooth-reference-home .profile-access-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(30,105,66,.08);background:#f5fcf7}
        body.trooth-reference-home .profile-access-card:focus-visible{outline:3px solid #b9e9ca;outline-offset:2px}
      `;document.head.appendChild(s);
    }
    function wire(){
      var mini=document.querySelector('.menu .mini');
      var navs=document.querySelectorAll('.menu .nav');
      var profileNav=null;
      Array.prototype.forEach.call(navs,function(a){if((a.getAttribute('href')||'')==='auth.html')profileNav=a});
      if(mini){mini.classList.add('profile-access-card');mini.setAttribute('role','link');mini.setAttribute('tabindex','0');mini.onclick=function(){location.href='auth.html'};mini.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();location.href='auth.html'}}}
      sb.auth.getUser().then(function(r){
        var logged=!!(r&&r.data&&r.data.user);
        if(profileNav)profileNav.textContent=logged?'👤 My Profile':'👤 Profile / Login';
      }).catch(function(){if(profileNav)profileNav.textContent='👤 Profile / Login'});
    }
    style();wire();
    window.addEventListener('trooth-auth-changed',wire);
    window.addEventListener('trooth-profile-identity-synced',wire);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
