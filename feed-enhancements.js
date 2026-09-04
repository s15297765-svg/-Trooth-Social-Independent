// Trooth Social Independent — Feed interactions enhancement
(function () {
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const wait = () => new Promise(resolve => {
    if (window.troothSupabase) return resolve(window.troothSupabase);
    window.addEventListener('trooth-supabase-ready', () => resolve(window.troothSupabase), { once: true });
  });

  async function hydrateFeed() {
    const s = await wait();
    const posts = [...document.querySelectorAll('.post')];
    if (!posts.length) return;
    const ids = posts.map(x => (x.querySelector('.actions button')?.getAttribute('onclick') || '').match(/'([^']+)'/)?.[1]).filter(Boolean);
    if (!ids.length) return;

    const [likesRes, commentsRes] = await Promise.all([
      s.from('post_likes').select('post_id,user_id').in('post_id', ids),
      s.from('comments').select('id,post_id,user_id,body,created_at').in('post_id', ids).order('created_at', { ascending: true })
    ]);
    const likes = likesRes.data || [], comments = commentsRes.data || [];
    let me = null;
    try { me = (await s.auth.getUser()).data.user || null; } catch (_) {}
    const counts = {};
    likes.forEach(l => { counts[l.post_id] = (counts[l.post_id] || 0) + 1; });
    const mine = new Set(likes.filter(l => me && l.user_id === me.id).map(l => l.post_id));
    const commentCounts = {};
    comments.forEach(c => { commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1; });

    posts.forEach(post => {
      const id = (post.querySelector('.actions button')?.getAttribute('onclick') || '').match(/'([^']+)'/)?.[1];
      if (!id) return;
      const actions = post.querySelector('.actions');
      if (!actions) return;
      actions.innerHTML = `
        <button class="like-action" onclick="toggleLike('${id}',this)">${mine.has(id) ? '❤️ Liked' : '👍 Like'} <span>${counts[id] || 0}</span></button>
        <button onclick="addComment('${id}')">💬 Comment <span>${commentCounts[id] || 0}</span></button>
        <button onclick="sharePost('${id}')">↗️ Share</button>`;
      const box = post.querySelector('#c-' + id);
      if (box && comments.filter(c => c.post_id === id).length) {
        box.innerHTML = comments.filter(c => c.post_id === id).map(c => `<div class="comment"><b>Trooth Member:</b> ${esc(c.body)} <small>• ${new Date(c.created_at).toLocaleString()}</small></div>`).join('');
      }
    });
  }

  window.toggleLike = async function (id, button) {
    const s = await wait();
    const me = (await s.auth.getUser()).data.user;
    if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; }
    const q = await s.from('post_likes').select('post_id').eq('post_id', id).eq('user_id', me.id).maybeSingle();
    if (q.error) { alert(q.error.message); return; }
    if (q.data) {
      const r = await s.from('post_likes').delete().eq('post_id', id).eq('user_id', me.id);
      if (r.error) { alert(r.error.message); return; }
    } else {
      const r = await s.from('post_likes').insert({ post_id: id, user_id: me.id });
      if (r.error) { alert(r.error.message); return; }
    }
    await hydrateFeed();
  };

  window.addComment = async function (id) {
    const s = await wait();
    const me = (await s.auth.getUser()).data.user;
    if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; }
    const v = prompt('Write your comment:');
    if (!v || !v.trim()) return;
    const r = await s.from('comments').insert({ post_id: id, user_id: me.id, body: v.trim() });
    if (r.error) { alert(r.error.message); return; }
    await hydrateFeed();
  };

  window.sharePost = async function (id) {
    const url = location.origin + location.pathname + '#post-' + id;
    try {
      if (navigator.share) await navigator.share({ title: 'Trooth Social Independent', text: 'Check this post on Trooth', url });
      else { await navigator.clipboard.writeText(url); alert('Post link copied!'); }
    } catch (_) {}
  };

  const originalReady = window.ready;
  if (typeof originalReady === 'function') {
    const wrapped = async function () { await originalReady(); await hydrateFeed(); };
    window.ready = wrapped;
  }
  window.addEventListener('trooth-supabase-ready', () => setTimeout(hydrateFeed, 500));
})();
