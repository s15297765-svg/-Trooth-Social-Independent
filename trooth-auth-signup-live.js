// Trooth — live email signup bridge
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb)return;
    window.troothShowSignup=function(){
      var host=document.getElementById('app');if(!host)return;
      host.innerHTML='<div class="card"><h2>Create your Trooth account 🌿</h2><p class="muted">Join the independent social & business network.</p><input id="signupName" placeholder="Display name"><input id="signupEmail" type="email" placeholder="Email" style="margin-top:10px"><input id="signupPassword" type="password" placeholder="Password (at least 6 characters)" style="margin-top:10px"><button class="btn" style="margin-top:12px" onclick="troothSignup()">Create Account</button><button class="btn" style="margin:12px 0 0 8px" onclick="showLogin()">Back to Login</button></div>';
    };
    window.troothSignup=async function(){
      var name=(document.getElementById('signupName')||{}).value?.trim()||'';
      var email=(document.getElementById('signupEmail')||{}).value?.trim()||'';
      var password=(document.getElementById('signupPassword')||{}).value||'';
      if(!email||!password)return alert('Please enter email and password.');
      if(password.length<6)return alert('Password must be at least 6 characters.');
      var r=await sb.auth.signUp({email:email,password:password,options:{data:{display_name:name||email.split('@')[0]}}});
      if(r.error)return alert(r.error.message);
      if(r.data&&r.data.session){
        user=r.data.user;await ensureProfile();await loadData();renderProfile();
      }else{
        alert('Account created. Please check your email to confirm your account, then log in.');
        showLogin();
      }
    };
    var oldShowLogin=window.showLogin;
    function enhance(){
      if(typeof window.showLogin!=='function'||window.showLogin.__troothEnhanced)return;
      var original=window.showLogin;
      function wrapped(){original();var host=document.getElementById('app');if(!host)return;var card=host.querySelector('.card');if(!card)return;var b=document.createElement('button');b.className='btn';b.style.marginTop='10px';b.textContent='🌿 Create New Account';b.onclick=window.troothShowSignup;card.appendChild(b);}
      wrapped.__troothEnhanced=true;window.showLogin=wrapped;
    }
    setTimeout(enhance,0);setTimeout(enhance,300);
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
