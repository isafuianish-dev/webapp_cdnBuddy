
(function () {
  'use strict';

  var DEFAULT_COLORS = ['#4f46e5', '#2563eb', '#16a34a', '#e11d48', '#d97706', '#7c3aed', '#eab308', '#0891b2'];

  function getConfettiLayer() {
    var layer = document.getElementById('confettiLayer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'confettiLayer';
      layer.className = 'confetti-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    return layer;
  }

  function spawnConfetti(colors, count, squareOnly) {
    var reduced = (window.Buddy && Buddy.theme && Buddy.theme.isMotionReduced)
      ? Buddy.theme.isMotionReduced()
      : (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) return;
    colors = (colors && colors.length) ? colors : DEFAULT_COLORS;
    count = count || 60;
    var layer = getConfettiLayer();

    for (var i = 0; i < count; i++) {
      var piece = document.createElement('span');
      piece.className = 'confetti-piece';

      var left = Math.random() * 100;
      var driftX = Math.round(Math.random() * 200 - 100);
      var fallY = window.innerHeight + 40;
      var spin = Math.round(Math.random() * 720 - 360);
      var duration = Math.round(1800 + Math.random() * 1400);
      var delay = Math.round(Math.random() * 400);
      var color = colors[Math.floor(Math.random() * colors.length)];

      piece.style.left = left + 'vw';
      piece.style.setProperty('--drift-x', driftX + 'px');
      piece.style.setProperty('--fall-y', fallY + 'px');
      piece.style.setProperty('--spin', spin + 'deg');
      piece.style.setProperty('--confetti-color', color);
      piece.style.animationDuration = duration + 'ms';
      piece.style.animationDelay = delay + 'ms';
      if (!squareOnly && Math.random() < 0.5) piece.style.borderRadius = '50%';

      piece.addEventListener('animationend', function () {
        this.remove();
      });

      layer.appendChild(piece);
    }
  }

  window.Buddy = window.Buddy || {};
  window.Buddy.spawnConfetti = spawnConfetti;
})();
