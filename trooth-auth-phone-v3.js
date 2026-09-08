// Trooth phone-first auth UX v3 — new profiles use phone + SMS OTP, no email/password form.
(function(){
  if(window.__troothPhoneAuthV3)return;
  window.__troothPhoneAuthV3=true;
  function phone(v){v=(v||'').replace(/[()\s-]/g,'');if(/^03\d{9}$/.test(v))v='+92'+v.slice(1);else if(/^3\d{9}$/.test(v))v='+92'+v;return v}
  function valid(v){return /^\+[1-9]\d{7,14}$/.test(v)}
  function ready(){
    if(!location.pathname.endsWith('/auth.html') && !location.pathname.endsWith('auth.html'))return;
    if(!window.troothSupabase)return setTimeout(ready,250);
    window.__troothOriginalShowLogin=window.showLogin;
    window.showLogin=function(){
      var app=document.getElementById('app');if(!app)return;
      app.innerHTML='<div class="card"><h2>Join Trooth 🌿</h2><p class="muted">نیا پروفائل بنانے یا Login کرنے کے لیے صرف فون نمبر استعمال کریں۔ ای میل کی ضرورت نہیں۔</p><input id="displayName" placeholder="Your name (new profile)" autocomplete="name"><input id="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="03XX XXXXXXX یا +92XXXXXXXXXX" style="margin-top:10px"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn" id="signupBtn" onclick="phoneSignup()">📱 Create Profile</button><button class="btn" id="loginBtn" onclick="phoneLogin()">🔐 Send Login Code</button></div><p id="authMsg" class="muted"></p></div>';
      var p=document.getElementById('phone');if(p)p.addEventListener('blur',function(){p.value=phone(p.value)});
    };
    window.phoneSignup=async function(){
      var name=(document.getElementById('displayName')?.value||'').trim(), tel=phone(document.getElementById('phone')?.value);
      var msg=document.getElementById('authMsg');if(!name||!valid(tel)){if(msg)msg.textContent='براہِ کرم نام اور درست فون نمبر درج کریں۔';return}
      var b=document.getElementById('signupBtn');if(b)b.disabled=true;if(msg)msg.textContent='Verification code بھیجا جا رہا ہے…';
      try{var r=await window.troothSupabase.auth.signInWithOtp({phone:tel,options:{shouldCreateUser:true,data:{display_name:name}}});if(r.error)throw r.error;sessionStorage.setItem('trooth_pending_phone',tel);sessionStorage.setItem('trooth_pending_name',name);if(msg)msg.textContent='SMS code بھیج دیا گیا۔';location.href='phone-verify.html';}
      catch(e){if(msg)msg.textContent=e?.message||'Account شروع نہیں ہو سکا۔';}finally{if(b)b.disabled=false}
    };
    window.phoneLogin=async function(){
      var tel=phone(document.getElementById('phone')?.value),msg=document.getElementById('authMsg');if(!valid(tel)){if(msg)msg.textContent='درست فون نمبر درج کریں۔';return}
      var b=document.getElementById('loginBtn');if(b)b.disabled=true;if(msg)msg.textContent='Login code بھیجا جا رہا ہے…';
      try{var r=await window.troothSupabase.auth.signInWithOtp({phone:tel,options:{shouldCreateUser:false}});if(r.error)throw r.error;sessionStorage.setItem('trooth_pending_phone',tel);sessionStorage.setItem('trooth_login_mode','1');if(msg)msg.textContent='SMS code بھیج دیا گیا۔';location.href='phone-verify.html';}
      catch(e){if(msg)msg.textContent=e?.message||'Login code نہیں بھیجا جا سکا۔';}finally{if(b)b.disabled=false}
    };
    setTimeout(function(){
      if(!window.user && document.getElementById('app')){
        var h=document.getElementById('app').innerText||'';
        if(h.indexOf('Welcome to Trooth')!==-1 || h.indexOf('Profile access needs login')!==-1)window.showLogin();
      }
    },1000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
