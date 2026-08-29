---
title: Flow Matching
course: 6-s184-iap26
lecture: 02
topic: flow-matching
date: 2026-01-22
tags:
  - flow-matching
  - optimal-transport
  - conditional-flow
status: completed
---

# Lec 2: Flow Matching

> [!abstract]
> 学习 Flow Matching 的建模方式：直接学习一个将先验分布变换到数据分布的向量场，并通过条件流实现可扩展的训练。

## 资源

- **Slides**: <https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf>
- **Recording**: <https://www.youtube.com/watch?v=PNkMKWW8Khw>

## 课前问题

> [!question]
> Flow Matching 与基于极大似然的正则化流（Normalizing Flows）相比，训练上有什么优势？为什么不需要可逆网络？

## 核心概念

### 从概率路径到向量场

Flow Matching 直接定义一个概率路径 $p_t(x)$ 和对应的向量场 $u_t(x)$，满足连续性方程：

$$
\partial_t p_t(x) + \nabla \cdot \left( p_t(x) u_t(x) \right) = 0
$$

### 条件流

通过构造条件概率路径 $p_t(x | x_1)$，从噪声 $x_0$ 到数据 $x_1$ 的插值：

$$
x_t = a_t x_0 + b_t x_1
$$

常见选择：
- 直线（OT-FM）：$x_t = (1 - t) x_0 + t x_1$
- 概率流 ODE 对应的其他插值

### Flow Matching 目标

学习神经网络 $v_\theta(t, x_t)$ 逼近条件期望：

$$
\mathcal{L}_{\text{FM}}(\theta) = \mathbb{E}_{t, x_0, x_1} \left[ \left\| v_\theta(t, x_t) - u_t(x_t | x_1) \right\|^2 \right]
$$

## 关键公式

## 代码 / 实验

- 对应 Lab 2：Flow Matching and Score Matching

## 延伸阅读

- [[lec-01-flow-and-diffusion-models|Lec 1: Flow and Diffusion Models]]
- [[lec-03a-score-functions-and-score-matching|Lec 3-A: Score Functions and Score Matching]]
