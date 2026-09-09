// Trooth Social Independent — owner-only SMS OTP login
(function(){
  if(window.__troothLoginOtpV2)return;
  window.__troothLoginOtpV2=true;
  var OWNER_PHONE='+923442726322';
  function phone(){return (document.getElementById('phone')?.value||'').trim()}
  function status(t){const e=document.getElementById('authMsg');if(e)e.textContent=t}
  function valid(v){return /^\+[1-9]\d{7,14}$/.test(v)}
  function isOwner(){return phone()===OWNER_PHONE}
  async function sendLoginOtp(){
    const sb=window.troothSupabase,tel=phone();
    if(!isOwner())return status('عام users کے لیے Login پاس ورڈ سے ہوگا۔');
    if(!sb)return status('Trooth connection ابھی تیار نہیں۔ دوبارہ کوشش کریں۔');
    if(!valid(tel))return status('براہِ کرم درست فون نمبر دیں۔');
    const b=document.getElementById('loginBtn');if(b)b.disabled=true;
    status('OTP بھیجا جا رہا ہے…');
    try{
      const r=await sb.auth.signInWithOtp({phone:tel,options:{shouldCreateUser:false}});
      if(r.error)throw r.error;
      sessionStorage.setItem('trooth_pending_phone',tel);
      sessionStorage.setItem('trooth_login_mode','1');
      sessionStorage.removeItem('trooth_pending_name');
      status('6 ہندسوں کا OTP SMS کر دیا گیا ہے۔');
      setTimeout(()=>location.href='phone-verify.html',350);
    }catch(e){status(e?.message||'OTP نہیں بھیجا جا سکا۔');if(b)b.disabled=false}
  }
  function restoreNormal(){
    const pass=document.getElementById('password');
    const btn=document.getElementById('loginBtn');
    if(pass)pass.style.display='block';
    if(btn){btn.textContent='Login';btn.onclick=window.login}
    const p=document.getElementById('authMsg');
    if(p)p.textContent='فون نمبر اور پاس ورڈ سے Login کریں۔';
  }
  function apply(){
    if(typeof window.showLogin!=='function')return false;
    const original=window.showLogin;
    if(original.__troothOwnerOtpWrapped)return true;
    const wrapped=function(){
      original();
      const pass=document.getElementById('password');
      const btn=document.getElementById('loginBtn');
      const input=document.getElementById('phone');
      if(!input)return;
      function sync(){
        if(isOwner()){
          if(pass)pass.style.display='none';
          if(btn){btn.textContent='📱 Send OTP';btn.onclick=sendLoginOtp}
          status('Owner Login: SMS OTP استعمال کریں۔');
        }else restoreNormal();
      }
      input.addEventListener('input',sync);
      sync();
    };
    wrapped.__troothOwnerOtpWrapped=true;
    window.showLogin=wrapped;
    return true;
  }
  const timer=setInterval(()=>{if(apply())clearInterval(timer)},100);
  setTimeout(()=>clearInterval(timer),15000);
})();