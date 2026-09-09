// Trooth Social Independent — final stability check v1
(function(){
  if(window.__troothFinalCheckV1)return;window.__troothFinalCheckV1=true;
  function boot(){
    var s=window.troothSupabase;if(!s)return;
    function ready(){
      document.documentElement.setAttribute('data-trooth-ready','1');
      window.dispatchEvent(new CustomEvent('trooth-final-ready'));
    }
    try{s.auth.getSession().then(ready).catch(function(){})}catch(e){}
    window.addEventListener('trooth-supabase-ready',ready,{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
