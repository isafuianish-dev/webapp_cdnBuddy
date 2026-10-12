
(function () {
  'use strict';

  var SENTINEL = '';
  var HR_RE = /^ {0,3}([-*_])(?: *\1){2,} *$/;
  var HEADING_RE = /^ {0,3}(#{1,6})(?:\s+(.*?))?\s*#*\s*$/;
  var QUOTE_RE = /^ {0,3}> ?/;
  var QUOTE_LINE_RE = /^ {0,3}>/;
  var UL_RE = /^ {0,3}[-*+]\s+(.*)$/;
  var OL_RE = /^ {0,3}\d+\.\s+(.*)$/;
  var FENCE_RE = /^ {0,3}```/;
  var CODE_TOKEN_RE = new RegExp(SENTINEL + '(\\d+)' + SENTINEL, 'g');
  var CALLOUT_RE = /^\[!(WARNING|ERROR|SUCCESS)\]$/i;
  var CALLOUT_ICONS = { warning: 'alertTriangle', error: 'xCircle', success: 'checkCircle' };
  var TABLE_CELL_RE = /^:?-+:?$/;

  function isSafeUrl(url) {
    var m = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(url);
    if (!m) return true;
    var scheme = m[1].toLowerCase();
    return scheme === 'http' || scheme === 'https' || scheme === 'mailto';
  }



  function renderInline(raw) {
    var text = Buddy.escapeHtml(raw);





    var codeStore = [];
    text = text.replace(/`([^`]+)`/g, function (m, code) {
      codeStore.push(code);
      return SENTINEL + (codeStore.length - 1) + SENTINEL;
    });

    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
      if (!isSafeUrl(url)) return label;



      var attrs = url.charAt(0) === '#' ? '' : ' target="_blank" rel="noopener noreferrer"';
      return '<a href="' + url + '"' + attrs + '>' + label + '</a>';
    });

    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/\b_(.+?)_\b/g, '<em>$1</em>');
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');



    text = text.replace(/ {2,}\n/g, '<br>\n').replace(/\n/g, ' ');

    text = text.replace(CODE_TOKEN_RE, function (m, idx) {
      return '<code>' + codeStore[Number(idx)] + '</code>';
    });

    return text;
  }



  function splitTableRow(line) {
    var trimmed = line.trim();
    if (trimmed.charAt(0) === '|') trimmed = trimmed.slice(1);
    if (trimmed.charAt(trimmed.length - 1) === '|' && trimmed.charAt(trimmed.length - 2) !== '\\') {
      trimmed = trimmed.slice(0, -1);
    }

    var cells = [];
    var current = '';
    for (var j = 0; j < trimmed.length; j++) {
      var ch = trimmed.charAt(j);
      if (ch === '\\' && trimmed.charAt(j + 1) === '|') {
        current += '|';
        j++;
      } else if (ch === '|') {
        cells.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    return cells;
  }




  function parseTableAligns(delimLine) {
    var cells = splitTableRow(delimLine);
    var aligns = [];
    for (var j = 0; j < cells.length; j++) {
      if (!TABLE_CELL_RE.test(cells[j])) return null;
      var left = cells[j].charAt(0) === ':';
      var right = cells[j].charAt(cells[j].length - 1) === ':';
      aligns.push(left && right ? 'center' : right ? 'right' : left ? 'left' : '');
    }
    return aligns;
  }

  function tableCellHtml(tag, text, align) {
    var attr = align ? ' style="text-align:' + align + '"' : '';
    return '<' + tag + attr + '>' + renderInline(text) + '</' + tag + '>';
  }








  function slugifyHeading(raw, seen) {
    var tmp = document.createElement('div');
    tmp.innerHTML = renderInline(raw);
    var text = tmp.textContent || '';
    var slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s/g, '-');
    var count = seen[slug] || 0;
    seen[slug] = count + 1;
    return count === 0 ? slug : slug + '-' + count;
  }



  function renderBlocks(markdown, slugCounts) {
    slugCounts = slugCounts || {};
    var lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      if (line.trim() === '') {
        i++;
        continue;
      }

      if (FENCE_RE.test(line)) {
        var lang = line.trim().slice(3).trim();
        var codeLines = [];
        i++;
        while (i < lines.length && !FENCE_RE.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        var langClass = lang ? ' class="language-' + Buddy.escapeHtml(lang) + '"' : '';
        out.push('<pre><code' + langClass + '>' + Buddy.escapeHtml(codeLines.join('\n')) + '</code></pre>');
        continue;
      }

      if (HR_RE.test(line)) {
        out.push('<hr>');
        i++;
        continue;
      }

      var headingMatch = HEADING_RE.exec(line);
      if (headingMatch) {
        var level = headingMatch[1].length;
        var headingText = headingMatch[2] || '';
        var headingId = slugifyHeading(headingText, slugCounts);
        out.push('<h' + level + ' id="' + headingId + '">' + renderInline(headingText) + '</h' + level + '>');
        i++;
        continue;
      }

      if (line.indexOf('|') !== -1 && i + 1 < lines.length) {
        var tableAligns = parseTableAligns(lines[i + 1]);
        if (tableAligns) {
          var headerCells = splitTableRow(line);
          if (headerCells.length === tableAligns.length) {
            var theadHtml = '<tr>' + headerCells.map(function (cell, idx) {
              return tableCellHtml('th', cell, tableAligns[idx]);
            }).join('') + '</tr>';
            i += 2;
            var bodyRowsHtml = [];
            while (i < lines.length && lines[i].trim() !== '' && lines[i].indexOf('|') !== -1 && !QUOTE_LINE_RE.test(lines[i])) {
              var rowCells = splitTableRow(lines[i]);
              bodyRowsHtml.push('<tr>' + tableAligns.map(function (align, idx) {
                return tableCellHtml('td', rowCells[idx] || '', align);
              }).join('') + '</tr>');
              i++;
            }
            var tbodyHtml = bodyRowsHtml.length ? '<tbody>' + bodyRowsHtml.join('') + '</tbody>' : '';
            out.push('<table><thead>' + theadHtml + '</thead>' + tbodyHtml + '</table>');
            continue;
          }
        }
      }

      if (QUOTE_LINE_RE.test(line)) {
        var quoteLines = [];
        while (i < lines.length && QUOTE_LINE_RE.test(lines[i])) {
          quoteLines.push(lines[i].replace(QUOTE_RE, ''));
          i++;
        }




        var calloutMatch = CALLOUT_RE.exec(quoteLines[0].trim());
        if (calloutMatch) {
          var calloutType = calloutMatch[1].toLowerCase();
          var calloutIcon = (Buddy.ICONS && Buddy.ICONS[CALLOUT_ICONS[calloutType]]) || '';
          out.push('<div class="callout callout-' + calloutType + '">' +
            '<span class="callout-icon">' + calloutIcon + '</span>' +
            '<div class="callout-body">' + renderBlocks(quoteLines.slice(1).join('\n'), slugCounts).join('\n') + '</div>' +
            '</div>');
        } else {
          out.push('<blockquote>' + renderBlocks(quoteLines.join('\n'), slugCounts).join('\n') + '</blockquote>');
        }
        continue;
      }

      if (UL_RE.test(line) || OL_RE.test(line)) {
        var ordered = OL_RE.test(line);
        var itemRe = ordered ? OL_RE : UL_RE;
        var items = [];
        while (i < lines.length && itemRe.test(lines[i])) {
          items.push(itemRe.exec(lines[i])[1]);
          i++;
        }
        var tag = ordered ? 'ol' : 'ul';
        var itemsHtml = items.map(function (item) { return '<li>' + renderInline(item) + '</li>'; }).join('');
        out.push('<' + tag + '>' + itemsHtml + '</' + tag + '>');
        continue;
      }

      var paraLines = [];
      while (i < lines.length && lines[i].trim() !== '') {
        paraLines.push(lines[i]);
        i++;
      }
      out.push('<p>' + renderInline(paraLines.join('\n')) + '</p>');
    }

    return out;
  }

  function render(markdown) {
    return renderBlocks(String(markdown == null ? '' : markdown), {}).join('\n');
  }

  window.Buddy = window.Buddy || {};
  window.Buddy.markdown = { render: render };
})();
