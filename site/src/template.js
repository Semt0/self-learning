/**
 * template.js — HTML 页面模板
 * 纯字符串模板，所有内部链接使用相对路径（根页面用 ./，课程页用 ../），
 * 保证站点在任意 base path（GitHub Pages 项目页 / 本地预览）下都可用。
 */

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4Z"/><circle cx="7" cy="7" r="1.2"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4 10 14M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>',
};

/* ------------------------------------------------------------ 共享部分 */

function sidebar(site, active, root) {
  const groups = site.courses.map((c) => {
    const items = c.notes.map((n) => {
      const url = `${c.dir}/${n.slug}.html`;
      const isActive = active === url;
      return `<li><a class="side-link${isActive ? ' is-active' : ''}" href="${root}${url}">
        ${n.lecture ? `<span class="side-lec">${esc(n.lecture)}</span>` : ''}
        <span class="side-title">${esc(shortTitle(n))}</span>
      </a></li>`;
    }).join('');
    return `<section class="side-group">
      <a class="side-course" href="${root}${c.dir}/index.html">${esc(c.name)}<span class="side-count">${c.noteCount}</span></a>
      <ul>${items}</ul>
    </section>`;
  }).join('');
  return `<nav class="side-nav" aria-label="课程导航">
    <a class="side-home" href="${root}index.html">${ICONS.home}<span>首页</span></a>
    ${groups}
  </nav>`;
}

function shortTitle(n) {
  // 标题形如 "L2 Imitation Learning" 时，列表里只显示主题部分
  const t = n.title || n.slug;
  const m = t.match(/^[Ll](\d+)\s+(.+)$/);
  return m ? m[2] : t;
}

function topbar(root) {
  return `<header class="topbar">
    <button class="icon-btn only-mobile" id="sidebar-toggle" aria-label="打开导航">${ICONS.menu}</button>
    <a class="brand" href="${root}index.html">${ICONS.book}<span>Self-Learning</span><em>课程笔记</em></a>
    <div class="topbar-spacer"></div>
    <button class="search-btn" id="search-open" aria-label="搜索">
      ${ICONS.search}<span>搜索笔记</span><kbd>⌘K</kbd>
    </button>
    <a class="icon-btn" href="https://github.com/Semt0/self-learning" target="_blank" rel="noopener" aria-label="GitHub 仓库">${ICONS.github}</a>
    <button class="icon-btn" id="theme-toggle" aria-label="切换主题">${ICONS.sun}${ICONS.moon}</button>
  </header>`;
}

function searchOverlay() {
  return `<div class="search-overlay" id="search-overlay" hidden>
    <div class="search-dialog" role="dialog" aria-modal="true" aria-label="搜索">
      <div class="search-input-row">
        ${ICONS.search}
        <input id="search-input" type="search" placeholder="搜索标题、标签、正文……" autocomplete="off" spellcheck="false">
        <kbd>esc</kbd>
      </div>
      <ul class="search-results" id="search-results"></ul>
      <p class="search-hint">↑↓ 选择 · Enter 跳转 · 支持标题 / 标签 / 正文全文</p>
    </div>
  </div>`;
}

function layout({ site, root, active, title, description, bodyClass = '', main, toc = '' }) {
  return `<!doctype html>
<html lang="zh-CN" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Self-Learning</title>
<meta name="description" content="${esc(description || '个人自学课程笔记')}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>">
<link rel="stylesheet" href="${root}katex/katex.min.css">
<link rel="stylesheet" href="${root}style.css">
<script>
(function(){var t=localStorage.getItem('theme');
if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}
else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark';}})();
</script>
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">跳到正文</a>
${topbar(root)}
<div class="layout">
  <aside class="sidebar" id="sidebar">${sidebar(site, active, root)}</aside>
  <div class="sidebar-mask" id="sidebar-mask"></div>
  <main class="main" id="main">${main}</main>
  ${toc ? `<aside class="toc-col"><nav class="toc" aria-label="本页目录"><p class="toc-head">本页目录</p>${toc}</nav></aside>` : '<div class="toc-col"></div>'}
</div>
${searchOverlay()}
<script src="${root}client.js" defer></script>
</body>
</html>`;
}

function tagPills(tags = []) {
  if (!tags.length) return '';
  return `<div class="tags">${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
}

function statusBadge(note) {
  if (!note.status) return '';
  return `<span class="status status--${esc(note.status)}">${esc(note.statusLabel || note.status)}</span>`;
}

function tocHtml(note) {
  if (!note.toc || !note.toc.length) return '';
  return `<ul>${note.toc.map((t) =>
    `<li class="toc-lv${t.depth}"><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ul>`;
}

/* -------------------------------------------------------------- 页面 */

export function renderNotePage({ site, course, note, prev, next }) {
  const root = '../';
  const active = `${course.dir}/${note.slug}.html`;

  const sourceLinks = note.sources.map((s) => {
    if (typeof s === 'string') return `<a href="${esc(s)}" target="_blank" rel="noopener">链接 ${ICONS.external}</a>`;
    return Object.entries(s).filter(([, v]) => v).map(([k, v]) =>
      `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ${ICONS.external}</a>`).join('');
  }).join('');

  const crumbs = `<nav class="crumbs" aria-label="面包屑">
    <a href="../index.html">首页</a><span class="crumb-sep">/</span>
    <a href="./index.html">${esc(course.name)}</a><span class="crumb-sep">/</span>
    <span class="crumb-current">${esc(shortTitle(note))}</span>
  </nav>`;

  const meta = `<header class="note-head">
    <h1>${esc(note.title)}</h1>
    <div class="note-meta">
      ${note.lecture ? `<span class="meta-item">${esc(note.lecture)}</span>` : ''}
      ${note.date ? `<span class="meta-item"><time datetime="${esc(note.date)}">${esc(note.date)}</time></span>` : ''}
      ${statusBadge(note)}
      ${sourceLinks ? `<span class="meta-item meta-sources">${sourceLinks}</span>` : ''}
    </div>
    ${tagPills(note.tags)}
  </header>`;

  const prevNext = `<nav class="prev-next">
    ${prev
      ? `<a class="pn-link pn-prev" href="./${prev.slug}.html">${ICONS.arrowLeft}<span><small>${esc(prev.lecture || '上一篇')}</small>${esc(shortTitle(prev))}</span></a>`
      : '<span></span>'}
    ${next
      ? `<a class="pn-link pn-next" href="./${next.slug}.html"><span><small>${esc(next.lecture || '下一篇')}</small>${esc(shortTitle(next))}</span>${ICONS.arrowRight}</a>`
      : '<span></span>'}
  </nav>`;

  const main = `${crumbs}<article class="note">${meta}<div class="note-body">${note.html}</div>${prevNext}</article>`;

  return layout({
    site, root, active,
    title: `${note.title} · ${course.name}`,
    description: `${course.name} 课程笔记：${note.title}`,
    main, toc: tocHtml(note),
  });
}

export function renderCoursePage({ site, course, readmeHtml }) {
  const root = '../';
  const active = `${course.dir}/`;
  const latest = course.notes.map((n) => n.date).filter(Boolean).sort().pop() || '';

  const cards = course.notes.map((n) => `<a class="lec-card" href="./${n.slug}.html">
      <div class="lec-card-top">
        ${n.lecture ? `<span class="lec-no">${esc(n.lecture)}</span>` : ''}
        ${statusBadge(n)}
      </div>
      <h3>${esc(shortTitle(n))}</h3>
      ${n.date ? `<time datetime="${esc(n.date)}">${esc(n.date)}</time>` : ''}
    </a>`).join('');

  const links = course.links.length
    ? `<div class="course-links">${course.links.map((l) =>
        `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || l.url)} ${ICONS.external}</a>`).join('')}</div>`
    : '';

  const main = `
  <header class="course-head">
    <p class="eyebrow">课程</p>
    <h1>${esc(course.name)}</h1>
    ${course.description ? `<p class="course-desc">${esc(course.description)}</p>` : ''}
    <div class="course-stats">
      <span>${course.notes.length} 篇笔记</span>
      ${latest ? `<span>最近更新 ${esc(latest)}</span>` : ''}
    </div>
    ${links}
  </header>
  <section class="lec-grid">${cards}</section>
  ${readmeHtml ? `<article class="note course-readme"><h2>课程说明</h2><div class="note-body">${readmeHtml}</div></article>` : ''}`;

  return layout({
    site, root, active,
    title: course.name,
    description: course.description || `${course.name} 课程笔记`,
    bodyClass: 'course-page',
    main,
  });
}

export function renderHomePage({ site }) {
  const root = './';
  const allNotes = site.courses
    .flatMap((c) => c.notes.map((n) => ({ ...n, course: c.name, dir: c.dir })))
    .filter((n) => n.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  const cards = site.courses.map((c) => `<a class="course-card" href="./${c.dir}/index.html">
      <div class="course-card-bar"></div>
      <h2>${esc(c.name)}</h2>
      <p>${esc(c.description || '课程笔记与作业')}</p>
      <div class="course-card-foot">
        <span>${c.noteCount} 篇笔记</span>
        ${c.lastUpdated ? `<span>更新于 ${esc(c.lastUpdated)}</span>` : ''}
      </div>
    </a>`).join('');

  const recent = allNotes.slice(0, 8).map((n) => `<li>
      <a href="./${n.dir}/${n.slug}.html">
        <span class="recent-course">${esc(n.course)}</span>
        <span class="recent-title">${esc(n.title)}</span>
        <time datetime="${esc(n.date)}">${esc(n.date)}</time>
      </a>
    </li>`).join('');

  const main = `
  <section class="hero">
    <p class="eyebrow">Self-Learning Notes</p>
    <h1>课程学习<span class="grad">笔记</span></h1>
    <p class="hero-sub">持续更新的自学课程笔记仓库 · ${site.courses.length} 门课程 · ${site.totalNotes} 篇笔记</p>
    <div class="hero-actions">
      <button class="search-cta" id="search-cta">${ICONS.search} 搜索全部笔记 <kbd>⌘K</kbd></button>
    </div>
  </section>
  <section>
    <h2 class="section-title">课程</h2>
    <div class="course-grid">${cards}</div>
  </section>
  ${recent ? `<section>
    <h2 class="section-title">最近更新</h2>
    <ul class="recent-list">${recent}</ul>
  </section>` : ''}`;

  return layout({
    site, root, active: '',
    title: '首页',
    description: '个人自学课程笔记',
    bodyClass: 'home-page',
    main,
  });
}
