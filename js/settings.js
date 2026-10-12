
(function () {
  'use strict';

  function getHeartBurstLayer() {
    var layer = document.getElementById('heartBurstLayer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'heartBurstLayer';
      layer.className = 'heart-burst-layer';
      document.body.appendChild(layer);
    }
    return layer;
  }


  function spawnHeartBurst(x, y) {
    if (Buddy.theme.isMotionReduced()) return;
    var layer = getHeartBurstLayer();
    var count = 14;
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('span');
      particle.className = 'heart-particle';
      particle.innerHTML = Buddy.ICONS.heartFilled;

      var size = Math.round(12 + Math.random() * 14);
      var driftX = Math.round(Math.random() * 160 - 80);
      var fallY = Math.round(120 + Math.random() * 120);
      var rotate = Math.round(Math.random() * 70 - 35);
      var duration = Math.round(900 + Math.random() * 700);
      var delay = Math.round(Math.random() * 150);

      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.setProperty('--drift-x', driftX + 'px');
      particle.style.setProperty('--fall-y', fallY + 'px');
      particle.style.setProperty('--rotate', rotate + 'deg');
      particle.style.animationDuration = duration + 'ms';
      particle.style.animationDelay = delay + 'ms';

      particle.addEventListener('animationend', function () {
        this.remove();
      });

      layer.appendChild(particle);
    }
  }

  function spawnThankYouText(x, y) {
    if (Buddy.theme.isMotionReduced()) return;
    var layer = getHeartBurstLayer();
    var el = document.createElement('span');
    el.className = 'thank-you-text';
    el.textContent = 'Thank you!';
    el.style.left = x + 'px';
    el.style.top = (y - 15) + 'px';
    el.addEventListener('animationend', function () {
      this.remove();
    });
    layer.appendChild(el);
  }

  function open(appKey, openModalFn, closeModalFn, opts) {
    opts = opts || {};
    var ICONS = Buddy.ICONS;
    var escapeHtml = Buddy.escapeHtml;
    var currentTheme = Buddy.theme.currentThemeMode(appKey);
    var currentAccent = document.documentElement.getAttribute('data-accent') || 'indigo';
    var currentMotion = Buddy.theme.currentMotionMode();

    var themeHtml =
      '<div class="theme-toggle-group">' +
      '<button type="button" class="theme-option' + (currentTheme === 'light' ? ' active' : '') + '" data-theme-choice="light" title="Light" aria-label="Light theme">' +
      ICONS.sun + '</button>' +
      '<button type="button" class="theme-option' + (currentTheme === 'dark' ? ' active' : '') + '" data-theme-choice="dark" title="Dark" aria-label="Dark theme">' +
      ICONS.moon + '</button>' +
      '<button type="button" class="theme-option' + (currentTheme === 'system' ? ' active' : '') + '" data-theme-choice="system" title="System" aria-label="System theme">' +
      Buddy.icon('restore') + '</button>' +
      '</div>';

    var accentHtml = Buddy.theme.ACCENTS.map(function (a) {
      var activeClass = a.id === currentAccent ? ' active' : '';
      return '<button type="button" class="accent-swatch' + activeClass + '" data-accent-choice="' + a.id + '" ' +
        'title="' + escapeHtml(a.label) + '" aria-label="' + escapeHtml(a.label) + '">' +
        ICONS.check + '</button>';
    }).join('');

    var subtitle = 'App v' + (opts.appVersion || '000.000') + ' · CDN v' + (Buddy.CDN_VERSION || '000.000');

    var motionHtml =
      '<div class="motion-toggle-group" role="group" aria-label="Motion">' +
      '<button type="button" class="motion-option' + (currentMotion === 'on' ? ' active' : '') + '" data-motion-choice="on" title="On" aria-label="Motion on">' +
      ICONS.zap + '</button>' +
      '<button type="button" class="motion-option' + (currentMotion === 'reduced' ? ' active' : '') + '" data-motion-choice="reduced" title="Reduced" aria-label="Reduced motion">' +
      Buddy.icon('pause') + '</button>' +
      '<button type="button" class="motion-option' + (currentMotion === 'system' ? ' active' : '') + '" data-motion-choice="system" title="System" aria-label="System motion setting">' +
      Buddy.icon('restore') + '</button>' +
      '</div>';

    var html =
      '<div class="settings-row">' +
      '<div class="form-group">' +
      '<label>Theme</label>' +
      themeHtml +
      '</div>' +
      '<div class="form-group">' +
      '<label>Accent</label>' +
      '<div class="accent-swatch-list">' + accentHtml + '</div>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Motion</label>' +
      motionHtml +
      '</div>' +
      '</div>' +
      (opts.extraHtml || '') +
      '<div class="modal-actions-split">' +
      '<div class="settings-footer-text">' +
      '<p class="settings-credit">Made with <button type="button" class="heart-trigger" id="heartTrigger" aria-label="Made with love">' + ICONS.heart + '</button> by ' +
      '<a class="credit-link" href="https://github.com/isafuianish-dev" target="_blank" rel="noopener noreferrer">Anish Safui</a></p>' +
      '<p class="settings-license"><a class="credit-link" href="https://isafuianish-dev.github.io/webapp_myAppsBuddy/">Other apps</a> &middot; ' +
      '<button type="button" class="credit-link credit-link-btn" id="btnOpenManual">Manual</button> &middot; ' +
      '<a class="credit-link" href="https://github.com/isafuianish-dev/' + appKey + '" target="_blank" rel="noopener noreferrer">Source code</a> &middot; ' +
      '<button type="button" class="credit-link credit-link-btn" id="btnOpenLicense">License</button></p>' +
      '</div>' +
      '<button type="button" class="btn btn-primary" id="btnCloseSettings">Done</button>' +
      '</div>';

    openModalFn('Settings', html, function (body) {
      var themeButtons = body.querySelectorAll('[data-theme-choice]');
      themeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          Buddy.theme.applyTheme(appKey, btn.getAttribute('data-theme-choice'));
          themeButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        });
      });

      var accentButtons = body.querySelectorAll('[data-accent-choice]');
      accentButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          Buddy.theme.applyAccent(appKey, btn.getAttribute('data-accent-choice'));
          accentButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        });
      });

      var motionButtons = body.querySelectorAll('[data-motion-choice]');
      motionButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          Buddy.theme.applyMotion(btn.getAttribute('data-motion-choice'));
          motionButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        });
      });

      body.querySelector('#btnCloseSettings').addEventListener('click', closeModalFn);

      var btnOpenManual = body.querySelector('#btnOpenManual');
      if (btnOpenManual && window.Buddy && Buddy.manual) {
        btnOpenManual.addEventListener('click', function () {
          Buddy.manual.open(appKey, openModalFn, closeModalFn);
        });
      }

      var btnOpenLicense = body.querySelector('#btnOpenLicense');
      if (btnOpenLicense && window.Buddy && Buddy.manual) {
        btnOpenLicense.addEventListener('click', function () {
          Buddy.manual.openLicense(appKey, openModalFn, closeModalFn);
        });
      }

      body.querySelector('#heartTrigger').addEventListener('click', function (e) {
        var rect = e.currentTarget.getBoundingClientRect();
        var x = rect.left + rect.width / 2;
        var y = rect.top + rect.height / 2;
        spawnHeartBurst(x, y);
        spawnThankYouText(x, y);
      });

      if (typeof opts.onMount === 'function') opts.onMount(body);
    }, { autoSize: true, subtitle: subtitle });
  }

  window.Buddy = window.Buddy || {};
  window.Buddy.settings = { open: open };
})();
