# CS 185/285 Deep Reinforcement Learning (Spring 2026)

- 来源：UC Berkeley, Spring 2026
- 主页：https://rail.eecs.berkeley.edu/deeprlcourse/
- 作业仓库：https://github.com/berkeleydeeprlcourse/homework_spring2026
- 讲师：Sergey Levine
- 先修：CS189 或等价的 ML 基础；熟悉 RL / MDP 基础（推荐 Sutton & Barto 第 3、4 章）
- 语言：Python (PyTorch)
- 进度：进行中

## 课程简介

Berkeley 的深度强化学习课程，覆盖模仿学习、策略梯度、Actor-Critic、基于价值的 RL、高级策略梯度、变分推断与 RL、LLM RL、基于模型的 RL、离线 RL、探索、RL 理论、多任务 RL 等。

## 资源

- 官方主页：https://rail.eecs.berkeley.edu/deeprlcourse/
- 作业仓库：https://github.com/berkeleydeeprlcourse/homework_spring2026
- 历年录像（Fa2023）：https://www.youtube.com/playlist?list=PL_iWQOsE6TfVYGEGiAOMaOzzv41Jfm_Ps
- subreddit：https://www.reddit.com/r/berkeleydeeprlcourse/
- 推荐教材：Sutton & Barto《Reinforcement Learning: An Introduction》

## 运行环境

- **作业运行位置**：远程 GPU 服务器（本机 macOS 无 NVIDIA GPU，仅用于阅读 / 写笔记）。
- **Python 环境**：作业仓库已自带 `pyproject.toml` + `uv.lock`，每个 HW 一个独立 uv 项目；在远程机器上 `cd hw/hwN && uv sync` 即可。
- **作业仓库**：`hw/homework_spring2026/` 是 clone 自 [berkeleydeeprlcourse/homework_spring2026](https://github.com/berkeleydeeprlcourse/homework_spring2026) 的参考仓库，保持原样以便 `git pull` 同步；自己的解答直接在仓库内修改或写到 `hw/hwN-my-sol/` 下。
- **实验跟踪**：[Weights & Biases](https://wandb.ai)，运行前需 `uv run wandb login`。
- **可选云计算**：[Modal](https://modal.com)（HW1 提示本地 CPU 反而更快，未来作业可能需要）。

## 评分构成

- 50% 作业（5 次，每次 10%）
- 20% 期末项目
- 20% 期中考试（4 月 15 日当周）
- 10% mini-quiz（每讲一次，7 天内提交）

## 进度

### 作业

- [ ] HW1: Imitation Learning — `hw/homework_spring2026/hw1/`
- [ ] HW2: Policy Gradients — `hw/homework_spring2026/hw2/`
- [ ] HW3: Q-Learning and Actor Critic — `hw/homework_spring2026/hw3/`
- [ ] HW4: LLM RL — `hw/homework_spring2026/hw4/`
- [ ] HW5: Offline RL — `hw/homework_spring2026/hw5/`

### 期末项目

- [ ] 默认项目：Offline-to-Online RL 或 LLM RL
- [ ] Proposal / Outline / Milestone / Report

### 讲义进度

- [ ] L1  Introduction
- [ ] L2  Behavioral Cloning
- [ ] L3  Behavioral Cloning Part 2
- [ ] L4  RL Basics
- [ ] L5  Policy Gradients
- [ ] L6  Actor Critic
- [ ] L7  Value-Based RL
- [ ] L8  Q-learning in Practice
- [ ] L9  Advanced Policy Gradients Part 1
- [ ] L10 Advanced Policy Gradients Part 2
- [ ] L11 Variational Inference
- [ ] L12 VI in RL
- [ ] L13 Control as Inference
- [ ] L14 LLM RL
- [ ] L15 Model-Based RL Part 1
- [ ] L16 Model-Based RL Part 2
- [ ] L17 Offline RL Part 1
- [ ] L18 Offline RL Part 2
- [ ] L19 Exploration
- [ ] L20 RL Theory
- [ ] L21 Midterm Review Part 1
- [ ] L22 Midterm Review Part 2
- [ ] L23 Advanced Exploration
- [ ] L24 Multi-task RL
- [ ] L25 Challenges and Open Problems

### Section 进度

- [ ] S1  PyTorch Tutorial
- [ ] S2  Probability Review / BC Distributional Shift
- [ ] S3  Policy Gradients and Actor Critic
- [ ] S4  DQN and SAC
- [ ] S5  Advanced Policy Gradients
- [ ] S6  Variational Inference
- [ ] S7  IRL and LLM RL
- [ ] S8  Model-Based RL
- [ ] S9  Offline RL

## 目录约定

- `notes/`：每讲一篇 Markdown 笔记，命名 `lec-NN-<topic>.md`；模板见 `notes/_template.md`。
- `hw/homework_spring2026/`：clone 的参考仓库，保持原样；自带 uv 项目。
- `assets/`：笔记用到的图片等资源。
