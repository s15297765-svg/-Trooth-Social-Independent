// Trooth Social Independent — public profile social actions v1
(function(){
  if(window.__troothProfileSocialActionsV1)return;
  window.__troothProfileSocialActionsV1=true;
  function boot(){
    var path=(location.pathname||'').split('/').pop().toLowerCase();
    if(path!=='profile.html'&&path!=='auth.html')return;
    var qs=new URLSearchParams(location.search),target=qs.get('user')||qs.get('profile');
    if(!target)return;
    var sb=window.troothSupabase;if(!sb)return;
    sb.auth.getUser().then(function(r){
      var me=r&&r.data&&r.data.user;if(!me||me.id===target)return;
      var root=document.querySelector('main')||document.body;
      var box=document.createElement('div');box.id='trooth-public-actions';
      box.innerHTML='<button id="troothFollowBtn" type="button">Follow</button><button id="troothFriendBtn" type="button">Add Friend</button><a id="troothMsgBtn" href="chat.html?user='+encodeURIComponent(target)+'">Message</a>';
      var old=document.getElementById('trooth-public-actions');if(old)old.remove();
      root.insertBefore(box,root.firstChild);
      var style=document.createElement('style');style.textContent='#trooth-public-actions{display:flex;gap:8px;flex-wrap:wrap;padding:10px;margin:10px 0;background:#f4fff8;border:1px solid #cfeedd;border-radius:14px}#trooth-public-actions button,#trooth-public-actions a{border:0;border-radius:10px;padding:9px 14px;background:#b9efcf;color:#145c35;font-weight:700;text-decoration:none;cursor:pointer}#trooth-public-actions button[data-on="1"]{background:#e5f7ec}';document.head.appendChild(style);
      var follow=document.getElementById('troothFollowBtn'),friend=document.getElementById('troothFriendBtn');
      function refresh(){return sb.from('connections').select('follower_id,following_id').or('and(follower_id.eq.'+me.id+',following_id.eq.'+target+'),and(follower_id.eq.'+target+',following_id.eq.'+me.id+')').then(function(x){var rows=x.data||[];var following=rows.some(function(v){return v.follower_id===me.id&&v.following_id===target});follow.textContent=following?'Following':'Follow';follow.dataset.on=following?'1':'0';});}
      follow.onclick=function(){follow.disabled=true;sb.from('connections').select('follower_id').eq('follower_id',me.id).eq('following_id',target).maybeSingle().then(function(x){if(x.data)return sb.from('connections').delete().eq('follower_id',me.id).eq('following_id',target);return sb.from('connections').insert({follower_id:me.id,following_id:target});}).then(function(){return refresh()}).finally(function(){follow.disabled=false})};
      friend.onclick=function(){friend.disabled=true;sb.from('friend_requests').insert({sender_id:me.id,receiver_id:target,status:'pending'}).then(function(x){if(x.error)friend.textContent='Request Sent';else friend.textContent='Request Sent';}).finally(function(){friend.disabled=false})};
      refresh();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
