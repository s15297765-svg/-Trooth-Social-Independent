// Trooth Social Independent — Feed interactions enhancement v6
(function () {
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const wait = () => new Promise(resolve => {
    if (window.troothSupabase) return resolve(window.troothSupabase);
    window.addEventListener('trooth-supabase-ready', () => resolve(window.troothSupabase), { once: true });
  });
  const getActions = post => post.querySelector('.postActions,.postactions,.actions');
  const getPostId = post => post.dataset.post || post.dataset.postId || (() => {
    const el = getActions(post)?.querySelector('button');
    const m = (el?.getAttribute('onclick') || '').match(/['\"]([^'\"]+)['\"]/);
    return m?.[1] || '';
  })();
  const refreshActivity = type => window.dispatchEvent(new CustomEvent('trooth-content-interaction-refresh', { detail: { type } }));
  function polish(){
    if(document.getElementById('trooth-feed-v6-style')) return;
    const st=document.createElement('style');st.id='trooth-feed-v6-style';st.textContent=`
      .postActions,.postactions,.actions{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
      .postActions .action,.postactions .action,.actions .action{border:1px solid #e1eee6;background:#fff;border-radius:12px;padding:8px 11px;font-weight:700;color:#315541;transition:.16s;cursor:pointer}
      .postActions .action:hover,.postactions .action:hover,.actions .action:hover{background:#e9f8ef;transform:translateY(-1px)}
      .postActions .like-action{color:#237b53}.postActions .save-action{color:#2d6a4f}
      .comments-box{margin-top:8px;display:flex;flex-direction:column;gap:6px}
      .comments-box .comment{border:1px solid #e5eee8;background:#f7fbf8!important;border-radius:12px!important;font-size:13px;line-height:1.45}
      .comments-box small{color:#829188}
      @media(max-width:700px){.postActions,.postactions,.actions{gap:5px}.postActions .action,.postactions .action,.actions .action{flex:1 1 auto;min-height:40px;padding:8px 7px;font-size:12px}.comments-box .comment{font-size:12px}}
    `;document.head.appendChild(st);
  }
  async function notifyPostOwner(s, postId, actorId, kind, body) {
    try { const { data: post } = await s.from('posts').select('user_id').eq('id', postId).maybeSingle(); if (!post?.user_id || post.user_id === actorId) return; await s.from('notifications').insert({ user_id: post.user_id, actor_id: actorId, kind, body, is_read: false, post_id: postId }); } catch (_) {}
  }
  async function hydrateFeed() {
    polish(); const s = await wait(); const posts = [...document.querySelectorAll('.post')]; if (!posts.length) return;
    const ids = posts.map(getPostId).filter(Boolean); if (!ids.length) return;
    const [likesRes, commentsRes, savesRes, sharesRes] = await Promise.all([
      s.from('post_likes').select('post_id,user_id').in('post_id', ids),
      s.from('comments').select('id,post_id,user_id,body,created_at').in('post_id', ids).order('created_at', { ascending: true }),
      s.from('saved_content').select('id,user_id,content_id').eq('content_type','post').in('content_id', ids),
      s.from('post_shares').select('post_id,user_id').in('post_id', ids)
    ]);
    const likes = likesRes.data || [], comments = commentsRes.data || [], saves = savesRes.data || [], shares = sharesRes.data || [];
    let me = null; try { me = (await s.auth.getUser()).data.user || null; } catch (_) {}
    const counts = {}, commentCounts = {}, shareCounts = {};
    likes.forEach(l => { counts[l.post_id] = (counts[l.post_id] || 0) + 1; });
    comments.forEach(c => { commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1; });
    shares.forEach(x => { shareCounts[x.post_id] = (shareCounts[x.post_id] || 0) + 1; });
    const mine = new Set(likes.filter(l => me && l.user_id === me.id).map(l => l.post_id));
    const savedMine = new Set(saves.filter(x => me && x.user_id === me.id).map(x => x.content_id));
    posts.forEach(post => {
      const id = getPostId(post), actions = getActions(post); if (!id || !actions) return;
      actions.innerHTML = `<button class="action like-action" onclick="toggleLike('${id}',this)">${mine.has(id) ? '❤️ Liked' : '👍 Like'} <span>${counts[id] || 0}</span></button><button class="action" onclick="addComment('${id}')">💬 Comment <span>${commentCounts[id] || 0}</span></button><button class="action" onclick="sharePost('${id}')">↗ Share <span>${shareCounts[id] || 0}</span></button><button class="action save-action" onclick="toggleSave('${id}',this)">${savedMine.has(id) ? '🔖 Saved' : '🔖 Save'}</button>`;
      let box = post.querySelector('.comments-box,#c-' + CSS.escape(id)); if (!box) { box = document.createElement('div'); box.className = 'comments-box'; box.id = 'c-' + id; post.appendChild(box); }
      const postComments = comments.filter(c => c.post_id === id); box.innerHTML = postComments.map(c => `<div class="comment"><b>Trooth Member:</b> ${esc(c.body)} <small>• ${new Date(c.created_at).toLocaleString()}</small></div>`).join('');
      if (!post.dataset.troothDblLike) { post.dataset.troothDblLike = '1'; post.addEventListener('dblclick', event => { if (event.target.closest('button,input,textarea,a,video')) return; const likeButton = post.querySelector('.like-action'); if (likeButton && /Liked/i.test(likeButton.textContent)) return; window.toggleLike(id); }); }
    });
  }
  window.toggleLike = async function (id) { const s = await wait(), me = (await s.auth.getUser()).data.user; if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; } const q = await s.from('post_likes').select('post_id').eq('post_id', id).eq('user_id', me.id).maybeSingle(); if (q.error) { alert(q.error.message); return; } if (q.data) { const r = await s.from('post_likes').delete().eq('post_id', id).eq('user_id', me.id); if (r.error) { alert(r.error.message); return; } refreshActivity('unlike'); } else { const r = await s.from('post_likes').insert({ post_id: id, user_id: me.id }); if (r.error) { alert(r.error.message); return; } await notifyPostOwner(s, id, me.id, 'like', 'liked your post on Trooth.'); refreshActivity('like'); } await hydrateFeed(); };
  window.addComment = async function (id) { const s = await wait(), me = (await s.auth.getUser()).data.user; if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; } const v = prompt('Write your comment:'); if (!v || !v.trim()) return; const r = await s.from('comments').insert({ post_id: id, user_id: me.id, body: v.trim() }); if (r.error) { alert(r.error.message); return; } await notifyPostOwner(s, id, me.id, 'comment', 'commented on your post on Trooth.'); refreshActivity('comment'); await hydrateFeed(); };
  window.sharePost = async function (id) { const s = await wait(), me = (await s.auth.getUser()).data.user; if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; } const url = location.origin + location.pathname + '#post-' + id; try { const shareRecord = await s.from('post_shares').insert({ post_id: id, user_id: me.id }); if (shareRecord.error) { alert(shareRecord.error.message); return; } if (navigator.share) await navigator.share({ title: 'Trooth Social Independent', text: 'Check this post on Trooth', url }); else { await navigator.clipboard.writeText(url); alert('Post link copied!'); } await notifyPostOwner(s, id, me.id, 'share', 'shared your post on Trooth.'); refreshActivity('share'); await hydrateFeed(); } catch (_) {} };
  window.toggleSave = async function (id) { const s = await wait(), me = (await s.auth.getUser()).data.user; if (!me) { alert('Please login first.'); location.href = 'auth.html'; return; } const q = await s.from('saved_content').select('id').eq('content_type','post').eq('content_id',id).eq('user_id',me.id).maybeSingle(); if(q.error){alert(q.error.message);return;} if(q.data){const r=await s.from('saved_content').delete().eq('id',q.data.id).eq('user_id',me.id);if(r.error){alert(r.error.message);return;} alert('Removed from Saved ✓');refreshActivity('unsave');}else{const r=await s.from('saved_content').insert({user_id:me.id,content_type:'post',content_id:id});if(r.error){alert(r.error.message);return;} alert('Saved to your Trooth ✓');refreshActivity('save');} window.dispatchEvent(new CustomEvent('trooth-saved-content-refresh')); await hydrateFeed(); };
  window.refreshTroothFeed = hydrateFeed;
  window.addEventListener('trooth-supabase-ready', () => setTimeout(hydrateFeed, 700));
  window.addEventListener('trooth-post-update', () => setTimeout(hydrateFeed, 250));
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',polish,{once:true}); else polish();
})();
