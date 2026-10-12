
(function () {
  'use strict';

  var CDN_VERSION = '001.001';

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatCurrency(n) {
    var v = Math.round(((n || 0) + Number.EPSILON) * 100) / 100;
    return '$' + v.toFixed(2);
  }

  window.Buddy = window.Buddy || {};
  window.Buddy.CDN_VERSION = CDN_VERSION;
  window.Buddy.escapeHtml = escapeHtml;
  window.Buddy.formatDate = formatDate;
  window.Buddy.formatCurrency = formatCurrency;
})();
