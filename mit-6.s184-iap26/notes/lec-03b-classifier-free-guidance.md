---
title: Classifier-free Guidance
course: 6-s184-iap26
lecture: 03b
topic: classifier-free-guidance
date: 2026-01-23
tags:
  - classifier-free-guidance
  - conditional-generation
  - guidance-scale
status: completed
---

# Lec 3-B: Classifier-free Guidance

> [!abstract]
> Classifier-free Guidance（CFG）无需额外训练分类器即可提升条件生成质量，是文本到图像等应用的关键技术。

## 资源

- **Slides**: <https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf>
- **Recording**: <https://www.youtube.com/watch?v=8oWZ1bHwyRI>

## 课前问题

> [!question]
> Classifier Guidance 需要训练一个噪声条件下的分类器，有什么缺点？CFG 如何完全避免这一需求？

## 核心概念

### 条件分数函数

给定条件 $c$，模型学习条件分数：

$$
\nabla_x \log p_t(x | c)
$$

### Classifier Guidance

用贝叶斯规则分解：

$$
\nabla_x \log p_t(x | c) = \nabla_x \log p_t(x) + \nabla_x \log p_t(c | x)
$$

第二项需要训练分类器。

### Classifier-free Guidance

直接训练一个联合条件/无条件模型，通过随机丢弃条件实现。采样时插值：

$$
\tilde{s}_\theta(x, t, c) = s_\theta(x, t, \varnothing) + w \left( s_\theta(x, t, c) - s_\theta(x, t, \varnothing) \right)
$$

其中 $w \ge 1$ 为 guidance scale。$w = 1$ 恢复条件采样，$w > 1$ 增强条件对齐但可能牺牲多样性。

## 关键公式

## 代码 / 实验

- 对应 Lab 2：Flow Matching and Score Matching

## 延伸阅读

- [[lec-03a-score-functions-and-score-matching|Lec 3-A: Score Functions and Score Matching]]
- [[lec-04-latent-spaces-and-neural-network-architectures|Lec 4: Latent Spaces and Neural Network Architectures]]
