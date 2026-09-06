// Trooth Social Independent — unified saved content live hub v1
(function(){
  if(window.__troothSavedContentLiveV1)return;window.__troothSavedContentLiveV1=true;
  function ready(){if(window.troothSupabase)return Promise.resolve(window.troothSupabase);return new Promise(function(r){window.addEventListener('trooth-supabase-ready',function(){r(window.troothSupabase)},{once:true})})}
  async function load(){var sb=await ready(),u=(await sb.auth.getUser()).data.user;if(!u)return;var ev=new CustomEvent('trooth-saved-content-refresh');window.dispatchEvent(ev)}
  async function start(){var sb=await ready(),u=(await sb.auth.getUser()).data.user;if(!u)return;var ch=sb.channel('trooth-saved-content-live-'+u.id).on('postgres_changes',{event:'*',schema:'public',table:'saved_content',filter:'user_id=eq.'+u.id},function(){window.dispatchEvent(new CustomEvent('trooth-saved-content-refresh'))}).subscribe();window.addEventListener('beforeunload',function(){try{sb.removeChannel(ch)}catch(e){}});load()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
