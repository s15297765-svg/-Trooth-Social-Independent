// Trooth — profile social actions bridge v2
(function(){
  function boot(){
    var sb=window.troothSupabase;if(!sb||window.__troothProfileSocialActionsV2)return;window.__troothProfileSocialActionsV2=true;
    var target=new URLSearchParams(location.search).get('id')||new URLSearchParams(location.search).get('user');
    var host=null,busy=false,pending=false;
    async function getUser(){try{return (await sb.auth.getUser()).data.user||null}catch(e){return null}}
    async function getState(uid,targetId){
      var r=await Promise.all([
        sb.from('friend_requests').select('id,sender_id,receiver_id,status').or('and(sender_id.eq.'+uid+',receiver_id.eq.'+targetId+'),and(sender_id.eq.'+targetId+',receiver_id.eq.'+uid+')'),
        sb.from('connections').select('follower_id,following_id').or('and(follower_id.eq.'+uid+',following_id.eq.'+targetId+'),and(follower_id.eq.'+targetId+',following_id.eq.'+uid+')')
      ]);return {requests:r[0].data||[],connections:r[1].data||[]}
    }
    async function render(){
      if(!target||!host||busy){if(busy)pending=true;return}busy=true;
      try{
        var u=await getUser();if(!u||u.id===target){host.innerHTML='';return}
        var s=await getState(u.id,target);
        var following=s.connections.some(function(x){return x.follower_id===u.id&&x.following_id===target});
        var friend=s.requests.some(function(x){return x.status==='accepted'});
        var outgoing=s.requests.find(function(x){return x.status==='pending'&&x.sender_id===u.id&&x.receiver_id===target});
        var incoming=s.requests.find(function(x){return x.status==='pending'&&x.sender_id===target&&x.receiver_id===u.id});
        var friendLabel=friend?'✓ Friends':incoming?'✓ Accept Request':outgoing?'⏳ Request Sent':'＋ Add Friend';
        host.innerHTML='<button class="btn" data-act="follow">'+(following?'✓ Following':'Follow')+'</button><button class="btn" data-act="friend">'+friendLabel+'</button><button class="btn" data-act="message">💬 Message</button>';
        var fb=host.querySelector('[data-act=follow]');fb.onclick=async function(){fb.disabled=true;var r=following?await sb.from('connections').delete().eq('follower_id',u.id).eq('following_id',target):await sb.from('connections').insert({follower_id:u.id,following_id:target});if(r.error)console.warn('Trooth follow:',r.error);window.dispatchEvent(new CustomEvent('trooth-social-graph-refresh'));render()};
        var fr=host.querySelector('[data-act=friend]');fr.onclick=async function(){fr.disabled=true;if(incoming){var r=await sb.from('friend_requests').update({status:'accepted'}).eq('id',incoming.id);if(r.error)console.warn('Trooth accept:',r.error)}else if(outgoing){return}else if(!friend){var r2=await sb.from('friend_requests').insert({sender_id:u.id,receiver_id:target,status:'pending'});if(r2.error)console.warn('Trooth friend:',r2.error)}window.dispatchEvent(new CustomEvent('trooth-social-graph-refresh'));render()};
        host.querySelector('[data-act=message]').onclick=function(){location.href='chat.html?user='+encodeURIComponent(target)};
      }finally{busy=false;if(pending){pending=false;setTimeout(render,80)}}
    }
    function refresh(){render()}
    host=document.querySelector('[data-trooth-social-actions]');
    render();
    ['trooth-social-refresh','trooth-profile-social-refresh','trooth-social-graph-refresh','trooth-friends-social-update','trooth-notifications-refresh'].forEach(function(ev){window.addEventListener(ev,refresh)});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();