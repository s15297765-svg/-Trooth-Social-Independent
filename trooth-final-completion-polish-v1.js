// Trooth Social Independent — final completion polish v2
(function(){
  if(window.__troothFinalCompletionPolishV2)return;window.__troothFinalCompletionPolishV2=true;
  function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 16px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003';document.body.appendChild(t);setTimeout(function(){t.remove()},1800)}
  function postId(card){return card&& (card.getAttribute('data-post-id')||card.getAttribute('data-post')||'')}
  function profileAccess(){
    var logged=!!window.user;
    document.querySelectorAll('a[href="auth.html"]').forEach(function(a){a.textContent=logged?'👤 My Profile':'👤 Login / Create Profile';});
    var hero=document.querySelector('.hero');
    if(hero&&!hero.querySelector('[data-trooth-profile-access]')){var a=document.createElement('a');a.href='auth.html';a.setAttribute('data-trooth-profile-access','1');a.textContent=logged?'👤 My Profile':'👤 Login / Create Profile';a.style.cssText='display:inline-block;margin-top:10px;padding:10px 14px;border-radius:10px;background:#40916c;color:#fff;text-decoration:none;font-weight:800';hero.appendChild(a)}
  }
  function feedActions(){
    document.querySelectorAll('.post').forEach(function(card){
      var id=postId(card);if(!id)return;
      var bar=card.querySelector('.post-actions,.postActions,.postactions');if(!bar)return;
      if(!bar.querySelector('[data-trooth-final-save]')){
        var b=document.createElement('button');b.type='button';b.setAttribute('data-trooth-final-save','1');b.textContent='🔖 Save';b.onclick=function(){if(window.troothSavePost)window.troothSavePost(id);else toast('Save is loading…')};bar.appendChild(b);
      }
      if(!card.querySelector('.trooth-final-comment')){
        var box=document.createElement('div');box.className='trooth-final-comment';box.style.cssText='display:flex;gap:8px;margin-top:8px';box.innerHTML='<input maxlength="1000" placeholder="Write a comment…"><button type="button">Comment</button>';var input=box.querySelector('input'),btn=box.querySelector('button');var submit=function(){var body=input.value.trim(),sb=window.troothSupabase,u=window.user;if(!body)return;if(!u){location.href='auth.html';return}btn.disabled=true;sb.from('comments').insert({post_id:id,user_id:u.id,body:body}).then(function(r){if(r.error)toast(r.error.message||'Comment failed');else{input.value='';toast('💬 Comment saved');window.dispatchEvent(new CustomEvent('trooth-comment-added',{detail:{postId:id}}))}}).finally(function(){btn.disabled=false})};btn.onclick=submit;input.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();submit()}};card.appendChild(box)}
    });
  }
  function polish(){
    document.documentElement.style.scrollBehavior='smooth';
    profileAccess();feedActions();
    document.querySelectorAll('button').forEach(function(b){if(!b.getAttribute('aria-label')){var t=(b.textContent||'').trim().replace(/\s+/g,' ');if(t)b.setAttribute('aria-label',t)}});
    document.querySelectorAll('input,textarea').forEach(function(el){if(!el.getAttribute('aria-label')&&el.placeholder)el.setAttribute('aria-label',el.placeholder)});
    document.querySelectorAll('img').forEach(function(img){if(!img.alt)img.alt='Trooth image'});
  }
  function boot(){polish();var mo=new MutationObserver(function(){polish()});mo.observe(document.body,{childList:true,subtree:true});window.addEventListener('trooth-profile-updated',polish);window.addEventListener('trooth-auth-profile-ready',polish);window.addEventListener('trooth-supabase-ready',function(){setTimeout(polish,100)});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
