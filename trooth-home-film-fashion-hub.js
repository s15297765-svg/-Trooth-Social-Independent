// Trooth Social Independent — Film & Fashion Home Hub
(function(){
  function boot(){
    var sb=window.troothSupabase;
    if(!sb||window.troothHomeFilmFashionHubReady)return;
    window.troothHomeFilmFashionHubReady=true;
    function render(rows){
      var section=document.getElementById('filmFashionHomeHub');
      if(!section)return;
      section.innerHTML=(rows||[]).map(function(x){
        var cat=x.category||'Film & Fashion';
        var title=x.title||'Trooth Story';
        var body=(x.body||x.description||'').slice(0,140);
        return '<article class="hubitem"><span class="tag">'+esc(cat)+'</span><h3>'+esc(title)+'</h3><p>'+esc(body)+'</p></article>';
      }).join('')||'<div class="hubitem">ابھی کوئی Film & Fashion Story موجود نہیں۔</div>';
    }
    function esc(s){return String(s==null?'':s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    async function load(){
      var r=await sb.from('film_fashion_stories').select('id,title,body,description,category,created_at').order('created_at',{ascending:false}).limit(4);
      if(!r.error)render(r.data||[]);
    }
    function ensureSection(){
      if(document.getElementById('filmFashionHomeHub')){load();return}
      var headings=document.querySelectorAll('h2'),anchor=null;
      for(var i=0;i<headings.length;i++){if((headings[i].textContent||'').indexOf('Film & Fashion')>=0){anchor=headings[i].closest('.card');break}}
      if(!anchor)return;
      var card=document.createElement('div');card.className='card';card.innerHTML='<h2>🎬 Film & Fashion — Live Stories</h2><div id="filmFashionHomeHub" class="hubgrid">Loading...</div><br><a class="btn" href="film-fashion.html">Open Film & Fashion →</a>';anchor.parentNode.insertBefore(card,anchor);load();
    }
    ensureSection();
    var ch=sb.channel('trooth-home-film-fashion-hub').on('postgres_changes',{event:'*',schema:'public',table:'film_fashion_stories'},function(){load();window.dispatchEvent(new CustomEvent('trooth-home-section-live',{detail:{table:'film_fashion_stories'}}))}).subscribe();
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')load()});
    window.addEventListener('focus',load);
    window.addEventListener('beforeunload',function(){try{sb.removeChannel(ch)}catch(e){}},{once:true});
  }
  if(window.troothSupabase)boot();else window.addEventListener('trooth-supabase-ready',boot,{once:true});
})();
