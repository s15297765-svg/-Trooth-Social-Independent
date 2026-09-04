// Trooth Social Independent — Feed interactions enhancement
(function () {
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const wait = () => new Promise(resolve => {
    if (window.troothSupabase) return resolve(window.troothSupabase);
    window.addEventListener('trooth-supabase-ready', () => resolve(window.troothSupabase), { once: true });
  });
  const getActions = post => post.querySelector('.postactions,.actions');
  const getPostId = post => {
    const el = getActions(post)?.querySelector('button');
    const m = (el?.getAttribute('onclick') || '').match(/['\"]([^'\"]+)['\"]/);
    return m?.[1] || post.dataset.postId || '';
  };

  async function notifyPostOwner(s, postId, actorId, kind, body) {
    try {
      const { data: post } = await s.from('posts').select('user_id').eq('id', postId).maybeSingle();
      if (!post?.user_id || post.user_id === actorId) return;
      await s.from('notifications').insert({ user_id: post.user_id, actor_id: actorId, kind, body, is_read: false });
    } catch (_) {}
  }

  async function hydrateFeed() {
    const s = await wait();
    const posts = [...document.querySelectorAll('.post')];
    if (!posts.length) return;
    const ids = posts.map(getPostId).filter(Boolean);
    if (!ids.length) return;
    const [likesRes, commentsRes] = await Promise.all([
      s.from('post_likes').select('post_id,user_id').in('post_id', ids),
      s.from('comments').select('id,post_id,user_id,body,created_at').in('post_id', ids).order('created_at', { ascending: true })
    ]);
    const likes = likesRes.data || [], comments = commentsRes.data || [];
    let me = null;
    try { me = (await s.auth.getUser()).data.user || null; } catch (_) {}
    const counts = {}, commentCounts = {};
    likes.forEach(l => { counts[l.post_id] = (counts[l.post_id] || 0) + 1; });
    comments.forEach(c => { commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1; });
    const mine = new Set(likes.filter(l => me && l.user_id === me.id).map(l => l.post_id));

    posts.forEach(post => {
      const id = getPostId(post), actions = getActions(post);
      if (!id || !actions) return;
      actions.innerHTML = `
        <button class="action like-action" onclick="toggleLike('${id}',this)">${mine.has(id) ? '❤️ Liked' : '👍 Like'} <span>${counts[id] || 0}</span></button>
        <button class="action" onclick="addComment('${id}')">💬 Comment <span>${commentCounts[id] || 0}</span></button>
        <button class="action" onclick="sharePost('${id}')">↗ Share</button>`;
      let box = post.querySelector('.comments-box,#c-' + CSS.escape(id));
      if (!box) {
        box = document.createElement('div');
        box.className = 'comments-box';
        box.id = 'c-' + id;
        post.appendChild(box);
      }
      const mineComments = comments.filter(c => c.post_id === id);
      box.innerHTML = mineComments.map(c => `<div class="comment" style="margin-top:8px;padding:8px;border-radius:9px;background:#f4f8f5"><b>Trooth Member:</b> ${esc(c.body)} <small>• ${new Date(c.created_at).toLocaleString()}</small></div>`).join('');
    });
  }

  window.toggleLike = async function (id) {
    const s = await wait(), me = (await s.auth.getUser()).data.user;
    if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; }
    const q = await s.from('post_likes').select('post_id').eq('post_id', id).eq('user_id', me.id).maybeSingle();
    if (q.error) { alert(q.error.message); return; }
    if (q.data) {
      const r = await s.from('post_likes').delete().eq('post_id', id).eq('user_id', me.id);
      if (r.error) { alert(r.error.message); return; }
    } else {
      const r = await s.from('post_likes').insert({ post_id: id, user_id: me.id });
      if (r.error) { alert(r.error.message); return; }
      await notifyPostOwner(s, id, me.id, 'Like', 'liked your post on Trooth.');
    }
    await hydrateFeed();
  };

  window.addComment = async function (id) {
    const s = await wait(), me = (await s.auth.getUser()).data.user;
    if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; }
    const v = prompt('Write your comment:');
    if (!v || !v.trim()) return;
    const r = await s.from('comments').insert({ post_id: id, user_id: me.id, body: v.trim() });
    if (r.error) { alert(r.error.message); return; }
    await notifyPostOwner(s, id, me.id, 'Comment', 'commented on your post on Trooth.');
    await hydrateFeed();
  };

  window.sharePost = async function (id) {
    const s = await wait(), me = (await s.auth.getUser()).data.user;
    if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; }
    const url = location.origin + location.pathname + '#post-' + id;
    try {
      if (navigator.share) await navigator.share({ title: 'Trooth Social Independent', text: 'Check this post on Trooth', url });
      else { await navigator.clipboard.writeText(url); alert('Post link copied!'); }
      await notifyPostOwner(s, id, me.id, 'Share', 'shared your post on Trooth.');
    } catch (_) {}
  };

  window.refreshTroothFeed = hydrateFeed;
  window.addEventListener('trooth-supabase-ready', () => setTimeout(hydrateFeed, 700));
  window.addEventListener('trooth-post-update', () => setTimeout(hydrateFeed, 250));
})();
