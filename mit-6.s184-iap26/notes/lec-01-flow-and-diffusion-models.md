---
title: Flow and Diffusion Models
course: 6-s184-iap26
lecture: 01
topic: flow-diffusion-intro
date: 2026-01-20
tags:
  - diffusion
  - flow-matching
  - generative-models
status: completed
---

# Lec 1: Flow and Diffusion Models

> [!abstract]
> 课程概览：生成式建模的基本问题，以及流模型与扩散模型作为当前图像/视频生成前沿方法的核心思想。

## 资源

- **Slides**: <https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf>
- **Recording**: <https://www.youtube.com/watch?v=9eJQQVrUUoI>

## 课前问题

> [!question]
> 为什么要用随机过程来建模数据生成？它与普通的隐变量模型（如 VAE）有什么本质区别？

## 核心概念

### 生成式建模的目标

给定数据分布 $p_\text{data}(x)$，学习一个模型分布 $p_\theta(x)$，使得可以从中采样。

### 流模型（Flow Models）

通过可逆变换将简单分布（如高斯）映射到数据分布：

$$
x = f_\theta(z), \quad z \sim \mathcal{N}(0, I)
$$

### 扩散模型（Diffusion Models）

通过前向加噪过程将数据逐渐变为噪声，再学习逆向去噪过程进行采样。

## 关键公式

## 代码 / 实验

- 对应 Lab 1：Working with ODEs and SDEs

## 延伸阅读

- [[lec-02-flow-matching|Lec 2: Flow Matching]]
