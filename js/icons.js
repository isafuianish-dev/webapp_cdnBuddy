
(function () {
  'use strict';

  var SVG_BASE = 'https://isafuianish-dev.github.io/webapp_cdnBuddy/svg/';

  var ICON_NAMES = [
    'activity', 'alertTriangle', 'archive', 'award', 'barChart', 'bing', 'book', 'bookOpen',
    'bookmark', 'braces', 'briefcase', 'calendar', 'check', 'checkCircle', 'chevronDown',
    'chevronLeft', 'chevronRight', 'chevronUp', 'cloud', 'cloudDrizzle', 'cloudLightning',
    'cloudRain', 'cloudSnow', 'cloudSun', 'columns', 'compass', 'copy', 'creditCard',
    'database', 'download', 'duckduckgo', 'edit', 'entertainment', 'eye', 'eyeOff', 'fileText', 'fileTextLines',
    'globe', 'google', 'grid', 'hash', 'heart', 'heartFilled', 'helpCircle', 'house', 'key', 'layers', 'list', 'lock', 'maximize',
    'minimize', 'misc', 'moon', 'output', 'pin', 'pinFilled', 'play', 'plus', 'repeat',
    'repeatAlt', 'restore', 'search', 'send', 'settings', 'shoppingBag', 'shoppingCart',
    'spinner', 'sun', 'target', 'timer', 'toc', 'transport', 'trash', 'trendingUp', 'upload', 'users',
    'utensils', 'wallet', 'wallet2', 'x', 'xCircle', 'youtube', 'zap'
  ];

  function icon(name) {
    var url = SVG_BASE + name + '.svg';
    return '<i class="icon" style="-webkit-mask-image:url(' + url + ');mask-image:url(' + url + ');" aria-hidden="true"></i>';
  }

  var ICONS = {};
  ICON_NAMES.forEach(function (name) { ICONS[name] = icon(name); });

  window.Buddy = window.Buddy || {};
  window.Buddy.icon = icon;
  window.Buddy.ICONS = ICONS;
})();
