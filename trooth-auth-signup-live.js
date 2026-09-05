// Trooth — live email signup bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.troothAuthSignupLiveReady)return;
    window.troothAuthSignupLiveReady=true;
    var submitting=false;

    window.troothShowSignup=function(){
      var host=document.getElementById('app');if(!host)return;
      host.innerHTML='<div class="card"><h2>Create your Trooth account 🌿</h2><p class="muted">Join the independent social & business network.</p><input id="signupName" placeholder="Display name" autocomplete="name"><input id="signupEmail" type="email" placeholder="Email" autocomplete="email" style="margin-top:10px"><input id="signupPassword" type="password" placeholder="Password (at least 6 characters)" autocomplete="new-password" style="margin-top:10px"><button id="troothSignupBtn" class="btn" style="margin-top:12px" type="button">Create Account</button><button id="troothBackLogin" class="btn" style="margin:12px 0 0 8px" type="button">Back to Login</button><div id="troothSignupStatus" class="muted" style="margin-top:10px"></div></div>';
      var btn=document.getElementById('troothSignupBtn');
      if(btn)btn.onclick=window.troothSignup;
      var back=document.getElementById('troothBackLogin');
      if(back)back.onclick=window.showLogin;
      var pass=document.getElementById('signupPassword');
      if(pass)pass.addEventListener('keydown',function(e){if(e.key==='Enter')window.troothSignup()});
    };

    window.troothSignup=async function(){
      if(submitting)return;
      var name=(document.getElementById('signupName')||{}).value?.trim()||'';
      var email=(document.getElementById('signupEmail')||{}).value?.trim()||'';
      var password=(document.getElementById('signupPassword')||{}).value||'';
      var btn=document.getElementById('troothSignupBtn');
      var status=document.getElementById('troothSignupStatus');
      if(!email||!password){if(status)status.textContent='Please enter email and password.';return;}
      if(password.length<6){if(status)status.textContent='Password must be at least 6 characters.';return;}
      submitting=true;
      if(btn){btn.disabled=true;btn.textContent='Creating account…'}
      if(status)status.textContent='Creating your Trooth account…';
      try{
        var r=await sb.auth.signUp({email:email,password:password,options:{data:{display_name:name||email.split('@')[0]}}});
        if(r.error)throw r.error;
        if(r.data&&r.data.session){
          window.user=r.data.user;
          if(typeof window.ensureProfile==='function')await window.ensureProfile();
          if(typeof window.loadData==='function')await window.loadData();
          if(typeof window.renderProfile==='function')window.renderProfile();
          return;
        }
        if(status)status.textContent='Account created. Please check your email to confirm, then log in.';
        setTimeout(function(){if(typeof window.showLogin==='function')window.showLogin()},900);
      }catch(e){
        if(status)status.textContent=e&&e.message?e.message:'Unable to create account.';
        if(btn){btn.disabled=false;btn.textContent='Create Account'}
      }finally{submitting=false}
    };

    function enhance(){
      if(typeof window.showLogin!=='function'||window.showLogin.__troothEnhanced)return;
      var original=window.showLogin;
      function wrapped(){
        original();
        var host=document.getElementById('app');if(!host)return;
        var card=host.querySelector('.card');if(!card||card.querySelector('[data-trooth-signup]'))return;
        var b=document.createElement('button');b.className='btn';b.style.marginTop='10px';b.textContent='🌿 Create New Account';b.setAttribute('data-trooth-signup','1');b.onclick=window.troothShowSignup;card.appendChild(b);
      }
      wrapped.__troothEnhanced=true;
      window.showLogin=wrapped;
    }
    setTimeout(enhance,0);setTimeout(enhance,300);setTimeout(enhance,900);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
