// Trooth Social Independent — Group member social actions v2
(function(){
  if(window.__troothGroupMemberFollowV2)return;window.__troothGroupMemberFollowV2=true;
  function toast(msg){if(window.troothLiveToast)window.troothLiveToast(msg,1700);}
  async function boot(){
    if(!location.pathname.toLowerCase().endsWith('group.html')||!window.troothSupabase)return;
    var groupId=new URLSearchParams(location.search).get('id');if(!groupId)return;
    async function mapIds(){
      var r=await window.troothSupabase.from('group_members').select('user_id').eq('group_id',groupId);
      var rows=r.data||[],members=[...document.querySelectorAll('.member')];
      members.forEach(function(m,i){if(rows[i]&&!m.dataset.userId)m.dataset.userId=rows[i].user_id});
      enhance();
    }
    async function enhance(){
      var u=(await window.troothSupabase.auth.getUser()).data.user;
      document.querySelectorAll('.member').forEach(function(member){
        var id=member.dataset.userId;if(!id||member.dataset.troothSocialActions)return;
        if(u&&u.id===id){member.dataset.troothSocialActions='self';return}
        member.dataset.troothSocialActions='1';
        function add(text,fn,mark){if(member.querySelector('[data-trooth-member-action="'+mark+'"]'))return;var b=document.createElement('button');b.type='button';b.className='mini';b.textContent=text;b.dataset.troothMemberAction=mark;b.onclick=function(e){e.stopPropagation();fn(b,id)};member.appendChild(b);}
        add('👤 Profile',function(b,target){location.href='profile.html?id='+encodeURIComponent(target)},'profile');
        add('💬 Message',function(b,target){location.href='chat.html?user='+encodeURIComponent(target)},'message');
        add('＋ Follow',async function(b,target){var q=await window.troothSupabase.from('connections').select('following_id').eq('follower_id',u.id).eq('following_id',target).maybeSingle();if(q.data){var d=await window.troothSupabase.from('connections').delete().eq('follower_id',u.id).eq('following_id',target);if(!d.error){b.textContent='＋ Follow';toast('Unfollow کر دیا گیا')}}else{var r=await window.troothSupabase.from('connections').insert({follower_id:u.id,following_id:target});if(!r.error){b.textContent='✓ Following';toast('اب آپ Follow کر رہے ہیں')}}},'follow');
        (async function(){var q=await window.troothSupabase.from('connections').select('following_id').eq('follower_id',u.id).eq('following_id',id).maybeSingle();if(q.data){var b=member.querySelector('[data-trooth-member-action="follow"]');if(b)b.textContent='✓ Following'}})();
      });
    }
    var observer=new MutationObserver(function(){mapIds()});observer.observe(document.body,{childList:true,subtree:true});
    await mapIds();window.addEventListener('beforeunload',function(){observer.disconnect()},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
