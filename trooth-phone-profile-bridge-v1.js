// Trooth Phone → Profile Bridge v1
(function(){
  if(window.__troothPhoneProfileBridgeV1)return;
  window.__troothPhoneProfileBridgeV1=true;
  async function start(){
    if(!window.troothSupabase)return;
    var verified=sessionStorage.getItem('trooth_verified')==='1';
    if(!verified)return;
    try{
      var sb=window.troothSupabase;
      var r=await sb.auth.getUser(),user=r.data&&r.data.user;
      if(!user)return;
      var p=await sb.from('profiles').select('id,display_name,bio').eq('id',user.id).maybeSingle();
      if(p.error)return;
      if(!p.data){
        var name=sessionStorage.getItem('trooth_pending_name')||user.user_metadata?.display_name||user.phone||'Trooth User';
        await sb.from('profiles').insert({id:user.id,display_name:name,bio:''});
      }
      sessionStorage.removeItem('trooth_verified');
      sessionStorage.removeItem('trooth_pending_name');
      window.dispatchEvent(new CustomEvent('trooth-profile-ready',{detail:{user:user}}));
    }catch(e){console.warn('Trooth phone profile bridge',e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  window.addEventListener('trooth-supabase-ready',start);
  setTimeout(start,1500);
})();
