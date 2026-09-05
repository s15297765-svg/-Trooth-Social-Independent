// Trooth Social Independent — Group member Follow bridge v1
(function(){
  if(window.__troothGroupMemberFollowV1)return;window.__troothGroupMemberFollowV1=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1700);}
  async function boot(){
    if(!location.pathname.toLowerCase().endsWith('group.html'))return;
    function enhance(){
      document.querySelectorAll('.member').forEach(function(member){
        if(member.__troothFollowAction)return;
        var remove=member.querySelector('.mini'),id='';
        if(remove){var m=(remove.getAttribute('onclick')||'').match(/removeMember\\?\\(\\?['\"]([^'\"]+)/);if(m)id=m[1]}
        if(!id||!window.troothSupabase)return;
        member.__troothFollowAction=true;
        var btn=document.createElement('button');btn.type='button';btn.className='mini';btn.textContent='＋ Follow';
        btn.onclick=async function(e){e.stopPropagation();var u=(await window.troothSupabase.auth.getUser()).data.user;if(!u){location.href='auth.html';return}if(u.id===id){toast('یہ آپ کا اپنا پروفائل ہے');return}var q=await window.troothSupabase.from('connections').select('following_id').eq('follower_id',u.id).eq('following_id',id).maybeSingle();if(q.data){var d=await window.troothSupabase.from('connections').delete().eq('follower_id',u.id).eq('following_id',id);if(!d.error){btn.textContent='＋ Follow';toast('Unfollow کر دیا گیا')}}else{var r=await window.troothSupabase.from('connections').insert({follower_id:u.id,following_id:id});if(!r.error){btn.textContent='✓ Following';toast('اب آپ Follow کر رہے ہیں')}}};
        member.appendChild(btn);
        (async function(){var u=(await window.troothSupabase.auth.getUser()).data.user;if(!u||u.id===id)return;var q=await window.troothSupabase.from('connections').select('following_id').eq('follower_id',u.id).eq('following_id',id).maybeSingle();if(q.data)btn.textContent='✓ Following'})();
      });
    }
    var observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});enhance();
    window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
