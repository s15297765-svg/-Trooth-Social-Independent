(function(){
  'use strict';
  let sb, channel, currentUser;
  const boot=()=>{if(window.troothSupabase){start(window.troothSupabase);return}window.addEventListener('trooth-supabase-ready',()=>start(window.troothSupabase),{once:true})};
  async function start(client){
    if(!client||channel)return;
    sb=client;
    const r=await sb.auth.getUser();
    currentUser=r.data&&r.data.user||null;
    if(!currentUser)return;
    channel=sb.channel('trooth-network-realtime-'+currentUser.id)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'group_join_requests'},handleGroupRequest)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'businesses'},()=>refresh('trooth-business-live'))
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'business_posts'},handleBusinessPost)
      .subscribe();
    sb.auth.onAuthStateChange((event,session)=>{
      currentUser=session&&session.user||null;
      if(event==='SIGNED_OUT')stop();
      else if((event==='SIGNED_IN'||event==='TOKEN_REFRESHED')&&currentUser&&!channel)start(sb);
    });
  }
  async function handleGroupRequest(payload){
    const row=payload&&payload.new;
    if(!row||!currentUser||row.user_id===currentUser.id||row.status!=='pending')return;
    const g=await sb.from('groups').select('id,name,created_by').eq('id',row.group_id).maybeSingle();
    if(g.error||!g.data||g.data.created_by!==currentUser.id)return;
    await notify(g.data.created_by,row.user_id,'group_join_request','👥 Someone requested to join your Trooth Group: '+g.data.name);
    refresh('trooth-groups-live');
  }
  async function handleBusinessPost(payload){
    const row=payload&&payload.new;
    if(!row||!currentUser||row.user_id===currentUser.id)return;
    const b=await sb.from('businesses').select('id,name,user_id').eq('id',row.business_id).maybeSingle();
    if(b.error||!b.data||b.data.user_id!==currentUser.id)return;
    await notify(b.data.user_id,row.user_id,'business_post','💼 New activity on your business: '+b.data.name);
    refresh('trooth-business-live');
  }
  async function notify(userId,actorId,kind,body){
    try{
      const q=await sb.from('notifications').select('id').eq('user_id',userId).eq('actor_id',actorId).eq('kind',kind).eq('is_read',false).limit(1);
      if(q.data&&q.data.length)return;
      await sb.from('notifications').insert({user_id:userId,actor_id:actorId,kind,body,is_read:false});
      window.dispatchEvent(new CustomEvent('trooth-notifications-refresh'));
      window.dispatchEvent(new CustomEvent('trooth-unread-refresh'));
    }catch(e){console.warn('Trooth network realtime:',e)}
  }
  function refresh(name){window.dispatchEvent(new CustomEvent(name));window.dispatchEvent(new CustomEvent('trooth-network-refresh'))}
  function stop(){if(channel&&sb)try{sb.removeChannel(channel)}catch(e){}channel=null}
  window.addEventListener('beforeunload',stop);
  boot();
})();
