
(function () {
  'use strict';

  var cache = {};

  function openDoc(openModalFn, title, filePath) {
    var bodyHtml = '<div class="markdown-body" id="manualModalContent">' +
      (cache[filePath] || '<p class="manual-loading">Loading…</p>') +
      '</div>';

    openModalFn(title, bodyHtml, null, { manual: true });

    if (cache[filePath]) return;

    fetch(filePath)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        cache[filePath] = Buddy.markdown.render(text);
        var container = document.getElementById('manualModalContent');
        if (container) container.innerHTML = cache[filePath];
      })
      .catch(function () {
        var container = document.getElementById('manualModalContent');
        if (container) {
          container.innerHTML = '<p class="manual-error">Couldn’t load ' +
            Buddy.escapeHtml(filePath) +
            '. This needs to be served over http(s) (e.g. via GitHub Pages or a local dev server) rather than opened directly from disk.</p>';
        }
      });
  }

  function open(appKey, openModalFn, closeModalFn) {
    openDoc(openModalFn, 'Manual', 'README.md');
  }

  function openLicense(appKey, openModalFn, closeModalFn) {
    openDoc(openModalFn, 'License', 'LICENSE.md');
  }

  window.Buddy = window.Buddy || {};
  window.Buddy.manual = { open: open, openLicense: openLicense };
})();
