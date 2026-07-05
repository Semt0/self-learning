# CS294-158-SP24 Deep Unsupervised Learning

- 来源：UC Berkeley, Spring 2024
- 主页：https://sites.google.com/view/berkeley-cs294-158-sp24/home
- 作业仓库：https://github.com/rll/deepul/tree/master/homeworks
- 讲师：Pieter Abbeel, Wilson Yan, Kevin Frans, Philipp Wu
- 先修：概率论、优化、深度学习
- 语言：Python (PyTorch)
- 进度：进行中

## 运行环境

- **作业运行位置**：远程 GPU 服务器（本机 macOS 无 NVIDIA GPU，仅用于阅读 / 写笔记）。
- **Python 环境**：每个 HW 一个独立 uv 项目，在远程机器上初始化；不在本地安装 PyTorch。
- **作业仓库**：`hw/deepul/` 是 clone 自 [rll/deepul](https://github.com/rll/deepul) 的参考仓库，保持原样以便 `git pull` 同步；自己的解答与笔记写在 `hw/hwN/` 或 notebook 内。
- **deepul 依赖**：`torch`、`torchvision`、`numpy`、`matplotlib`、`scikit-learn`、`scipy`、`tqdm`、`opencv-python`、`requests`，以及本地包 `deepul`（通过 `setup.py` 安装）。

## 课程简介

本课程覆盖无需标签数据的两大深度学习方向：**深度生成模型** 与 **自监督学习**。包括自回归模型、流模型、潜变量模型、GAN、扩散模型、LLM、视频生成、半监督学习、压缩、多模态、并行化、AI for Science、NeRF 等。

## 资源

- 官方主页：https://sites.google.com/view/berkeley-cs294-158-sp24/home
- 作业仓库（deepul）：https://github.com/rll/deepul
- 历年（SP20）：https://sites.google.com/view/berkeley-cs294-158-sp20/home
- Ed 讨论：https://edstem.org/us/courses/53933/discussion/

## 评分构成

- 60% 作业（4 次，每次 15%）
- 10% 期中考试（4/11）
- 30% 期末项目

## 进度

### 作业

- [ ] HW1: Autoregressive Models — https://github.com/rll/deepul/tree/master/homeworks/hw1
- [ ] HW2: Latent Variable Models — https://github.com/rll/deepul/tree/master/homeworks/hw2
- [ ] HW3: GANs / Implicit Models — https://github.com/rll/deepul/tree/master/homeworks/hw3
- [ ] HW4: Diffusion Models — https://github.com/rll/deepul/blob/master/homeworks/hw4

### 期中

- [ ] Midterm (4/11) — [Study handout](https://drive.google.com/file/d/1ndSEcewejWOgKSnaShkSXdPv1WwgBiXG/view?usp=drive_link)

### 期末项目

- [ ] 2/28  Project Proposals
- [ ] 3/8   Approved Project Proposals
- [ ] 4/5   3-page Milestone
- [ ] 5/10  Report and Video Presentation

### 讲义进度

- [ ] L1  (1/18) Intro
- [ ] L2  (1/25) Autoregressive Models
- [ ] L3  (2/1)  Flow Models
- [ ] L4  (2/8)  Latent Variable Models
- [ ] L5  (2/15) Generative Adversarial Networks / Implicit Models
- [ ] L6  (2/22) Diffusion Models
- [ ] L7  (2/29) Self-Supervised Learning / Non-Generative Representation Learning
- [ ] L8  (3/7)  Large Language Models (guest: Hao Liu)
- [ ] L9  (3/14) Video Generation
- [ ] L10 (3/21) Semi-Supervised Learning and Unsupervised Distribution Alignment
- [ ] L11 (4/4)  Compression
- [ ] L12a (4/11) Multimodal Models
- [ ] L12b (4/11) Parallelization
- [ ] L13a (4/18) AI for Science (guest: John Ingraham)
- [ ] L13b (4/18) Neural Radiance Fields (guest: Ben Mildenhall)

## 目录约定

- `notes/`：每讲一篇 Markdown 笔记，命名 `lec-NN-<topic>.md`；模板见 `notes/_template.md`。
- `hw/deepul/`：clone 的参考仓库，保持原样。
- `hw/hwN/`：自己每次作业的工作目录（uv 项目、解答、运行笔记）。
- `assets/`：笔记用到的图片等资源。
