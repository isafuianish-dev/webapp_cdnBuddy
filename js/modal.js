
(function () {
  'use strict';

  function ensureShell() {
    var overlay = document.getElementById('modalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'modalOverlay';
      overlay.hidden = true;
      overlay.innerHTML =
        '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
        '<div class="modal-header">' +
        '<div class="modal-header-titles">' +
        '<h3 id="modalTitle"></h3>' +
        '<p class="modal-subtitle" id="modalSubtitle" hidden></p>' +
        '</div>' +
        '<button class="modal-close" id="modalClose" aria-label="Close dialog"></button>' +
        '</div>' +
        '<div class="modal-body" id="modalBody"></div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    return {
      modalOverlay: overlay,
      modal: overlay.querySelector('#modal'),
      modalTitle: overlay.querySelector('#modalTitle'),
      modalSubtitle: overlay.querySelector('#modalSubtitle'),
      modalClose: overlay.querySelector('#modalClose'),
      modalBody: overlay.querySelector('#modalBody')
    };
  }

  function init() {
    var dom = ensureShell();
    dom.modalClose.innerHTML = (window.Buddy && Buddy.ICONS && Buddy.ICONS.x) || '';

    function open(title, bodyHtml, onMount, opts) {
      opts = opts || {};
      dom.modal.classList.toggle('modal-auto', !!opts.autoSize);
      dom.modal.classList.toggle('modal-wide', !!opts.wide);
      dom.modal.classList.toggle('modal-manual', !!opts.manual);
      dom.modal.classList.toggle('modal-force-choice', !!opts.forceChoice);
      dom.modalTitle.textContent = title;
      dom.modalSubtitle.textContent = opts.subtitle || '';
      dom.modalSubtitle.hidden = !opts.subtitle;
      dom.modalBody.innerHTML = bodyHtml;
      dom.modalOverlay.hidden = false;
      if (typeof onMount === 'function') onMount(dom.modalBody);
    }

    function close() {
      dom.modalOverlay.hidden = true;
      dom.modalBody.innerHTML = '';
      dom.modal.classList.remove('modal-auto', 'modal-wide', 'modal-manual', 'modal-force-choice');
    }

    function guardedClose() {
      if (dom.modal.classList.contains('modal-force-choice')) return;
      close();
    }

    dom.modalClose.addEventListener('click', guardedClose);
    dom.modalOverlay.addEventListener('click', function (e) {
      if (e.target === dom.modalOverlay) guardedClose();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !dom.modalOverlay.hidden) guardedClose();
    });

    return { open: open, close: close, dom: dom };
  }

  window.Buddy = window.Buddy || {};
  window.Buddy.modal = { init: init };
})();
