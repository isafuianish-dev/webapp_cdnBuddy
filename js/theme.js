
(function () {
  'use strict';

  var ACCENTS = [
    { id: 'indigo', label: 'Indigo' },
    { id: 'blue', label: 'Blue' },
    { id: 'green', label: 'Green' },
    { id: 'rose', label: 'Rose' },
    { id: 'amber', label: 'Amber' },
    { id: 'purple', label: 'Purple' }
  ];

  function resolveSystemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function applyTheme(appKey, theme) {
    var resolved = (theme === 'light' || theme === 'dark') ? theme : resolveSystemTheme();
    document.documentElement.setAttribute('data-theme', resolved);
    try { localStorage.setItem(appKey + '.theme.v1', theme); } catch (e) {}
  }

  function currentThemeMode(appKey) {
    var saved = null;
    try { saved = localStorage.getItem(appKey + '.theme.v1'); } catch (e) {}
    return (saved === 'light' || saved === 'dark') ? saved : 'system';
  }

  function applyAccent(appKey, accent) {
    if (accent && accent !== 'indigo') {
      document.documentElement.setAttribute('data-accent', accent);
    } else {
      document.documentElement.removeAttribute('data-accent');
    }
    try { localStorage.setItem(appKey + '.accent.v1', accent || 'indigo'); } catch (e) {}
  }

  var MOTION_KEY = 'buddy.motion.v1';

  function applyMotion(mode) {
    if (mode === 'on' || mode === 'reduced') {
      document.documentElement.setAttribute('data-motion', mode);
      try { localStorage.setItem(MOTION_KEY, mode); } catch (e) {}
    } else {
      document.documentElement.removeAttribute('data-motion');
      try { localStorage.removeItem(MOTION_KEY); } catch (e) {}
    }
    try { document.dispatchEvent(new CustomEvent('buddy:motionchange')); } catch (e) {}
  }

  function currentMotionMode() {
    var forced = document.documentElement.getAttribute('data-motion');
    return (forced === 'on' || forced === 'reduced') ? forced : 'system';
  }

  function isMotionReduced() {
    var forced = document.documentElement.getAttribute('data-motion');
    if (forced === 'on') return false;
    if (forced === 'reduced') return true;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function printColors(accent) {
    var id = (accent && accent !== 'indigo') ? accent : 'indigo';
    var styles = getComputedStyle(document.documentElement);
    return {
      primary: styles.getPropertyValue('--print-accent-' + id).trim(),
      light: styles.getPropertyValue('--print-accent-' + id + '-light').trim()
    };
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      var appKey = window.__buddyAppKey;
      if (appKey && currentThemeMode(appKey) === 'system') {
        document.documentElement.setAttribute('data-theme', resolveSystemTheme());
      }
    });
  }

  window.Buddy = window.Buddy || {};
  window.Buddy.theme = {
    ACCENTS: ACCENTS,
    applyTheme: applyTheme,
    currentThemeMode: currentThemeMode,
    applyAccent: applyAccent,
    applyMotion: applyMotion,
    currentMotionMode: currentMotionMode,
    isMotionReduced: isMotionReduced,
    printColors: printColors
  };
})();
