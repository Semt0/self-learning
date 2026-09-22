# MIT 6.824: Distributed Systems

- **来源**：MIT，原课程编号 6.824；2023 年起使用 6.5840
- **方向**：分布式系统
- **实验语言**：Go
- **进度**：待学习
- **参考版本**：Spring 2026（6.5840；学习时以同一学期的课表和实验为准）

## 课程简介

课程通过论文阅读、系统案例和编程实验学习分布式系统的设计与实现，重点包括容错、复制与一致性。实验从 MapReduce 开始，逐步实现 Raft、基于 Raft 的键值服务及分片键值服务。

## 先修准备

- 熟悉计算机系统、操作系统和网络的基础概念，具备较扎实的编程与调试经验。
- 完成 [A Tour of Go](https://go.dev/tour/) 或具备 Go 基础，再开始实验。
- 论文阅读和实验配套进行；每次以官方课表中的阅读要求为准。

## 官方资料

- [课程主页（6.5840，Spring 2026）](https://pdos.csail.mit.edu/6.824/)：课程介绍及所有实验入口。
- [课程课表](https://pdos.csail.mit.edu/6.824/schedule.html)：按讲次汇总论文、讲义和阅读问题。
- [课程说明](https://pdos.csail.mit.edu/6.824/general.html)：先修要求与课程组织方式。
- [实验建议](https://pdos.csail.mit.edu/6.824/labs/guidance.html)：实验难度、调试和并发测试建议。
- [历年试题](https://pdos.csail.mit.edu/6.824/quizzes.html)：复习材料；包含 6.824 旧编号时期的试题。

## 阅读线索

从[官方课表](https://pdos.csail.mit.edu/6.824/schedule.html)依次阅读 MapReduce、GFS、Paxos、Raft、Linearizability、ZooKeeper、Spanner 等论文，并结合对应讲义梳理设计目标、故障模型和一致性保证。

## 实验计划

- [ ] [Lab 1: MapReduce](https://pdos.csail.mit.edu/6.824/labs/lab-mr.html) — 实现协调者与工作进程。
- [ ] [Lab 2: Key/Value Server](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html) — 实现键值服务。
- [ ] [Lab 3: Raft](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) — 实现复制状态机的共识模块。
- [ ] [Lab 4: Fault-tolerant Key/Value Service](https://pdos.csail.mit.edu/6.824/labs/lab-kvraft1.html) — 在 Raft 上构建容错键值服务。
- [ ] [Lab 5: Sharded Key/Value Service](https://pdos.csail.mit.edu/6.824/labs/lab-shard1.html) — 实现分片键值服务。

开始学习后，笔记存入 `notes/`，实验存入 `hw/`，并为每次实验补充题目和运行说明。
