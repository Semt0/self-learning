# AGENTS.md

本仓库为个人自学课程仓库，存放各门课程的作业与笔记。AI 助手在本仓库工作时请遵守以下约定。

## 仓库性质

- 多门课程混合存放，每门课程一个独立目录。
- 多语言混合：不同课程的作业可能使用 C / Python / Java 等，按课程要求而定。
- 笔记统一使用 Markdown。
- 笔记使用 Obsidian 格式，便于在 Obsidian 中渲染和关联。

## 笔记格式（Obsidian）

- 使用标准 YAML frontmatter，包含 `title`、`course`、`lecture`、`topic`、`date`、`tags`、`status` 等字段。
- 文件顶部或正文可使用 Obsidian 标签：`#tag`。
- 讲次之间用 `[[lec-NN-topic|显示名]]` 建立 wikilink，方便图谱导航。
- 数学公式使用 Obsidian 默认语法：
  - 行内公式：`$...$`
  - 块级公式：`$$...$$`
  - 不使用 `\(...\)` / `\[...\]`，避免渲染失败。
- 提示 / 警告 / 问题 / 摘要使用 Obsidian callout：
  - `> [!abstract]`：一句话概括
  - `> [!info]`：补充信息
  - `> [!warning]`：待补充或注意点
  - `> [!question]`：思考题或疑问
- 代码块使用 fenced code block（```）。
- 图片等附件放在课程目录下的 `assets/` 中，笔记中用标准 Markdown 图片语法引用。

## 目录约定

- 课程目录：`<course-name>/`，每个课程下含 `notes/`、`hw/`、可选 `assets/`。
- 作业：`hw/<hwNN>/`，单次作业一个子目录，内含 `README.md` 说明题目与运行方式。
- 笔记：`notes/lec-<编号>-<主题>.md`。
- 命名一律小写，单词用 `-` 分隔，不使用空格与中文文件名。

## 工作约定

- 修改某门课程内容前，先阅读该课程目录下的 `README.md`，确认课程进度与所用语言/工具链。
- 不同课程可能使用不同的语言与构建工具，不要假设全仓库统一工具链；运行/测试命令以该课程 README 或作业 README 中注明的为准。
- 若课程 README 未提供运行命令，在执行构建或测试前应向用户确认。
- 新增文件请遵循上述目录与命名约定。

## 提交约定

- 提交信息简明描述改动，如 `add hw02 for 6.s081`、`update notes on virtual memory`。
- 不要在没有用户明确要求时执行 commit / push。
