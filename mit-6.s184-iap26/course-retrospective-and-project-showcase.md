---
title: MIT 6.S184 IAP26 课程复盘与项目展示
course: mit-6.s184-iap26
lecture: retrospective
topic: flow-matching-and-diffusion-models
date: 2026-08-29
tags:
  - mit-6-s184
  - flow-matching
  - diffusion-models
  - generative-models
  - project-showcase
status: completed
---

# MIT 6.S184 IAP26 课程复盘与项目展示

#course-review #project-showcase

> [!abstract]
> 通过五次课程学习和三个递进式 Lab，我从 ODE/SDE 的数值模拟出发，贯通了概率路径、Flow Matching、Score Matching、Classifier-Free Guidance 与 Diffusion Transformer，建立了从数学推导到生成模型实现的完整认知链路。

## 课程概览

- **课程**：[MIT 6.S184: Introduction to Flow Matching and Diffusion Models](https://diffusion.csail.mit.edu/2026/)
- **学期**：IAP 2026
- **学习状态**：已完成
- **成果**：6 篇主题笔记、3 个课程 Lab Notebook
- **技术栈**：Python、PyTorch、Jupyter、NumPy、Matplotlib

课程内容并不是把扩散模型当作一套孤立的训练技巧，而是用“随时间演化的概率分布”统一理解生成过程：向量场通过 ODE 搬运概率质量，分数函数描述密度的局部几何，SDE 在漂移与随机扰动之间建立动态平衡，而 Flow Matching 提供了直接回归向量场的可训练目标。

## 知识主线

### 1. 从动力系统理解生成

生成模型可以被看作从简单先验 $p_0$ 到数据分布 $p_1$ 的连续运输。若样本满足

$$
\frac{dX_t}{dt} = u_t(X_t),
$$

则概率密度随连续性方程演化：

$$
\partial_t p_t(x) + \nabla \cdot \left(p_t(x)u_t(x)\right) = 0.
$$

这把“训练生成模型”转化为“学习一个合适的时变向量场”。Lab 1 对 Euler 与 Euler–Maruyama 模拟器的实现，使 ODE、SDE、漂移项和扩散项从公式变成了可观察的轨迹。

### 2. Flow Matching 与 Score Matching 的统一视角

Flow Matching 通过构造条件概率路径，回归条件向量场；Score Matching 则学习

$$
s_t(x) = \nabla_x \log p_t(x).
$$

两者都避免直接估计未知的数据密度，并可在高斯概率路径下相互转换。Lab 2 从概率路径、条件向量场和条件分数的接口出发，分别实现训练目标，再通过数值采样观察模型如何把简单分布连续地运输到目标分布。

### 3. 从二维分布走向条件图像生成

Lab 3 将前两个 Lab 的抽象组件迁移到 MNIST：引入类别条件、随机丢弃标签来训练条件/无条件共享模型，并通过 Classifier-Free Guidance 在采样阶段控制条件强度。随后使用 patch 表示、时间编码和 Transformer 模块构造 Diffusion Transformer，将二维 toy problem 扩展到图像生成场景。

潜空间建模进一步揭示了现代生成系统的工程取舍：VAE 负责压缩和重建，扩散或流模型只需学习更紧凑的潜变量分布，从而降低训练与采样成本。

## 项目展示

### Lab 1：ODE 与 SDE 数值模拟

**Notebook**：[`hw/lab01/lab_one.ipynb`](./hw/lab01/lab_one.ipynb)

完成内容：

- 实现 Euler ODE solver 与 Euler–Maruyama SDE solver。
- 模拟 Brownian Motion 和 Ornstein–Uhlenbeck process。
- 观察扩散系数、均值回归强度与离散步长对轨迹的影响。
- 使用 Langevin dynamics 将样本逐步推向目标分布。

这一 Lab 的关键收获是区分了单条随机轨迹与总体分布演化：SDE 的样本不会收敛到固定点，但其边缘分布可以趋向稳定分布。

### Lab 2：Flow Matching 与 Score Matching

**Notebook**：[`hw/lab02/lab_two.ipynb`](./hw/lab02/lab_two.ipynb)

完成内容：

- 实现高斯条件概率路径及其采样规则。
- 推导并实现条件向量场与条件分数。
- 使用条件 Flow Matching 和条件 Score Matching 训练神经网络。
- 从已学习的向量场恢复分数，并比较两种参数化方式。
- 在任意源分布与目标分布之间构造线性概率路径。

这个项目明确了训练目标与采样动力学的职责边界：训练阶段利用可计算的条件目标做回归，采样阶段则通过边缘向量场的 ODE 将先验转换为数据。

### Lab 3：条件图像生成与 Diffusion Transformer

**Notebook**：[`hw/lab03/lab_three.ipynb`](./hw/lab03/lab_three.ipynb)

完成并留存的核心实践：

- 将采样接口扩展为带标签的 MNIST 数据源。
- 实现用于 Classifier-Free Guidance 的条件训练逻辑。
- 构建 Fourier time encoder 和图像 patchify/depatchify 流程。
- 组合时间嵌入、类别嵌入与 Transformer blocks，构建条件 Diffusion Transformer。
- 训练并可视化不同 guidance scale 下的条件生成结果。

该 Lab 将前两次实验的数学组件组合成端到端生成管线，也让我理解了时间条件、类别条件与空间 token 如何在同一网络中协同工作。

> [!info]
> 当前仓库中的 Lab 3 Notebook 保留了 DiT 阶段的已执行结果；VAE 与 latent diffusion 后半部分仍保留课程模板代码，未在本文中声明对应的本地运行结果。

## 最重要的收获

1. **统一视角比记忆模型结构更重要。** ODE、SDE、score 与 vector field 都是在描述概率分布如何随时间变化。
2. **条件目标让不可得的边缘目标变得可训练。** 训练时回归容易计算的条件量，最优解自然给出所需的边缘量。
3. **参数化会影响数值稳定性。** 预测噪声、分数、速度或数据虽然可以互相换算，但不同时间端点处的尺度和误差传播并不相同。
4. **生成质量与条件强度存在权衡。** CFG 增强条件一致性的同时，过大的 guidance scale 可能损害多样性并放大误差。
5. **现代生成模型是模块化系统。** 数据表示、概率路径、训练目标、网络架构和数值求解器可以分别设计，再组合成完整管线。

## 如果重新学习

- 为每种 probability path 整理一张 $\alpha_t$、$\beta_t$、vector field、score 和采样方程对照表。
- 给数值模拟增加误差随步数变化的定量实验，而不只观察可视化结果。
- 统一记录随机种子、训练步数、参数量与生成样例，方便横向比较。
- 补全并独立训练 VAE + latent flow pipeline，比较 pixel-space DiT 与 latent-space 模型的速度、显存和重建误差。

## 导航

- 起点：[[lec-01-flow-and-diffusion-models|Flow and Diffusion Models]]
- 概率路径：[[lec-02-flow-matching|Flow Matching]]
- 分数建模：[[lec-03a-score-functions-and-score-matching|Score Functions and Score Matching]]
- 条件控制：[[lec-03b-classifier-free-guidance|Classifier-Free Guidance]]
- 架构与潜空间：[[lec-04-latent-spaces-and-neural-network-architectures|Latent Spaces and Neural Network Architectures]]
- 离散建模：[[lec-05-discrete-diffusion-models|Discrete Diffusion Models]]

## 总结

完成 6.S184 后，我能够从概率路径与动力系统的角度解释 Flow Matching 和 Diffusion Models，推导基础训练目标，并用 PyTorch 实现从低维分布运输到条件图像生成的关键组件。课程最有价值的部分，是把看似分散的算法还原为同一套概率演化语言，为继续学习 rectified flow、latent diffusion 和大规模生成模型奠定了基础。
