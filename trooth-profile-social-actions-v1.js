// Trooth Social Independent — public profile social actions v2
(function(){
  if(window.__troothProfileSocialActionsV2)return;
  window.__troothProfileSocialActionsV2=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    if(path!=='profile.html'&&path!=='auth.html')return;
    var qs=new URLSearchParams(location.search),target=qs.get('user')||qs.get('profile');
    if(!target)return;
    var sb=window.troothSupabase;if(!sb)return;
    sb.auth.getUser().then(function(r){
      var me=r&&r.data&&r.data.user;if(!me||me.id===target)return;
      var root=document.querySelector('main')||document.body;
      var old=document.getElementById('trooth-public-actions');if(old)old.remove();
      var box=document.createElement('div');box.id='trooth-public-actions';
      box.innerHTML='<button id="troothFollowBtn" type="button">Follow</button><button id="troothFriendBtn" type="button">Add Friend</button><a id="troothMsgBtn" href="chat.html?user='+encodeURIComponent(target)+'">Message</a>';
      root.insertBefore(box,root.firstChild);
      if(!document.getElementById('trooth-public-actions-style')){var style=document.createElement('style');style.id='trooth-public-actions-style';style.textContent='#trooth-public-actions{display:flex;gap:8px;flex-wrap:wrap;padding:10px;margin:10px 0;background:#f4fff8;border:1px solid #cfeedd;border-radius:14px}#trooth-public-actions button,#trooth-public-actions a{border:0;border-radius:10px;padding:9px 14px;background:#b9efcf;color:#145c35;font-weight:700;text-decoration:none;cursor:pointer}#trooth-public-actions button:disabled{opacity:.6;cursor:wait}#trooth-public-actions button[data-on="1"]{background:#e5f7ec}';document.head.appendChild(style)}
      var follow=document.getElementById('troothFollowBtn'),friend=document.getElementById('troothFriendBtn');
      async function refresh(){
        var q=await sb.from('connections').select('follower_id,following_id').or('and(follower_id.eq.'+me.id+',following_id.eq.'+target+'),and(follower_id.eq.'+target+',following_id.eq.'+me.id+')');
        var rows=q.data||[],following=rows.some(function(v){return v.follower_id===me.id&&v.following_id===target});
        follow.textContent=following?'Following':'Follow';follow.dataset.on=following?'1':'0';
        var fr=await sb.from('friend_requests').select('id,status,sender_id,receiver_id').or('and(sender_id.eq.'+me.id+',receiver_id.eq.'+target+'),and(sender_id.eq.'+target+',receiver_id.eq.'+me.id+')').order('created_at',{ascending:false}).limit(1);
        var f=(fr.data||[])[0];
        friend.textContent=f?(f.status==='accepted'?'Friends':(f.sender_id===me.id?'Request Sent':'Respond')):'Add Friend';
        friend.dataset.on=f&&f.status==='accepted'?'1':'0';
      }
      follow.onclick=async function(){if(follow.disabled)return;follow.disabled=true;try{var q=await sb.from('connections').select('follower_id').eq('follower_id',me.id).eq('following_id',target).maybeSingle();var r=q.data?await sb.from('connections').delete().eq('follower_id',me.id).eq('following_id',target):await sb.from('connections').insert({follower_id:me.id,following_id:target});if(r.error)alert(r.error.message);else{window.dispatchEvent(new CustomEvent('trooth-network-ui-refresh'));await refresh()}}finally{follow.disabled=false}};
      friend.onclick=async function(){if(friend.disabled)return;friend.disabled=true;try{var q=await sb.from('friend_requests').select('id,status,sender_id,receiver_id').or('and(sender_id.eq.'+me.id+',receiver_id.eq.'+target+'),and(sender_id.eq.'+target+',receiver_id.eq.'+me.id+')').order('created_at',{ascending:false}).limit(1);var f=(q.data||[])[0];if(f&&f.status==='accepted'){return}if(f&&f.sender_id===target&&f.status==='pending'){friend.textContent='Respond';return}var r=await sb.from('friend_requests').insert({sender_id:me.id,receiver_id:target,status:'pending'});if(r.error)alert(r.error.message);else{friend.textContent='Request Sent';window.dispatchEvent(new CustomEvent('trooth-network-ui-refresh'));await refresh()}}finally{friend.disabled=false}};
      refresh();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();