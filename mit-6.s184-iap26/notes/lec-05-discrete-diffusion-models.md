---
title: Discrete Diffusion Models
course: 6-s184-iap26
lecture: 05
topic: discrete-diffusion
date: 2026-01-30
tags:
  - discrete-diffusion
  - categorical-data
  - d3pm
status: completed
---

# Lec 5: Discrete Diffusion Models

> [!abstract]
> 将扩散思想推广到离散数据（如文本、分子图），需要新的前向过程和去噪目标。

## 资源

- **Slides**: <https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf>
- **Recording**: <https://www.youtube.com/watch?v=d0kmyEJN2hI>

## 课前问题

> [!question]
> 连续空间中的高斯噪声无法直接用于离散 token，应该如何定义离散数据上的“加噪”过程？

## 核心概念

### 离散状态空间

数据 $x \in \{1, \dots, K\}^d$ 是分类变量序列。

### 离散前向过程

用马尔可夫链在每个位置逐步替换 token，常用 uniform 或 absorbing-state 转移矩阵：

$$
q(x_t | x_{t-1}) = \prod_{i=1}^d \mathbf{Q}_t[x_{t-1}^{(i)}, x_t^{(i)}]
$$

### 离散去噪目标

学习分类分布 $p_\theta(x_{t-1} | x_t)$，目标通常为交叉熵：

$$
\mathcal{L}(\theta) = -\mathbb{E}_{q(x_{t-1}, x_t)} \left[ \log p_\theta(x_{t-1} | x_t) \right]
$$

### 代表性工作

- D3PM（Discrete Denoising Probabilistic Models）
- Masked / absorbing-state 模型（如 ARDM、MaskGIT）

## 关键公式

## 代码 / 实验

- 对应 Lab 3：Diffusion Transformer and VAEs

## 延伸阅读

- [[lec-04-latent-spaces-and-neural-network-architectures|Lec 4: Latent Spaces and Neural Network Architectures]]
