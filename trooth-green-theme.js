// Trooth Social Independent — stronger green visual theme
(function () {
  const style = document.createElement('style');
  style.id = 'trooth-green-theme';
  style.textContent = `
    :root {
      --g: #16a34a !important;
      --g2: #15803d !important;
      --p: #dcfce7 !important;
      --bg: #f0fdf4 !important;
      --ink: #12351f !important;
      --muted: #607568 !important;
    }
    body { background: var(--bg) !important; }
    .top { background: var(--g) !important; }
    .hero { background: linear-gradient(135deg, #dcfce7, #ffffff) !important; border-color: #bbf7d0 !important; }
    .nav:hover, .active { background: var(--p) !important; color: var(--g2) !important; }
    .btn { background: var(--g2) !important; }
    .filelabel, .tag, .story-add { background: var(--p) !important; color: var(--g2) !important; }
    .story-add { border-color: var(--g) !important; }
    .action:hover { background: var(--p) !important; }
    .action, .quick a { color: var(--g2) !important; }
    .quick a:hover { background: var(--p) !important; }
    .avatar, .smavatar { background: var(--g2) !important; }
    footer { background: var(--g2) !important; }
  `;
  (document.head || document.documentElement).appendChild(style);
})();
