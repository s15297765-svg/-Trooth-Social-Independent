// Trooth Social Independent — phone OTP auth bridge v1
(function(){
  if(window.__troothPhoneAuthV1)return;
  window.__troothPhoneAuthV1=true;
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn()}
  function sb(){return window.troothSupabase||null}
  function norm(v){v=(v||'').replace(/[()\s-]/g,'');if(/^03\d{9}$/.test(v))return '+92'+v.slice(1);if(/^3\d{9}$/.test(v))return '+92'+v;return v}
  function msg(t){var e=document.getElementById('authMsg');if(e)e.textContent=t||''}
  function wait(){return new Promise(function(resolve){if(sb())return resolve(sb());var done=false;function f(){if(done)return;done=true;resolve(sb())}window.addEventListener('trooth-supabase-ready',f,{once:true});setTimeout(f,9000)})}
  ready(function(){
    window.troothSendPhoneOtp=async function(){var s=await wait();if(!s)return msg('Trooth connection unavailable.');var p=norm(document.getElementById('phone')?.value);if(!/^\+[1-9]\d{7,14}$/.test(p))return msg('درست فون نمبر درج کریں، مثلاً 03001234567');sessionStorage.setItem('trooth_pending_phone',p);var r=await s.auth.signInWithOtp({phone:p});if(r.error)return msg(r.error.message||'OTP نہیں بھیجا جا سکا۔');msg('📱 OTP آپ کے فون پر بھیج دیا گیا ہے۔');location.href='phone-verify.html'};
    window.troothVerifyPhoneOtp=async function(){var s=await wait();if(!s)return msg('Trooth connection unavailable.');var p=norm(sessionStorage.getItem('trooth_pending_phone')||''),token=(document.getElementById('otp')?.value||'').replace(/\D/g,'');if(!p||token.length!==6)return msg('6 ہندسوں کا OTP درج کریں۔');var r=await s.auth.verifyOtp({phone:p,token:token,type:'sms'});if(r.error)return msg(r.error.message||'OTP درست نہیں ہے۔');var u=r.data?.user;if(u){var name=sessionStorage.getItem('trooth_pending_name')||u.user_metadata?.display_name||u.phone||'Trooth User';var q=await s.from('profiles').select('id').eq('id',u.id).maybeSingle();if(!q.data){await s.from('profiles').insert({id:u.id,display_name:name,bio:''})}}sessionStorage.removeItem('trooth_pending_phone');sessionStorage.removeItem('trooth_pending_name');location.href='auth.html'};
  });
})();
