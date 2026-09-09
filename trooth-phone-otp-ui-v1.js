// Trooth Social Independent — phone-only OTP UI v1
(function(){
  if(window.__troothPhoneOtpUiV1)return;
  window.__troothPhoneOtpUiV1=true;
  function norm(v){v=(v||'').replace(/[()\s-]/g,'');if(/^03\d{9}$/.test(v))return '+92'+v.slice(1);if(/^3\d{9}$/.test(v))return '+92'+v;return v}
  function valid(v){return /^\+[1-9]\d{7,14}$/.test(v)}
  function sb(){return window.troothSupabase||null}
  function msg(t){var e=document.getElementById('authMsg');if(e)e.textContent=t||''}
  function install(){
    if(!location.pathname.endsWith('auth.html')||typeof window.showLogin!=='function')return;
    window.showLogin=function(){
      var app=document.getElementById('app');if(!app)return;
      app.innerHTML='<div class="card"><h2>Join Trooth 🌿</h2><p class="muted">صرف فون نمبر سے Trooth میں داخل ہوں۔ ای میل اور پاس ورڈ کی ضرورت نہیں۔</p><input id="displayName" placeholder="Your name (new profile)" autocomplete="name"><input id="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Phone number e.g. 03001234567" style="margin-top:10px"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn" id="otpBtn" onclick="troothSendPhoneOtp()">📱 Send OTP</button></div><p id="authMsg" class="muted"></p></div>';
    };
    var original=window.troothSendPhoneOtp;
    window.troothSendPhoneOtp=async function(){
      var s=sb();if(!s){msg('Trooth connection unavailable.');return}
      var phone=norm(document.getElementById('phone')?.value),name=(document.getElementById('displayName')?.value||'').trim();
      if(!valid(phone)){msg('درست فون نمبر درج کریں، مثلاً 03001234567');return}
      sessionStorage.setItem('trooth_pending_phone',phone);
      sessionStorage.setItem('trooth_pending_name',name);
      sessionStorage.setItem('trooth_login_mode','otp');
      var b=document.getElementById('otpBtn');if(b)b.disabled=true;msg('📱 OTP بھیجا جا رہا ہے…');
      try{
        var r=await s.auth.signInWithOtp({phone:phone,options:{data:name?{display_name:name}:undefined}});
        if(r.error)throw r.error;
        msg('📱 OTP آپ کے فون پر بھیج دیا گیا ہے۔');
        location.href='phone-verify.html';
      }catch(e){msg(e?.message||'OTP نہیں بھیجا جا سکا۔');if(b)b.disabled=false}
    };
    if(!document.getElementById('trooth-phone-otp-note')){
      var note=document.createElement('div');note.id='trooth-phone-otp-note';note.style.cssText='position:fixed;left:12px;right:12px;bottom:14px;z-index:9999;background:#d8f3dc;color:#173b29;border:1px solid #b7dfc5;border-radius:12px;padding:9px 12px;text-align:center;font:700 12px system-ui';note.textContent='Trooth Phone OTP • Email-free access';document.body.appendChild(note);setTimeout(function(){note.remove()},4500)
    }
  }
  var tries=0,t=setInterval(function(){install();if(++tries>20)clearInterval(t)},500);
  window.addEventListener('trooth-supabase-ready',install);
})();
