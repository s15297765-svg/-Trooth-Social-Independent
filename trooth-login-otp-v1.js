// Trooth login OTP bridge — keeps signup unchanged and switches Login to SMS OTP.
(function(){
  if(window.__troothLoginOtpV1)return;
  window.__troothLoginOtpV1=true;
  function phone(){return (document.getElementById('phone')?.value||'').trim()}
  function status(t){const e=document.getElementById('authMsg');if(e)e.textContent=t}
  function valid(v){return /^\+[1-9]\d{7,14}$/.test(v)}
  async function sendLoginOtp(){
    const sb=window.troothSupabase,tel=phone();
    if(!sb)return status('Trooth connection ابھی تیار نہیں۔ دوبارہ کوشش کریں۔');
    if(!valid(tel))return status('براہِ کرم درست فون نمبر دیں، مثال: +923001234567');
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
  window.sendLoginOtp=sendLoginOtp;
  function patch(){
    if(typeof window.showLogin!=='function')return false;
    if(window.__troothLoginOtpPatched)return true;
    const original=window.showLogin;
    window.showLogin=function(){
      original();
      const pass=document.getElementById('password');
      if(pass){pass.style.display='none';pass.value='';}
      const btn=document.getElementById('loginBtn');
      if(btn){btn.textContent='📱 Send OTP';btn.onclick=sendLoginOtp}
      const p=document.querySelector('#authMsg');
      if(p)p.textContent='Login کے لیے فون نمبر دیں؛ ہم SMS OTP بھیجیں گے۔';
    };
    window.__troothLoginOtpPatched=true;
    return true;
  }
  const timer=setInterval(()=>{if(patch())clearInterval(timer)},100);
  setTimeout(()=>clearInterval(timer),15000);
})();
