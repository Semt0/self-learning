---
title: Score Functions and Score Matching
course: 6-s184-iap26
lecture: 03a
topic: score-matching
date: 2026-01-23
tags:
  - score-function
  - score-matching
  - denoising-score-matching
status: completed
---

# Lec 3-A: Score Functions and Score Matching

> [!abstract]
> 分数函数 $\nabla_x \log p_t(x)$ 是扩散模型采样的核心。本讲介绍如何通过 Score Matching 高效地学习它。

## 资源

- **Slides**: <https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf>
- **Recording**: <https://www.youtube.com/watch?v=ngC3QnYSVNM>

## 课前问题

> [!question]
> 为什么直接对 $\nabla_x \log p_t(x)$ 做监督学习是不可能的？Denoising Score Matching 是如何绕过这个问题的？

## 核心概念

### 分数函数（Score Function）

$$
\mathbf{s}(x, t) = \nabla_x \log p_t(x)
$$

它指向分布密度增长最快的方向。

### Score Matching

最小化 Fisher 散度：

$$
\mathcal{L}_{\text{SM}}(\theta) = \mathbb{E}_{p_t(x)} \left[ \left\| s_\theta(x, t) - \nabla_x \log p_t(x) \right\|^2 \right]
$$

直接计算需要真实分数，因此使用 Denoising Score Matching：

$$
\mathcal{L}_{\text{DSM}}(\theta) = \mathbb{E}_{t, x_0, x_t} \left[ \left\| s_\theta(x_t, t) - \nabla_{x_t} \log p(x_t | x_0) \right\|^2 \right]
$$

对于高斯前向过程，条件分数有闭式解。

### 与 Flow Matching 的联系

分数函数与概率流 ODE 的向量场可以通过 Tweedie 公式联系起来：

$$
u_t(x) = f_t(x) - \frac{1}{2} g_t^2 \nabla_x \log p_t(x)
$$

## 关键公式

## 代码 / 实验

- 对应 Lab 2：Flow Matching and Score Matching

## 延伸阅读

- [[lec-02-flow-matching|Lec 2: Flow Matching]]
- [[lec-03b-classifier-free-guidance|Lec 3-B: Classifier-free Guidance]]
