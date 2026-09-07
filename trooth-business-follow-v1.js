// Trooth Social Independent — Business Follow + Owner Contact v1
(function(){
 if(window.__troothBusinessFollowV1)return;window.__troothBusinessFollowV1=true;
 var sb=null,me=null;
 async function ready(){if(window.troothSupabase)return window.troothSupabase;return new Promise(function(r){window.addEventListener('trooth-supabase-ready',function(){r(window.troothSupabase)},{once:true})})}
 async function init(){sb=await ready();try{me=(await sb.auth.getUser()).data.user||null}catch(e){me=null}setTimeout(enhance,500)}
 async function state(id){if(!me)return {following:false,count:0};var r=await sb.from('business_followers').select('id,user_id').eq('business_id',id);var a=r.data||[];return {following:a.some(function(x){return x.user_id===me.id}),count:a.length}}
 async function follow(id,btn,countEl){if(!me){location.href='auth.html';return}btn.disabled=true;var st=await state(id);var r=st.following?await sb.from('business_followers').delete().eq('business_id',id).eq('user_id',me.id):await sb.from('business_followers').insert({business_id:id,user_id:me.id});btn.disabled=false;if(r.error){alert(r.error.message);return}await refreshButton(id,btn,countEl)}
 async function refreshButton(id,btn,countEl){var st=await state(id);btn.textContent=st.following?'✓ Following':'＋ Follow Business';if(countEl)countEl.textContent=st.count+' follower'+(st.count===1?'':'s')}
 function addToCard(x){var root=document.getElementById('i-'+x.id);if(!root||root.querySelector('.trooth-business-follow'))return;var row=document.createElement('div');row.className='trooth-business-follow';row.style.cssText='display:flex;gap:7px;align-items:center;margin-top:8px';row.innerHTML='<button type="button" class="bizFollowBtn">＋ Follow Business</button><span class="bizFollowerCount muted"></span><button type="button" class="bizMessageBtn">💬 Message Owner</button>';root.appendChild(row);var b=row.querySelector('.bizFollowBtn'),c=row.querySelector('.bizFollowerCount');b.onclick=function(){follow(x.id,b,c)};row.querySelector('.bizMessageBtn').onclick=function(){if(!me){location.href='auth.html';return}location.href='friends.html?chat='+encodeURIComponent(x.user_id)};refreshButton(x.id,b,c)}
 function enhance(){if(!window.rows||!Array.isArray(window.rows))return;window.rows.forEach(addToCard)}
 window.troothBusinessFollowEnhance=enhance;window.addEventListener('trooth-business-rendered',enhance);window.addEventListener('trooth-business-refresh',enhance);init();
})();
