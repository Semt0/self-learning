/* client.js — 主题切换 / 全文搜索 / 侧边栏抽屉 / TOC 滚动高亮 */
(function () {
  'use strict';

  var root = document.documentElement.dataset.root || './';

  /* ---------------- 主题 ---------------- */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------------- 移动端侧边栏 ---------------- */
  var sideToggle = document.getElementById('sidebar-toggle');
  var sideMask = document.getElementById('sidebar-mask');
  function closeSidebar() { document.body.classList.remove('sidebar-open'); }
  if (sideToggle) {
    sideToggle.addEventListener('click', function () {
      document.body.classList.toggle('sidebar-open');
    });
  }
  if (sideMask) sideMask.addEventListener('click', closeSidebar);
  document.querySelectorAll('.side-link, .side-home, .side-course').forEach(function (a) {
    a.addEventListener('click', closeSidebar);
  });

  /* ---------------- 搜索 ---------------- */
  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var index = null;
  var loading = false;
  var selected = -1;
  var currentResults = [];

  function loadIndex() {
    if (index || loading) return;
    loading = true;
    fetch(root + 'search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; loading = false; runSearch(); })
      .catch(function () { loading = false; });
  }

  function openSearch() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    renderHint('输入关键词开始搜索');
    loadIndex();
    setTimeout(function () { input.focus(); }, 30);
  }

  function closeSearch() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    selected = -1;
  }

  function renderHint(text) {
    resultsEl.innerHTML = '<li class="search-empty">' + text + '</li>';
    currentResults = [];
    selected = -1;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(text, terms) {
    var out = escapeHtml(text);
    terms.forEach(function (t) {
      if (!t) return;
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function score(item, terms) {
    var s = 0;
    var title = (item.title || '').toLowerCase();
    var heads = (item.headings || []).join(' ').toLowerCase();
    var tags = (item.tags || []).join(' ').toLowerCase();
    var text = (item.text || '').toLowerCase();
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (!t) continue;
      if (title.indexOf(t) !== -1) s += 10;
      if (tags.indexOf(t) !== -1) s += 6;
      if (heads.indexOf(t) !== -1) s += 4;
      if (text.indexOf(t) !== -1) s += 1;
      else if (s === 0) return 0; // 全部词都至少要命中某处
    }
    return s;
  }

  function snippet(item, terms) {
    var text = item.text || '';
    var lower = text.toLowerCase();
    var pos = -1;
    for (var i = 0; i < terms.length; i++) {
      var p = lower.indexOf(terms[i]);
      if (p !== -1 && (pos === -1 || p < pos)) pos = p;
    }
    if (pos === -1) return text.slice(0, 120);
    var start = Math.max(0, pos - 40);
    return (start > 0 ? '…' : '') + text.slice(start, start + 160) + '…';
  }

  function runSearch() {
    var q = input.value.trim().toLowerCase();
    if (!q) { renderHint('输入关键词开始搜索'); return; }
    if (!index) { renderHint('索引加载中……'); return; }
    var terms = q.split(/\s+/);
    currentResults = index
      .map(function (item) { return { item: item, s: score(item, terms) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 12);

    if (!currentResults.length) { renderHint('没有找到「' + escapeHtml(q) + '」相关内容'); return; }

    resultsEl.innerHTML = currentResults.map(function (r, i) {
      var it = r.item;
      return '<li data-i="' + i + '"><a href="' + root + it.url + '">' +
        '<div class="sr-top"><span class="sr-course">' + escapeHtml(it.course || '') +
        (it.lecture ? ' · ' + escapeHtml(it.lecture) : '') + '</span>' +
        '<span class="sr-title">' + highlight(it.title || '', terms) + '</span></div>' +
        '<div class="sr-snippet">' + highlight(snippet(it, terms), terms) + '</div>' +
        '</a></li>';
    }).join('');

    selected = 0;
    updateSelection();
    resultsEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeSearch);
    });
  }

  function updateSelection() {
    resultsEl.querySelectorAll('li').forEach(function (li) {
      li.classList.toggle('is-selected', Number(li.dataset.i) === selected);
    });
    var el = resultsEl.querySelector('li[data-i="' + selected + '"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  var debounce;
  if (input) {
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(runSearch, 120);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, currentResults.length - 1); updateSelection(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); updateSelection(); }
      else if (e.key === 'Enter' && currentResults[selected]) {
        closeSearch();
        location.href = root + currentResults[selected].item.url;
      }
    });
  }

  document.querySelectorAll('#search-open, #search-cta').forEach(function (btn) {
    btn.addEventListener('click', openSearch);
  });
  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  }
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.hidden ? openSearch() : closeSearch(); }
    else if (e.key === '/' && overlay.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape' && !overlay.hidden) closeSearch();
  });

  /* ---------------- TOC 滚动高亮 ---------------- */
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length) {
    var map = {};
    var heads = [];
    tocLinks.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      var h = document.getElementById(id);
      if (h) { map[id] = a; heads.push(h); }
    });
    var spy = function () {
      var pos = window.scrollY + 100;
      var activeId = null;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].offsetTop <= pos) activeId = heads[i].id;
        else break;
      }
      tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
      if (activeId && map[activeId]) map[activeId].classList.add('is-active');
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
})();
