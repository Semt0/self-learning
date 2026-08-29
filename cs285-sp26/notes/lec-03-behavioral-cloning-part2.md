---
title: L3 Behavioral Cloning Part 2
course: CS285-SP26
lecture: L3
topic: behavioral-cloning-part2
date: 2026-07-10
aliases:
  - Behavioral Cloning Part 2
sources:
  - slides: https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-3.pdf
  - video: ""
tags:
  - deep-learning
  - reinforcement-learning
  - imitation-learning
  - behavioral-cloning
  - inverse-reinforcement-learning
  - dagger
status: draft
---

#CS285-SP26 #imitation-learning #inverse-reinforcement-learning #behavioral-cloning

# L3 Behavioral Cloning Part 2

> [!abstract] 一句话概括
> 行为克隆只是模仿学习的一种最简单形式；本讲讨论当 expert 数据有限、环境存在随机性、或者需要泛化到新任务时，更高级的模仿学习方法与理论。

## 核心思路

本讲承接 [[lec-02-imitation-learning|L2]]，继续探讨 imitation learning：

1. 回顾 L2：Behavioral Cloning 与 DAgger 的假设和局限性。
2. 从"复制动作"到"学习目标背后的回报 / 代价函数"：Inverse Reinforcement Learning (IRL)。
3. 处理多模态、部分可观测、高维动作等复杂情况。
4. 与 RL 的联系：imitation learning 可以看作是在没有显式奖励下的策略学习。

## 关键概念

### L2 回顾

- [[Behavioral Cloning]]：监督学习，拟合专家策略 $\pi^*$。
- [[DAgger]]：通过迭代聚合在策略自身分布上采样的数据，缓解分布偏移。
- 主要假设：
  - 可以频繁查询专家（DAgger）。
  - 专家动作可观测。
  - 专家策略足够好。

### 当专家数据不足时

- 专家数据可能非常有限，无法覆盖所有状态。
- 需要引入额外的假设或模型：
  - 平滑性 / 正则化。
  - 任务结构（如奖励稀疏但目标明确）。
  - 世界模型 / 动力学模型。

### Inverse Reinforcement Learning (IRL)

- 不再直接学习动作，而是学习一个**奖励 / 代价函数** $r(s, a)$，使得专家策略在该奖励下最优。
- 基本设定：
  - 给定专家轨迹 $\tau^*$。
  - 找到一个奖励函数 $r_\psi$，使得专家策略 $\pi^*$ 优于任何其他策略。
- 优点：
  - 学到的奖励函数可以泛化到新环境、新状态。
  - 更符合"理解专家为什么这样做"，而非机械复制动作。

### Max-Margin IRL / Feature Matching

- 假设奖励函数是特征的线性组合：

$$
r_\psi(s, a) = \psi^T \phi(s, a)
$$

- 专家策略与任意策略之间满足 margin 约束：

$$
\mathbb{E}_{\pi^*} [r_\psi(s, a)] \geq \mathbb{E}_{\pi} [r_\psi(s, a)] + \text{margin}
$$

- 通过最大化 margin 来学习 $\psi$。
- 本质：让专家访问的特征分布获得高奖励，其他策略获得低奖励。

### IRL 的歧义性

- 对于同一组专家轨迹，可能存在多个奖励函数都使专家最优。
  - 例如：全零奖励函数总是让任何策略"一样好"。
- 需要额外约束：
  - 最大熵。
  - 最小范数。
  - 偏好简单 / 稀疏奖励。

### 从 IRL 到 RL

- 一旦学到奖励函数 $r_\psi$，就可以用标准 RL 方法求解最优策略：

$$
\pi_\theta^* = \arg\max_\pi \mathbb{E}_{\tau \sim \pi} \left[ \sum_{t} r_\psi(s_t, a_t) \right]
$$

- 这就形成了一个迭代框架：IRL 学奖励 → RL 学策略 → 用专家数据修正奖励。

### 多模态与部分可观测的进一步讨论

- 当专家轨迹由多个不同策略混合产生时，单一策略难以拟合。
- 需要显式建模隐变量或 mixture model。
- 部分可观测问题：专家动作可能依赖历史，需要 recurrent policy 或 attention。

## 数学推导

### IRL 的目标函数

给定专家轨迹 $\tau^*$，希望找到奖励函数 $r_\psi$ 使得：

$$
\psi^* = \arg\min_\psi \left( \max_{\pi} \mathbb{E}_{\tau \sim \pi} \left[ \sum_t r_\psi(s_t, a_t) \right] - \mathbb{E}_{\tau^*} \left[ \sum_t r_\psi(s_t, a_t) \right] \right)
$$

即：让专家最优，同时让其他策略无法超过专家。

### 最大熵 IRL

为解决歧义性，引入最大熵正则：

$$
p(\tau) \propto \exp \left( \sum_t r_\psi(s_t, a_t) \right)
$$

在此框架下，IRL 与最大似然等价：

$$
\max_\psi \sum_{\tau^*} \log p(\tau^*)
$$

> [!warning] 待补充
> 幻灯片中的具体推导与 soft Q-learning / entropy-regularized RL 的联系。

### 与 Behavioral Cloning 的关系

- 如果专家是确定性的且环境是单步的，IRL 可退化为 BC。
- 但在序列决策中，IRL 能捕捉 long-horizon 目标，而 BC 只关注局部动作匹配。

## 算法 / 模型结构

### 标准 IRL 流程

```
Input: 专家轨迹 D*
Repeat:
    1. 根据当前奖励函数 rψ，用 RL 求解最优策略 πθ
    2. 用 πθ 生成新轨迹
    3. 根据专家轨迹与生成的轨迹，更新 rψ（使专家更优）
Until convergence
Output: 奖励函数 rψ 和策略 πθ
```

> [!warning] 待补充
> 幻灯片中的具体算法，如 Max-Margin IRL、Maximum Entropy IRL 等。

### 与 DAgger 的对比

| 方法 | 学什么 | 是否需要专家查询 | 是否考虑长期目标 |
|------|--------|------------------|------------------|
| Behavioral Cloning | 动作映射 | 仅一次 | 否（局部） |
| DAgger | 动作映射 | 迭代查询 | 间接（通过分布修正） |
| IRL | 奖励函数 | 不需要持续查询 | 是 |

## 与其他讲次的联系

- 上承：[[lec-02-imitation-learning|L2 Imitation Learning]] — Behavioral Cloning、DAgger、因果混淆。
- 下启：[[lec-04-rl-basics|L4 RL Basics]] — 一旦 IRL 学到奖励函数，就需要 RL 求解策略。
- 与 [[lec-11-variational-inference|L11 Variational Inference]] / [[lec-12-vi-in-rl|L12 VI in RL]] 相关：最大熵 IRL 与概率推断的联系。
- 与 [[HW1]] 相关：作业 1 涉及模仿学习的实现与失败案例分析。

## 疑问 / 待深挖

- [ ] IRL 中奖励函数歧义性具体有哪些典型解法？
- [ ] 最大熵 IRL 与 soft actor-critic 有什么数学联系？
- [ ] 当专家不是最优时，IRL 和 BC 哪个更鲁棒？
- [ ] 从计算复杂度看，IRL 为什么通常比 BC 更贵？

## 参考资料

- 课程讲义：Lecture 3 Slides (https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-3.pdf)
- Ng & Russell, "Algorithms for Inverse Reinforcement Learning"
- Ziebart et al., "Maximum Entropy Inverse Reinforcement Learning"
- Ross et al. "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning" (DAgger)
- 教材：Sutton & Barto, Reinforcement Learning: An Introduction
