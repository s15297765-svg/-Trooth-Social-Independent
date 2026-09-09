/* Trooth temporary Email Auth bridge — keeps existing profile flow intact. */
(function(){
  const $ = id => document.getElementById(id);
  function patch(){
    const emailInput = $('phone');
    const pass = $('password');
    const name = $('displayName');
    const loginBtn = $('loginBtn');
    const signupBtn = $('signupBtn');
    if(!emailInput || !window.troothSupabase) return;
    const sb = window.troothSupabase;
    emailInput.type='email'; emailInput.name='email'; emailInput.inputMode='email'; emailInput.autocomplete='email'; emailInput.placeholder='Email address';
    if(pass){pass.style.display='';pass.type='password';pass.autocomplete='current-password';pass.placeholder='Password (6+ characters)';}
    const status=t=>{const e=$('authMsg');if(e)e.textContent=t;};
    async function refreshProfile(){
      try{
        const r=await sb.auth.getUser();
        if(r.error) throw r.error;
        if(r.data&&r.data.user){ location.reload(); return; }
        location.reload();
      }catch(e){ location.reload(); }
    }
    if(loginBtn){loginBtn.textContent='Login with Email';loginBtn.onclick=async function(){const email=emailInput.value.trim().toLowerCase(),password=(pass&&pass.value)||'';if(!email||!email.includes('@'))return status('براہِ کرم درست Email درج کریں۔');if(password.length<6)return status('Password کم از کم 6 حروف کا ہونا چاہیے۔');loginBtn.disabled=true;status('Email Login ہو رہا ہے…');try{const {error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;await refreshProfile();}catch(e){status(e.message||'Login ناکام ہوگیا۔');}finally{loginBtn.disabled=false;}};}
    if(signupBtn){signupBtn.textContent='Create Account with Email';signupBtn.onclick=async function(){const email=emailInput.value.trim().toLowerCase(),password=(pass&&pass.value)||'',displayName=(name&&name.value.trim())||'';if(!displayName)return status('براہِ کرم اپنا نام درج کریں۔');if(!email||!email.includes('@'))return status('براہِ کرم درست Email درج کریں۔');if(password.length<6)return status('Password کم از کم 6 حروف کا ہونا چاہیے۔');signupBtn.disabled=true;status('Email account بنایا جا رہا ہے…');try{const {data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:displayName}}});if(error)throw error;if(data.session){await refreshProfile();}else status('Account بن گیا ہے۔ Email confirmation مکمل کرکے پھر Login کریں۔');}catch(e){status(e.message||'Account نہیں بن سکا۔');}finally{signupBtn.disabled=false;}};}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else patch();
  setTimeout(patch,1200);setTimeout(patch,3000);
})();
