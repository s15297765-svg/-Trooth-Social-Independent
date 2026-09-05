/* Trooth Social Independent — unified Home Experience bridge v3 */
(function(){
  if(window.troothUnifiedHomeLive)return;
  window.troothUnifiedHomeLive=true;
  const market={businesses:{label:'🏢 Business',href:'business.html'},store_listings:{label:'🛍️ Stores',href:'stores.html'},properties:{label:'🏠 Property',href:'property.html'}};
  let lastToast={};
  function toast(text,href,key){
    key=key||text;var now=Date.now();if(lastToast[key]&&now-lastToast[key]<1200)return;lastToast[key]=now;
    let e=document.getElementById('trooth-home-live');
    if(!e){e=document.createElement('div');e.id='trooth-home-live';e.style='position:fixed;top:214px;right:14px;z-index:10001;background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:10px 14px;box-shadow:0 8px 24px #0002;font:700 13px system-ui;color:#166534;cursor:pointer';document.body.appendChild(e)}
    e.textContent=text;e.onclick=()=>href&&(location.href=href);clearTimeout(e._t);e._t=setTimeout(()=>e.remove(),7000);
  }
  function emit(type,payload){window.dispatchEvent(new CustomEvent('trooth-home-live-update',{detail:{type:type,payload:payload||null}}));}
  function bridge(name,type,text,href){
    window.addEventListener(name,function(e){var d=e&&e.detail||{};emit(type,d);if(text)toast(text,href,type);});
  }
  function start(){
    if(window.__troothHomeUnifiedBridgeV3)return;
    window.__troothHomeUnifiedBridgeV3=true;
    // Reuse existing realtime bridges instead of opening duplicate Supabase channels.
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
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();