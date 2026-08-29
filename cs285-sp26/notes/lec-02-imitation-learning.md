---
title: L2 Imitation Learning
course: CS285-SP26
lecture: L2
topic: imitation-learning
date: 2026-07-10
aliases:
  - Imitation Learning
sources:
  - slides: https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf
  - video: ""
tags:
  - deep-learning
  - reinforcement-learning
  - imitation-learning
  - behavioral-cloning
  - dagger
status: draft
---

#CS285-SP26 #imitation-learning #behavioral-cloning #dagger

# L2 Imitation Learning

> [!abstract] 一句话概括
> 如何仅通过专家示范数据，让智能体学会一个能完成任务的策略？

## 核心思路

[[模仿学习]]（Imitation Learning）把学习策略的问题转化为监督学习：给定专家轨迹 $\mathcal{D}^*$，学习一个从状态到专家动作的映射 $\pi_\theta(a \mid s)$。

本讲重点：

1. 行为克隆（Behavioral Cloning）——最直接的监督学习方法。
2. 行为克隆的问题：分布偏移 / 复合误差。
3. 改进算法：DAgger（Dataset Aggregation）。
4. 其他实际问题：多模态动作、因果混淆、代价敏感学习、部分可观测等。

## 关键概念

### Imitation Learning 问题设定

- 环境：通常仍是一个 [[MDP]] / [[POMDP]]。
- 输入：专家示范数据集 $\mathcal{D}^* = \{(s_i, a_i^*)\}$。
- 目标：学得策略 $\pi_\theta(a \mid s)$，使其在真实环境中执行时表现接近专家。

### Behavioral Cloning

- 将策略学习视为分类 / 回归问题：最小化专家动作与模型预测动作之间的损失。
- 常见损失：
  - 离散动作：交叉熵。
  - 连续动作：MSE / 高斯对数似然。
- 训练与推断的分布相同吗？（关键问题）

### 分布偏移 / 协变量偏移

- 行为克隆假设训练数据与测试时策略访问的状态分布一致（i.i.d.）。
- 实际上，一旦策略犯错，就会进入专家从未访问过的状态区域，导致后续错误级联。
- 形式化：

$$
p_{\pi_\theta}(s_t) \neq p_{\pi^*}(s_t)
$$

### DAgger (Dataset Aggregation)

- 核心思想：在策略自己访问到的状态分布上重新收集专家标签，迭代聚合数据集。
- 流程：
  1. 初始化 $\mathcal{D} \leftarrow \mathcal{D}^*$。
  2. 在 $\mathcal{D}$ 上训练策略 $\pi_\theta$。
  3. 用 $\pi_\theta$ 在环境中 rollout，收集新状态序列。
  4. 请专家在这些新状态上标注动作，加入 $\mathcal{D}$。
  5. 重复。
- 关键假设：每一步都能获取专家动作（主动查询专家）。

### 其他实践问题

#### 多模态动作（Multimodal Actions）

- 同一状态下专家可能有多个合理动作，单一均值回归会取平均，导致模糊 / 次优。
- 常见解法：
  - Mixture of Gaussians / 离散化。
  - Latent variable models / 扩散模型。
  - 显式损失函数（如 entropy-regularized / R2 / R3）。

#### 因果混淆（Causal Confusion）

- 行为克隆可能学到与专家动作**相关但非因果**的特征，而不是真正决定动作的原因。
- 典型例子（自动驾驶）：
  - 专家看到行人后踩刹车，同时刹车指示灯亮起。
  - 在"完整信息"场景下，策略可能学到"看到刹车指示灯亮 → 踩刹车"，因为该指示灯与踩刹车高度相关。
  - 实际上，行人才是踩刹车的真正原因；指示灯只是专家行为的副作用。
  - 当指示灯信号缺失或出现误导时，这种策略会失败。
- 本质问题：专家数据中包含专家**自身行为产生的副作用**（如刹车灯、方向盘抖动），策略混淆了这些副作用与真正的环境因果信号。
- 一个缓解思路：在训练时隐藏或屏蔽这些副作用信号，迫使策略关注真正因果的特征（如行人）。

> [!question] 思考题
> - 引入历史信息会缓解因果混淆吗？
> - DAgger 会缓解因果混淆吗？
> - 参考：de Haan et al., "Causal Confusion in Imitation Learning"

#### 代价敏感学习 / 非均匀误差

- 并非所有状态误差都同等重要，有些动作偏差可能导致严重后果。
- 可能的改进：为不同样本加权。

#### 部分可观测 / 非马尔可夫

- 若环境是 POMDP，可能需要历史信息或 memory。

## 数学推导

### 行为克隆目标

专家数据集：

$$
\mathcal{D}^* = \{(s_i, a_i^*)\}_{i=1}^{N}, \quad (s_i, a_i^*) \sim p_{\pi^*}(s, a)
$$

监督学习目标：

$$
\theta^* = \arg\min_\theta \mathbb{E}_{(s, a) \sim \mathcal{D}^*} \left[ \mathcal{L}(\pi_\theta(a \mid s), a) \right]
$$

### 行为克隆的理论保证（理想 i.i.d. 情况）

若训练数据与测试分布一致，且损失有界，则期望错误可被控制在训练误差加上泛化项。

但更关心的是策略在 roll out 时的表现：

$$
J(\pi_\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[ \sum_{t=0}^{T} r(s_t, a_t) \right]
$$

或等价地用负代价（cost）：

$$
J(\pi_\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[ \sum_{t=0}^{T} c(s_t, a_t) \right]
$$

### 分布偏移导致的复合误差

在 $\mathcal{D}^*$ 上训练，但在 $\pi_\theta$ 生成的状态分布上测试：

$$
p_{\pi_\theta}(s_t) \neq p_{\pi^*}(s_t)
$$

误差会随时间步累积。

> [!warning] 待补充
> 复合误差上界的具体推导，以及专家与策略状态分布之间差异的 bound。

### DAgger 的误差上界

DAgger 在 $\pi_\theta$ 生成的状态分布上训练，因此能更好地匹配测试分布。其理论保证为：

> [!warning] 待补充
> $\epsilon$ 与 $\epsilon_{\text{test}}$ 的 bound，以及 $\mathbb{E}_{p_{\pi_\theta}} [\ell(\pi_\theta(a \mid s), a^*)]$ 的形式。

## 算法 / 模型结构

### 标准行为克隆

```
Input: 专家数据集 D*
Train: πθ(a|s) 最小化 L(πθ(a|s), a*) on D*
Output: πθ
```

### DAgger

```
Initialize: D ← D*
for iteration i = 1, 2, ... do
    Train πθ on D
    Rollout πθ in env to get states {s_j}
    Query expert labels {a_j*} for those states
    D ← D ∪ {(s_j, a_j*)}
end for
```

> [!warning] 待补充
> 幻灯片中的算法伪代码细节。

## 与其他讲次的联系

- 上承：[[lec-01-introduction|L1 Introduction]] — 强化学习问题定义、MDP。
- 下启：[[lec-03-behavioral-cloning-part2|L3 Behavioral Cloning Part 2]] — 更复杂的模仿学习方法（如 Inverse RL、IRL / GAIL 等）。
- 与 [[HW1]] 相关：作业 1 即实现行为克隆并观察分布偏移。

## 疑问 / 待深挖

- [ ] DAgger 中专家查询成本很高时怎么办？有哪些近似方法？
- [ ] 多模态行为的最佳建模方式是什么？
- [ ] 为什么行为克隆在自动驾驶等序列决策中容易失败？
- [ ] 引入历史信息是否能缓解因果混淆？DAgger 是否能缓解因果混淆？

## 参考资料

- 课程讲义：Lecture 2 Slides (https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf)
- Ross et al. "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning" (DAgger)
- de Haan et al. "Causal Confusion in Imitation Learning"
- 教材：Sutton & Barto, Reinforcement Learning: An Introduction
