/* Trooth Social Independent — marketplace interactions live bridge */
(function(){
  if(window.troothMarketInteractionsLive)return;
  window.troothMarketInteractionsLive=true;

  const tables={businesses:'business',store_listings:'stores',properties:'property'};
  let refreshTimer=null,stopped=false;

  function refresh(){
    if(stopped)return;
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>{
      refreshTimer=null;
      window.dispatchEvent(new CustomEvent('trooth-market-interaction-update'));
    },180);
  }

  function onMarketUpdate(event){
    if(stopped)return;
    const detail=event&&event.detail;
    if(!detail||!tables[detail.type])return;
    refresh();
  }

  function cleanup(){
    stopped=true;
    clearTimeout(refreshTimer);refreshTimer=null;
    window.removeEventListener('trooth-market-live-update',onMarketUpdate);
  }

  function start(){
    stopped=false;
    window.addEventListener('trooth-market-live-update',onMarketUpdate);
    window.addEventListener('beforeunload',cleanup,{once:true});
    window.addEventListener('trooth-market-interactions-stop',cleanup,{once:true});
  }

  start();
})();
