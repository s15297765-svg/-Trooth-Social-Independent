/* Trooth temporary Email Auth bridge — robustly patches the dynamically opened login form. */
(function(){
  if(window.__troothEmailAuthV2)return;
  window.__troothEmailAuthV2=true;
  const $=id=>document.getElementById(id);
  let bound=false;
  function patch(){
    const emailInput=$('phone'), pass=$('password'), name=$('displayName'), loginBtn=$('loginBtn'), signupBtn=$('signupBtn');
    if(!emailInput||!window.troothSupabase)return false;
    const sb=window.troothSupabase;
    emailInput.type='email'; emailInput.name='email'; emailInput.inputMode='email'; emailInput.autocomplete='email'; emailInput.placeholder='Email address';
    if(pass){pass.style.display='';pass.type='password';pass.autocomplete='current-password';pass.placeholder='Password (6+ characters)';}
    const status=t=>{const e=$('authMsg');if(e)e.textContent=t;};
    async function refreshProfile(){location.reload();}
    if(loginBtn&&!loginBtn.dataset.troothEmailBound){
      loginBtn.dataset.troothEmailBound='1'; loginBtn.textContent='Login with Email'; loginBtn.removeAttribute('onclick');
      loginBtn.addEventListener('click',async function(e){e.preventDefault();const email=emailInput.value.trim().toLowerCase(),password=(pass&&pass.value)||'';if(!email||!email.includes('@'))return status('براہِ کرم درست Email درج کریں۔');if(password.length<6)return status('Password کم از کم 6 حروف کا ہونا چاہیے۔');loginBtn.disabled=true;status('Email Login ہو رہا ہے…');try{const {error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;await refreshProfile();}catch(err){status(err.message||'Login ناکام ہوگیا۔');}finally{loginBtn.disabled=false;}},{capture:true});
    }
    if(signupBtn&&!signupBtn.dataset.troothEmailBound){
      signupBtn.dataset.troothEmailBound='1'; signupBtn.textContent='Create Account with Email'; signupBtn.removeAttribute('onclick');
      signupBtn.addEventListener('click',async function(e){e.preventDefault();const email=emailInput.value.trim().toLowerCase(),password=(pass&&pass.value)||'',displayName=(name&&name.value.trim())||'';if(!displayName)return status('براہِ کرم اپنا نام درج کریں۔');if(!email||!email.includes('@'))return status('براہِ کرم درست Email درج کریں۔');if(password.length<6)return status('Password کم از کم 6 حروف کا ہونا چاہیے۔');signupBtn.disabled=true;status('Email account بنایا جا رہا ہے…');try{const {data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:displayName}}});if(error)throw error;if(data.session){await refreshProfile();}else status('Account بن گیا ہے۔ Email confirmation مکمل کرکے پھر Login کریں۔');}catch(err){status(err.message||'Account نہیں بن سکا۔');}finally{signupBtn.disabled=false;}},{capture:true});
    }
    bound=true; return true;
  }
  function boot(){patch();const obs=new MutationObserver(()=>{if(patch()&&bound){} });obs.observe(document.documentElement,{childList:true,subtree:true});setTimeout(patch,500);setTimeout(patch,1500);setTimeout(patch,3000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
