# 课程笔记站点

把仓库里的 Obsidian 笔记（`<course>/notes/*.md`）渲染成静态网站，自动部署到 GitHub Pages。

## 本地使用

```bash
cd site
npm install
npm run build      # 输出到 site/dist/
npm run preview    # 构建并在 http://localhost:4321 预览
```

## 工作原理

- `build.mjs` 扫描仓库根目录下所有含 `notes/` 的目录，把 Markdown 渲染成 HTML。
- 支持的 Obsidian 语法：YAML frontmatter、`[[wikilink]]`、`![[图片]]`、`> [!callout]`、KaTeX 公式、顶部 `#tag` 行。
- 所有内部链接使用相对路径，任意 base path 下都能正常访问。

## 扩展方式

| 需求 | 做法 |
| --- | --- |
| 新增一门课程 | 仓库根目录新建 `<course>/notes/`，放入 `.md` 笔记即可 |
| 自定义课程显示名 / 简介 / 链接 | 在课程目录添加 `course.json`：`{"name": "...", "description": "...", "links": [{"label": "课程主页", "url": "..."}]}` |
| 新增笔记 | 放入 `notes/`，frontmatter 按 `_template.md` 填写 |
| 笔记排序 | 文件名中的 `lec-NN` 编号自动排序 |
| 图片 | 放入课程 `assets/`，构建时自动拷贝 |

## 部署

`.github/workflows/pages.yml` 在 push 到 `main` 时自动构建并发布到 GitHub Pages
（仓库 Settings → Pages → Source 选择 "GitHub Actions"）。
