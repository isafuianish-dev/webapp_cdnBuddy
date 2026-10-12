
(function () {
  try {
    var scriptEl = document.currentScript;
    var appKey = scriptEl && scriptEl.getAttribute('data-app');
    if (!appKey) return;
    window.__buddyAppKey = appKey;

    var saved = localStorage.getItem(appKey + '.theme.v1');
    var theme = (saved === 'light' || saved === 'dark')
      ? saved
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    var accent = localStorage.getItem(appKey + '.accent.v1');
    if (accent && accent !== 'indigo') {
      document.documentElement.setAttribute('data-accent', accent);
    }

    var motion = localStorage.getItem('buddy.motion.v1');
    if (motion === 'on' || motion === 'reduced') {
      document.documentElement.setAttribute('data-motion', motion);
    }
  } catch (e) {}
})();
