// Trooth Social Independent — Notifications mobile polish v1
(function(){
  if(window.__troothNotificationsMobilePolishV1)return;window.__troothNotificationsMobilePolishV1=true;
  function boot(){
    if(document.getElementById('trooth-notifications-mobile-polish-v1'))return;
    var s=document.createElement('style');s.id='trooth-notifications-mobile-polish-v1';s.textContent=`
      :root{--trooth-green:#69c79a;--trooth-deep:#145238;--trooth-soft:#e9f8ef;--trooth-line:#dfeee5}
      .trooth-notifications-mobile-ready .item{transition:background .16s,transform .16s;border-radius:12px}
      .trooth-notifications-mobile-ready .item:active{transform:scale(.99)}
      .trooth-notifications-mobile-ready .tabs{position:sticky;top:74px;z-index:4;background:rgba(244,250,246,.94);backdrop-filter:blur(12px);padding:7px 0;border-radius:14px}
      .trooth-notifications-mobile-ready .count{font-variant-numeric:tabular-nums}
      @media(max-width:650px){
        body{padding-bottom:82px}
        .top{position:sticky;top:0}
        .wrap{width:100%;margin:10px auto;padding:0 8px}
        .live{width:100%;text-align:center;margin-bottom:5px}
        .tabs{gap:7px!important;margin-bottom:8px!important}
        .tabs button{min-height:46px;padding:10px 8px!important;border-radius:12px!important}
        .card{border-radius:16px!important;padding:11px!important;margin-bottom:11px!important}
        .head{gap:8px!important}.head h2{font-size:18px}
        .head .actions{width:100%}.head .actions .btn{flex:1;text-align:center;min-height:42px}
        .item{padding:12px 5px!important;gap:9px!important}
        .avatar{width:42px;height:42px}
        .item p{font-size:13px;line-height:1.4}
        .search{min-height:44px;font-size:14px}
        .actions .btn{min-height:42px}
      }
      @media(prefers-reduced-motion:reduce){.trooth-notifications-mobile-ready .item{transition:none!important}}
    `;document.head.appendChild(s);document.documentElement.classList.add('trooth-notifications-mobile-ready');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();