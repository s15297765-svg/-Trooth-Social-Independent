/* Trooth Social Independent — unified Home Experience bridge v4 */
(function(){
  if(window.__troothHomeUnifiedBridgeV4)return;
  window.__troothHomeUnifiedBridgeV4=true;
  let lastToast={};
  let toastTimer=null;
  function toast(text,href,key){
    key=key||text;var now=Date.now();if(lastToast[key]&&now-lastToast[key]<1200)return;lastToast[key]=now;
    let e=document.getElementById('trooth-home-live');
    if(!e){
      e=document.createElement(href?'button':'div');
      e.id='trooth-home-live';
      e.setAttribute('role','status');e.setAttribute('aria-live','polite');e.setAttribute('aria-atomic','true');
      e.style='position:fixed;top:214px;right:14px;z-index:10001;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:10px 14px;box-shadow:0 8px 24px #0002;font:700 13px system-ui;color:#166534;cursor:pointer;max-width:calc(100vw - 28px)';
      if(href){e.type='button';e.addEventListener('click',function(){if(e.dataset.href)location.href=e.dataset.href});}
      document.body.appendChild(e);
    }
    e.textContent=text;e.dataset.href=href||'';e.title=href?'Open '+text.replace(/^\S+\s*/,''):text;e.setAttribute('aria-label',href?text+' — open':'');
    if(e.parentNode!==document.body)document.body.appendChild(e);
    clearTimeout(toastTimer);toastTimer=setTimeout(function(){if(e&&e.parentNode)e.remove()},7000);
  }
  function emit(type,payload){window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:type,payload:payload||null}}));}
  function bridge(name,type,text,href){
    window.addEventListener(name,function(e){var d=e&&e.detail||{};emit(type,d);if(text)toast(text,href,type);});
  }
  function start(){
    if(window.__troothHomeUnifiedBridgeV4Started)return;
    window.__troothHomeUnifiedBridgeV4Started=true;
    // Reuse existing realtime bridges; this module opens no Supabase channel.
    bridge('trooth-home-feed-refresh','post');
    bridge('trooth-feed-refresh','post','🟢 نئی Social Post','index.html','post');
    bridge('trooth-groups-refresh','group','👥 Group update','groups.html','group');
    bridge('trooth-business-refresh','business','🏢 Business update','business.html','business');
    bridge('trooth-stores-refresh','store_listings','🛍️ نئی Store Listing','stores.html','store');
    bridge('trooth-property-refresh','properties','🏠 نئی Property Listing','property.html','property');
    bridge('trooth-news-refresh','news_stories','📰 نئی News Story','news.html','news');
    bridge('trooth-sports-refresh','sports_stories','🏆 نئی Sports Story','sports.html','sports');
    bridge('trooth-film-fashion-refresh','film_fashion_stories','🎬 نئی Film/Fashion Story','film-fashion.html','film-fashion');
    bridge('trooth-notification-live','notification');
    window.addEventListener('beforeunload',function(){clearTimeout(toastTimer);lastToast={};},{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();