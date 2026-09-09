/* Trooth temporary Email Auth bridge — keeps existing UI/profile flow intact. */
(function(){
  const sb = window.sb;
  if(!sb) return;
  const $ = id => document.getElementById(id);
  function patch(){
    const phone = $('phone');
    const pass = $('password');
    const name = $('name');
    const loginBtn = $('loginBtn');
    const signupBtn = $('signupBtn');
    if(!phone) return;
    phone.type = 'email';
    phone.name = 'email';
    phone.inputMode = 'email';
    phone.autocomplete = 'email';
    phone.placeholder = 'Email address';
    if(pass){ pass.style.display=''; pass.type='password'; pass.placeholder='Password'; }
    if(loginBtn){
      loginBtn.textContent='Login with Email';
      loginBtn.onclick = async function(){
        const email=phone.value.trim().toLowerCase(), password=(pass&&pass.value)||'';
        if(!email || !email.includes('@')) return alert('براہِ کرم درست Email درج کریں۔');
        if(password.length < 6) return alert('Password کم از کم 6 حروف کا ہونا چاہیے۔');
        loginBtn.disabled=true;
        try{
          const {error}=await sb.auth.signInWithPassword({email,password});
          if(error) throw error;
          location.href='index.html';
        }catch(e){ alert(e.message || 'Login ناکام ہوگیا۔'); }
        finally{ loginBtn.disabled=false; }
      };
    }
    if(signupBtn){
      signupBtn.textContent='Create Account with Email';
      signupBtn.onclick = async function(){
        const email=phone.value.trim().toLowerCase(), password=(pass&&pass.value)||'', displayName=(name&&name.value.trim())||'';
        if(!displayName) return alert('براہِ کرم اپنا نام درج کریں۔');
        if(!email || !email.includes('@')) return alert('براہِ کرم درست Email درج کریں۔');
        if(password.length < 6) return alert('Password کم از کم 6 حروف کا ہونا چاہیے۔');
        signupBtn.disabled=true;
        try{
          const {data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:displayName}}});
          if(error) throw error;
          if(data.session){ location.href='index.html'; }
          else alert('Account بن گیا ہے۔ اگر Email confirmation آن ہے تو اپنے Email میں تصدیقی لنک کھولیں، پھر Login کریں۔');
        }catch(e){ alert(e.message || 'Account نہیں بن سکا۔'); }
        finally{ signupBtn.disabled=false; }
      };
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',patch); else patch();
  setTimeout(patch,700);
})();
