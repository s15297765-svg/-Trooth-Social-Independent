// Trooth Social Independent — feed endpoint guard v1
(function(){
  if(window.__troothFeedEndpointV1)return;
  window.__troothFeedEndpointV1=true;
  const wait=()=>new Promise(resolve=>{
    if(window.troothSupabase)return resolve(window.troothSupabase);
    window.addEventListener('trooth-supabase-ready',()=>resolve(window.troothSupabase),{once:true});
  });
  function status(msg){
    const el=document.getElementById('uploadStatus');
    if(el)el.textContent=msg||'';
  }
  function bind(){
    const input=document.getElementById('postInput');
    if(!input||input.dataset.troothEndpointBound)return;
    input.dataset.troothEndpointBound='1';
    input.addEventListener('keydown',async e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){
        e.preventDefault();
        if(typeof window.publishPost==='function')window.publishPost();
      }
    });
  }
  async function guard(){
    bind();
    const original=window.publishPost;
    if(typeof original!=='function'||original.__troothWrapped)return;
    const wrapped=async function(){
      const s=await wait();
      let user=null;
      try{user=(await s.auth.getUser()).data.user||null}catch(_){ }
      if(!user){status('🔐 Please login first');location.href='auth.html';return;}
      const input=document.getElementById('postInput');
      const text=(input?.value||'').trim();
      const image=document.getElementById('imageInput')?.files?.length||0;
      const video=document.getElementById('videoInput')?.files?.length||0;
      if(!text&&!image&&!video){status('✍️ Write something or add media first');input?.focus();return;}
      status('⏳ Publishing to Trooth…');
      try{
        const result=await original.apply(this,arguments);
        status('✅ Posted to Trooth');
        window.dispatchEvent(new CustomEvent('trooth-post-update',{detail:{source:'endpoint-guard'}}));
        setTimeout(()=>{if(document.getElementById('uploadStatus'))status('')},2200);
        return result;
      }catch(err){
        status('⚠️ '+(err?.message||'Post could not be published'));
        throw err;
      }
    };
    wrapped.__troothWrapped=true;
    window.publishPost=wrapped;
  }
  function start(){bind();setTimeout(guard,900);setTimeout(guard,2200)}
  window.addEventListener('trooth-supabase-ready',start);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
