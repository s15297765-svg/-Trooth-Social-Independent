// Trooth Social Independent — profile completion polish v1
(function(){
  if(window.__troothProfileCompletionV1)return;
  window.__troothProfileCompletionV1=true;
  function clean(v){return String(v||'').trim()}
  function score(){
    var root=document.getElementById('app')||document.body;
    var text=(root.innerText||'').toLowerCase();
    var checks=[
      !!document.querySelector('img[alt*="avatar"],img[alt*="profile"],.avatar img,.profile-avatar img'),
      /bio|about|دربارہ|تعارف/.test(text),
      !!document.querySelector('#displayName,[name="displayName"],[data-profile-name]')
    ];
    return checks.filter(Boolean).length;
  }
  function apply(){
    if(!document.body)return;
    if(document.getElementById('trooth-profile-completion'))return;
    var app=document.getElementById('app')||document.body;
    var title=(app.innerText||'').toLowerCase();
    if(!/profile|پروفائل/.test(title))return;
    var n=score();
    if(n>=3)return;
    var card=document.createElement('section');
    card.id='trooth-profile-completion';
    card.setAttribute('role','status');
    card.style.cssText='margin:12px 0;padding:14px 16px;border:1px solid rgba(32,120,70,.16);border-radius:16px;background:linear-gradient(135deg,#f3fff7,#ffffff);box-shadow:0 6px 18px rgba(20,80,45,.07);font-family:inherit';
    card.innerHTML='<div style="font-weight:800;font-size:15px;color:#145c35">پروفائل مکمل کریں</div><div style="margin-top:5px;color:#47705a;font-size:13px;line-height:1.5">آپ کا پروفائل '+n+'/3 مکمل ہے۔ تصویر، نام اور تعارف شامل کرنے سے پروفائل زیادہ بہتر نظر آئے گا۔</div><button type="button" style="margin-top:10px;border:0;border-radius:10px;padding:9px 13px;background:#dff5e7;color:#145c35;font-weight:700;cursor:pointer">پروفائل مکمل کریں</button>';
    var btn=card.querySelector('button');
    btn.addEventListener('click',function(){
      var edit=[].slice.call(document.querySelectorAll('button,a')).find(function(el){return /edit profile|پروفائل ایڈٹ|پروفائل میں ترمیم/.test((el.textContent||'').trim().toLowerCase())});
      if(edit){edit.click();return}
      var input=document.querySelector('#displayName,[name="displayName"]');
      if(input){input.focus();input.scrollIntoView({behavior:'smooth',block:'center'})}
    });
    var anchor=app.firstElementChild;
    if(anchor)app.insertBefore(card,anchor);else app.appendChild(card);
  }
  function schedule(){setTimeout(apply,500);setTimeout(apply,1800)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  window.addEventListener('trooth-supabase-ready',schedule);
  window.addEventListener('trooth-module-loaded',schedule);
})();
