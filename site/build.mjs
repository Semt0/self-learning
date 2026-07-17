/**
 * build.mjs — 静态站点生成器
 *
 * 扫描仓库根目录下的所有课程目录（含 notes/ 的目录），把 Obsidian 风格的
 * Markdown 笔记渲染成静态 HTML，输出到 site/dist/。
 *
 * 支持的 Obsidian 语法：
 *   - YAML frontmatter（title / lecture / date / tags / status / sources / aliases）
 *   - wikilink：[[目标]] / [[目标|显示名]] / ![[图片.png]]
 *   - callout：> [!abstract] / [!info] / [!warning] / [!question] ...
 *   - 行内 / 块级数学公式（KaTeX）
 *   - 笔记顶部的 #tag 行 → 头部标签
 *
 * 扩展方式：新增课程 = 新建 <course>/notes/*.md；新增笔记 = 直接放 md 文件。
 * 课程元信息可在 <course>/course.json 中覆盖（name / description / links）。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit, SKIP } from 'unist-util-visit';
import { toString as mdToString } from 'mdast-util-to-string';
import YAML from 'yaml';

import { renderNotePage, renderHomePage, renderCoursePage } from './src/template.js';

const SITE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SITE_DIR, '..');
const DIST = path.join(SITE_DIR, 'dist');

const IGNORED_DIRS = new Set(['site', 'node_modules']);
const CALLOUT_TITLES = {
  abstract: '摘要', summary: '摘要', tldr: '摘要',
  info: '信息', note: '备注', tip: '提示', hint: '提示',
  warning: '注意', caution: '注意', danger: '危险',
  question: '思考', todo: '待办', example: '示例',
  quote: '引用', success: '结论', important: '重点',
};
const STATUS_LABELS = {
  draft: '草稿', wip: '进行中', done: '完成', final: '完成', review: '待复习',
};

/* ---------------------------------------------------------------- 工具 */

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~!@#$%^&*()=+\[\]{}\\|;:'",.<>/?！@#￥%……&*（）—【】「」、。，；：？！]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function readIfExists(p) {
  try { return await fs.readFile(p, 'utf8'); } catch { return null; }
}

async function copyDir(src, dest) {
  let entries;
  try { entries = await fs.readdir(src, { withFileTypes: true }); } catch { return; }
  await fs.mkdir(dest, { recursive: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isFile()) await fs.copyFile(s, d);
  }
}

/* ------------------------------------------------- Obsidian 语法转换插件 */

/**
 * remark 插件：处理 frontmatter、wikilink、callout、顶部 tag 行、
 * 标题 slug、图片路径重写、.md 链接重写，并收集 TOC / 纯文本。
 */
function remarkObsidian(options) {
  const { resolveNoteLink, resolveAsset, ctx } = options;

  return (tree) => {
    // --- frontmatter ---
    visit(tree, 'yaml', (node, index, parent) => {
      try { ctx.meta = YAML.parse(node.value) || {}; }
      catch { ctx.meta = {}; }
      if (parent && index != null) parent.children.splice(index, 1);
      return [SKIP, index];
    });

    // --- wikilink / 嵌入图片 ---
    const wikiRe = /(!?)\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/;
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index == null) return;
      if (!wikiRe.test(node.value)) return;
      const value = node.value;
      const re = new RegExp(wikiRe.source, 'g');
      const out = [];
      let last = 0;
      let m;
      while ((m = re.exec(value))) {
        if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
        const target = m[2].trim();
        const label = (m[3] || m[2]).trim();
        if (m[1] === '!') {
          out.push({ type: 'image', url: resolveAsset(target), alt: label, title: null });
        } else {
          const href = resolveNoteLink(target);
          if (href) {
            out.push({
              type: 'link', url: href,
              data: { hProperties: { className: ['wikilink'] } },
              children: [{ type: 'text', value: label }],
            });
          } else {
            out.push({
              type: 'wikiMissing',
              data: { hName: 'span', hProperties: { className: ['wikilink', 'wikilink--missing'], title: '笔记尚未创建' } },
              children: [{ type: 'text', value: label }],
            });
          }
        }
        last = m.index + m[0].length;
      }
      if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
      parent.children.splice(index, 1, ...out);
      return [SKIP, index + out.length];
    });

    // --- callout ---
    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;
      const t = first.children[0];
      if (!t || t.type !== 'text') return;
      const m = t.value.match(/^\[!([a-zA-Z-]+)\][+-]?[ \t]*/);
      if (!m) return;
      const type = m[1].toLowerCase();
      t.value = t.value.slice(m[0].length);
      // 标题：第一行剩余文本；没有则用默认名
      let title = '';
      const nl = t.value.indexOf('\n');
      title = (nl === -1 ? t.value : t.value.slice(0, nl)).trim();
      // 清掉第一段的标记与标题文本
      if (nl === -1) {
        first.children.shift();
      } else {
        t.value = t.value.slice(nl + 1);
        if (!t.value.trim()) first.children.shift();
      }
      if (first.children.length === 0 || !mdToString(first).trim()) {
        node.children.shift();
      }
      if (!title) title = CALLOUT_TITLES[type] || type;
      node.data = {
        hName: 'div',
        hProperties: { className: ['callout', `callout--${type}`], 'data-callout': type },
      };
      node.children = [
        {
          type: 'calloutTitle',
          data: { hName: 'p', hProperties: { className: ['callout-title'] } },
          children: [{ type: 'text', value: title }],
        },
        {
          type: 'calloutBody',
          data: { hName: 'div', hProperties: { className: ['callout-body'] } },
          children: node.children,
        },
      ];
    });

    // --- 去掉正文中第一个 H1（页面模板已渲染标题，避免重复） ---
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'heading' && node.depth === 1) {
        tree.children.splice(i, 1);
        break;
      }
    }

    // --- 顶部纯 #tag 段落 → 提取为标签 ---
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type !== 'paragraph') continue;
      const text = mdToString(node).trim();
      if (/^#[^\s#]+(\s+#[^\s#]+)*$/.test(text)) {
        ctx.inlineTags = text.split(/\s+/).map((s) => s.slice(1));
        tree.children.splice(i, 1);
      }
      break; // 只检查第一个段落
    }

    // --- 标题：加 id + 收集 TOC ---
    const usedIds = new Set();
    visit(tree, 'heading', (node) => {
      const text = mdToString(node);
      let id = slugify(text) || 'section';
      while (usedIds.has(id)) id = `${id}-1`;
      usedIds.add(id);
      node.data = node.data || {};
      node.data.hProperties = { ...(node.data.hProperties || {}), id };
      if (node.depth === 2 || node.depth === 3) {
        ctx.toc.push({ depth: node.depth, text, id });
      }
    });

    // --- 图片路径：../assets/x.png → assets/x.png ---
    visit(tree, 'image', (node) => {
      node.url = resolveAsset(node.url);
    });

    // --- 常规 .md 链接 → .html ---
    visit(tree, 'link', (node) => {
      if (/^https?:\/\//.test(node.url) || !node.url.endsWith('.md')) return;
      const href = resolveNoteLink(node.url.replace(/\.md$/, ''));
      if (href) node.url = href;
    });
  };
}

/* ------------------------------------------------------------ Markdown */

async function renderMarkdown(raw, pluginOptions) {
  const ctx = { meta: {}, toc: [], inlineTags: [] };
  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkObsidian, { ...pluginOptions, ctx })
    .use(remarkRehype)
    .use(rehypeKatex, { strict: 'ignore' })
    .use(rehypeHighlight, { detect: false })
    .use(rehypeStringify)
    .process(raw);
  return { html: String(file), ctx };
}

/* ------------------------------------------------------------- 主流程 */

async function main() {
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');

  // 1. 发现课程
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const courseDirs = [];
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('.') || IGNORED_DIRS.has(e.name)) continue;
    try {
      await fs.access(path.join(ROOT, e.name, 'notes'));
      courseDirs.push(e.name);
    } catch { /* 不是课程目录 */ }
  }
  courseDirs.sort();

  // 2. 读取课程元信息与笔记列表（先收集，再渲染，便于 wikilink 解析）
  const courses = [];
  const noteIndex = new Map(); // normalize(key) -> { course, file }
  const norm = (s) => s.toLowerCase().trim().replace(/^\.\//, '').replace(/^notes\//, '');

  for (const dir of courseDirs) {
    const coursePath = path.join(ROOT, dir);
    const metaFile = await readIfExists(path.join(coursePath, 'course.json'));
    const courseJson = metaFile ? JSON.parse(metaFile) : {};
    const readmeRaw = await readIfExists(path.join(coursePath, 'README.md'));

    let name = courseJson.name || null;
    let description = courseJson.description || '';
    if (!name && readmeRaw) {
      const m = readmeRaw.match(/^#\s+(.+)$/m);
      if (m) name = m[1].trim();
    }
    if (!name) name = dir;
    if (!description && readmeRaw) {
      // 取 README 中第一段非标题、非列表的文字
      for (const line of readmeRaw.split('\n')) {
        const t = line.trim();
        if (t && !t.startsWith('#') && !t.startsWith('-') && !t.startsWith('```') && !/^[>\[]/.test(t)) {
          description = t.replace(/[*_`]/g, '');
          break;
        }
      }
    }

    const noteFiles = (await fs.readdir(path.join(coursePath, 'notes')))
      .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
      .sort();

    const course = { dir, name, description, links: courseJson.links || [], readmeRaw, notes: [] };
    for (const file of noteFiles) {
      const slug = file.replace(/\.md$/, '');
      course.notes.push({ file, slug, course: dir });
      noteIndex.set(norm(slug), { course: dir, slug });
      noteIndex.set(norm(`${dir}/${slug}`), { course: dir, slug });
    }
    courses.push(course);
  }

  // 3. 渲染每篇笔记（第一遍：读 frontmatter 建立别名索引）
  for (const course of courses) {
    for (const note of course.notes) {
      const raw = await fs.readFile(path.join(ROOT, course.dir, 'notes', note.file), 'utf8');
      note.raw = raw;
      const fm = raw.match(/^---\n([\s\S]*?)\n---/);
      let meta = {};
      if (fm) { try { meta = YAML.parse(fm[1]) || {}; } catch { /* ignore */ } }
      const keys = [note.slug, meta.title, meta.lecture, ...(meta.aliases || [])].filter(Boolean);
      for (const k of keys) {
        const nk = norm(String(k));
        if (!noteIndex.has(nk)) noteIndex.set(nk, { course: course.dir, slug: note.slug });
      }
    }
  }

  const searchIndex = [];

  for (const course of courses) {
    // 排序：lec-NN 编号优先，其次日期，其次文件名
    const num = (s) => { const m = s.match(/(?:lec|l|ch)-?(\d+)/i); return m ? Number(m[1]) : Infinity; };
    course.notes.sort((a, b) => num(a.slug) - num(b.slug) || a.slug.localeCompare(b.slug));

    // 先建好课程输出目录（即使 0 篇笔记也要建，课程索引页要用）
    await fs.mkdir(path.join(DIST, course.dir), { recursive: true });

    for (const note of course.notes) {
      const resolveNoteLink = (target) => {
        const hit = noteIndex.get(norm(target));
        if (!hit) return null;
        return hit.course === note.course ? `./${hit.slug}.html` : `../${hit.course}/${hit.slug}.html`;
      };
      const resolveAsset = (url) => {
        if (/^(https?:|data:|\/)/.test(url)) return url;
        const clean = url.replace(/^\.\.?\//, '').replace(/^assets\//, '').replace(/^\.\//, '');
        return `./assets/${clean}`;
      };

      const { html, ctx } = await renderMarkdown(note.raw, { resolveNoteLink, resolveAsset });
      const meta = ctx.meta;
      note.title = meta.title || note.slug;
      note.lecture = meta.lecture || '';
      note.date = meta.date ? String(meta.date) : '';
      note.status = meta.status || '';
      note.statusLabel = STATUS_LABELS[note.status] || note.status;
      note.tags = [...(meta.tags || []), ...ctx.inlineTags.filter((t) => !(meta.tags || []).includes(t))];
      note.sources = Array.isArray(meta.sources) ? meta.sources : [];
      note.toc = ctx.toc;
      note.html = html;

      searchIndex.push({
        title: note.title,
        lecture: note.lecture,
        course: course.name,
        url: `${course.dir}/${note.slug}.html`,
        tags: note.tags,
        headings: ctx.toc.map((t) => t.text).slice(0, 12),
        text: '', // 下面统一提取
      });
    }
    // 拷贝课程资源
    await copyDir(path.join(ROOT, course.dir, 'assets'), path.join(DIST, course.dir, 'assets'));
  }

  // 纯文本搜索内容（第二次轻量提取，去掉公式/代码噪音）
  for (const course of courses) {
    for (const note of course.notes) {
      const plain = note.raw
        .replace(/^---[\s\S]*?---/, '')
        .replace(/\$\$[\s\S]*?\$\$/g, ' ')
        .replace(/\$[^$\n]+\$/g, ' ')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/[#>*`\[\]!|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 3000);
      const item = searchIndex.find((s) => s.url === `${course.dir}/${note.slug}.html`);
      if (item) item.text = plain;
    }
  }

  // 4. 输出页面
  const site = {
    courses: courses.map((c) => ({
      dir: c.dir,
      name: c.name,
      description: c.description,
      links: c.links,
      noteCount: c.notes.length,
      lastUpdated: c.notes.map((n) => n.date).filter(Boolean).sort().pop() || '',
      notes: c.notes.map((n) => ({
        slug: n.slug, title: n.title, lecture: n.lecture, date: n.date,
        status: n.status, statusLabel: n.statusLabel, tags: n.tags,
      })),
    })),
    totalNotes: courses.reduce((s, c) => s + c.notes.length, 0),
  };

  for (const course of courses) {
    for (let i = 0; i < course.notes.length; i++) {
      const note = course.notes[i];
      const prev = course.notes[i - 1] || null;
      const next = course.notes[i + 1] || null;
      const page = renderNotePage({ site, course, note, prev, next });
      await fs.writeFile(path.join(DIST, course.dir, `${note.slug}.html`), page);
    }

    // 课程索引页：渲染 README + 笔记列表
    let readmeHtml = '';
    if (course.readmeRaw) {
      const resolveNoteLink = (target) => {
        const hit = noteIndex.get(norm(target));
        if (!hit) return null;
        return hit.course === course.dir ? `./${hit.slug}.html` : `../${hit.course}/${hit.slug}.html`;
      };
      const r = await renderMarkdown(course.readmeRaw, { resolveNoteLink, resolveAsset: (u) => u });
      readmeHtml = r.html;
    }
    const page = renderCoursePage({ site, course, readmeHtml });
    await fs.writeFile(path.join(DIST, course.dir, 'index.html'), page);
  }

  await fs.writeFile(path.join(DIST, 'index.html'), renderHomePage({ site }));
  await fs.writeFile(path.join(DIST, 'search-index.json'), JSON.stringify(searchIndex));

  // 5. 静态资源：样式、脚本、KaTeX 字体
  await fs.copyFile(path.join(SITE_DIR, 'src', 'style.css'), path.join(DIST, 'style.css'));
  await fs.copyFile(path.join(SITE_DIR, 'src', 'client.js'), path.join(DIST, 'client.js'));
  const katexDist = path.join(SITE_DIR, 'node_modules', 'katex', 'dist');
  await fs.mkdir(path.join(DIST, 'katex'), { recursive: true });
  await fs.copyFile(path.join(katexDist, 'katex.min.css'), path.join(DIST, 'katex', 'katex.min.css'));
  await copyDir(path.join(katexDist, 'fonts'), path.join(DIST, 'katex', 'fonts'));

  console.log(`✓ 构建完成：${courses.length} 门课程，${site.totalNotes} 篇笔记 → ${path.relative(ROOT, DIST)}/`);
  for (const c of courses) console.log(`  · ${c.name}（${c.notes.length} 篇）`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
