---
title: Latent Spaces and Neural Network Architectures
course: 6-s184-iap26
lecture: 04
topic: latent-diffusion-architectures
date: 2026-01-28
tags:
  - vae
  - latent-diffusion
  - unet
  - dit
status: completed
---

# Lec 4: Latent Spaces and Neural Network Architectures

> [!abstract]
> 在潜空间中进行扩散/流建模可大幅提高效率。本讲介绍 VAE 编码器、UNet 以及 DiT 等骨干网络。

## 资源

- **Slides**: <https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf>
- **Recording**: <https://www.youtube.com/watch?v=g0MB1CCBmsI>

## 课前问题

> [!question]
> 为什么直接在像素空间做扩散计算代价高昂？潜空间表示需要满足哪些性质才能适合生成模型？

## 核心概念

### 潜扩散模型（Latent Diffusion Model）

先用 VAE 将数据 $x$ 编码到潜变量 $z = E(x)$，再在 $z$ 空间训练扩散/流模型，最后解码：

$$
x = D(z), \quad z \sim p_\theta(z)
$$

### VAE 在 LDM 中的作用

- 降维：降低扩散模型的计算和内存开销。
- 语义压缩：将像素级的冗余信息移除，保留高层语义。
- 通常使用 KL 正则化或VQ-VAE。

### 网络架构

- **UNet**：经典的扩散模型骨干，具有下采样-上采样结构和跳跃连接。
- **DiT（Diffusion Transformer）**：将去噪网络替换为 Vision Transformer，在潜空间 patch 上操作。
- 条件注入：时间步 embedding、文本 embedding、交叉注意力等。

## 关键公式

## 代码 / 实验

- 对应 Lab 3：Diffusion Transformer and VAEs

## 延伸阅读

- [[lec-03b-classifier-free-guidance|Lec 3-B: Classifier-free Guidance]]
- [[lec-05-discrete-diffusion-models|Lec 5: Discrete Diffusion Models]]
