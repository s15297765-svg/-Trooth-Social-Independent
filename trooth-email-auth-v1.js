/* Trooth Social Independent — legacy email bridge disabled. Native phone authentication is authoritative. */
(function(){
  if(window.__troothEmailAuthDisabled)return;
  window.__troothEmailAuthDisabled=true;

  function phoneOk(v){return /^\+[1-9]\d{7,14}$/.test(v||'')}

  async function otpLogin(){
    var phone=document.getElementById('phone')?.value.trim();
    var msg=document.getElementById('authMsg');
    var btn=document.getElementById('troothOtpLoginBtn');
    if(!phoneOk(phone)){
      if(msg)msg.textContent='SMS OTP کے لیے درست فون نمبر درج کریں، مثال: +923001234567';
      return;
    }
    if(btn)btn.disabled=true;
    if(msg)msg.textContent='Login OTP بھیجا جا رہا ہے…';
    try{
      var client=window.troothSupabase;
      if(!client)throw new Error('Trooth connection ابھی تیار نہیں۔ دوبارہ کوشش کریں۔');
      var r=await client.auth.signInWithOtp({phone:phone,options:{shouldCreateUser:false}});
      if(r.error)throw r.error;
      sessionStorage.setItem('trooth_pending_phone',phone);
      sessionStorage.setItem('trooth_login_mode','1');
      sessionStorage.removeItem('trooth_pending_name');
      location.href='phone-verify.html';
    }catch(e){
      if(msg)msg.textContent=e?.message||'Login OTP نہیں بھیجا جا سکا۔';
    }finally{
      if(btn)btn.disabled=false;
    }
  }

  function addOtpButton(){
    if(document.getElementById('troothOtpLoginBtn'))return true;
    var login=document.getElementById('loginBtn');
    if(!login)return false;
    var b=document.createElement('button');
    b.className='btn';
    b.id='troothOtpLoginBtn';
    b.type='button';
    b.textContent='📱 Login with SMS OTP';
    b.style.marginTop='8px';
    b.onclick=otpLogin;
    login.parentNode.appendChild(b);
    return true;
  }

  window.addEventListener('load',function(){
    var tries=0;
    var timer=setInterval(function(){
      if(addOtpButton()||++tries>30)clearInterval(timer);
    },250);
  });
})();
