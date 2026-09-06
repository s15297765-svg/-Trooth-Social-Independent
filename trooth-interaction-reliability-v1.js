// Trooth Social Independent — interaction reliability + mobile UX bridge v2
(function(){
  if(window.__troothInteractionReliabilityV2)return;window.__troothInteractionReliabilityV2=true;
  function toast(msg){
    var t=document.createElement('div');t.textContent=msg;t.setAttribute('role','status');
    t.style.cssText='position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:99999;background:#173b29;color:#fff;padding:10px 15px;border-radius:999px;font:700 13px system-ui;box-shadow:0 8px 24px #0003;max-width:calc(100vw - 28px);text-align:center';
    document.body.appendChild(t);setTimeout(function(){t.remove()},1800);
  }
  function boot(){
    var sb=window.troothSupabase;if(!sb||!window.TroothInteractions)return;
    var sharing=false;
    document.addEventListener('click',function(e){
      var b=e.target.closest&&e.target.closest('[data-trooth-share]');
      if(!b)return;
      var url=b.getAttribute('data-trooth-share');if(!url)return;
      if(sharing){e.preventDefault();return}
      if(navigator.share){
        e.preventDefault();sharing=true;b.setAttribute('aria-busy','true');
        navigator.share({title:'Trooth',text:'Check this out on Trooth',url:url}).catch(function(err){if(err&&err.name!=='AbortError')toast('Share unavailable');}).finally(function(){sharing=false;b.removeAttribute('aria-busy')});
      }else if(navigator.clipboard&&window.isSecureContext){
        e.preventDefault();navigator.clipboard.writeText(url).then(function(){toast('🔗 Link copied');}).catch(function(){toast('Copy failed');});
      }
    });
    window.addEventListener('trooth-content-interaction-refresh',function(e){
      var d=e.detail||{};if(d.type&&d.id)document.dispatchEvent(new CustomEvent('trooth-interaction-updated',{detail:d}));
    });
    window.addEventListener('online',function(){toast('🟢 Back online');});
    window.addEventListener('offline',function(){toast('🔴 You are offline');});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
