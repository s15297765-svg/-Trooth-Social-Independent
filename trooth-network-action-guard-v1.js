// Trooth Social Independent — network action reliability guard v1
(function(){
  if(window.__troothNetworkActionGuardV1)return; window.__troothNetworkActionGuardV1=true;
  var busy=new WeakSet();
  function toast(msg){try{if(window.TroothToast&&typeof window.TroothToast.show==='function')window.TroothToast.show(msg);else if(window.showToast)window.showToast(msg)}catch(e){}}
  function guard(e){
    var el=e.target&&e.target.closest&&e.target.closest('button,[role="button"],a');
    if(!el)return;
    var t=(el.textContent||'').trim().toLowerCase();
    if(!/(add friend|accept|follow|following|message|send message|unfollow|reject)/.test(t))return;
    if(el.tagName==='A'&&el.getAttribute('href'))return;
    if(busy.has(el)){e.preventDefault();e.stopImmediatePropagation();return}
    busy.add(el); el.dataset.troothBusy='1'; el.setAttribute('aria-busy','true');
    setTimeout(function(){busy.delete(el);delete el.dataset.troothBusy;el.removeAttribute('aria-busy')},1200);
  }
  document.addEventListener('click',guard,true);
  window.addEventListener('trooth-network-ui-synced',function(){
    document.querySelectorAll('[data-trooth-busy="1"]').forEach(function(x){x.removeAttribute('aria-busy');delete x.dataset.troothBusy})
  });
  window.addEventListener('offline',function(){toast('آپ آف لائن ہیں — دوبارہ کنکشن کے بعد کوشش کریں۔')});
})();
