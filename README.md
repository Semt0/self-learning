# Self-Study

个人自学课程仓库，存放各门课程的作业与笔记。

## 目录结构

```
self-learning/
├── README.md
├── AGENTS.md
└── <course-name>/              # 每门课程一个目录，使用课程官方编号或常用英文名
    ├── README.md               # 课程简介、进度、资源链接
    ├── notes/                  # Markdown 笔记
    │   ├── lec-01-xxx.md       # 按章节/讲义命名
    │   └── ...
    ├── hw/                     # 作业代码
    │   ├── hw01/               # 单次作业一个子目录
    │   │   ├── README.md       # 题目说明、运行方式
    │   │   └── ...
    │   └── ...
    └── assets/                 # 图片等资源（可选）
```

## 命名约定

- 课程目录：使用课程官方编号或常用英文名，如 `6.S081`、`cs61a`、`mit-6.824`，全部小写，单词用 `-` 分隔。
- 笔记文件：`lec-<编号>-<主题>.md` 或 `<章节号>-<主题>.md`，如 `lec-03-virtual-memory.md`。
- 作业目录：`hw<编号>`，如 `hw01`、`hw02`。
- 文件名一律小写，单词用 `-` 分隔，避免空格和中文。

## 添加新课程

1. 在仓库根目录下新建 `<course-name>/` 目录。
2. 复制下面的课程 README 模板到该目录的 `README.md`。
3. 创建 `notes/` 与 `hw/` 子目录。
4. 在根目录 README 的「课程列表」中追加一行链接。

### 课程 README 模板

```markdown
# <课程名>

- 来源：<机构 / 平台 / 链接>
- 语言：<主要语言>
- 进度：<进行中 / 已完成 / 暂停>

## 资源

- 官方主页：
- 讲义：
- 视频：

## 进度

- [ ] Lecture 1
- [ ] HW 1
```

## 笔记约定

- 笔记统一用 Markdown，放在对应课程的 `notes/` 下。
- 每篇笔记顶部建议包含：标题、日期、对应章节/视频链接。
- 图片放该课程的 `assets/` 下，用相对路径引用。

## 课程列表

- [CS285-SP26](./cs285-sp26/) — Berkeley Deep Reinforcement Learning (Sergey Levine)
- [CS294-158-SP24](./cs294-158-sp24/) — Berkeley Deep Unsupervised Learning (生成模型 + 自监督学习)
