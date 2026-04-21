---
type: concept
title: 2026 04 20 Trading As Gitai
author: OpenAlice
source: N/A
created: '2026-04-20T19:03:14.000Z'
tags:
  - AI交易
  - Git
  - OpenAlice
  - TaG
  - Trading Agent
  - Vibe Trading
  - 基礎設施
  - 版本管理
---

# Trading as Git：AI 交易的版本管理系統

---

深度｜如何让 AI 做好交易：为交易系统引入版本管理（Trading as Git）

作为备战 Trading Agent 最早的团队之一，OpenAlice 早在闭源版本的时候就已经在思考"AI 如何做好交易"这个问题。

什么是 Trading as Git (TaG)
Trading as Git（TaG）把 Git 的版本管理模型搬到了交易领域。
核心思路是：交易是钱包状态的变化，代码是文件状态的变化，两者本质上是同一件事。

具体来说，TaG 用 Git 的工作流来管理每一笔交易操作：
- Add：Alice 把操作放进 staging area
- Commit：生成 hash、写入 message，把暂存区的操作锁定为一个不可变的意图记录
- Push：通过人工批准和其他审查之后，推送到交易所执行

每个 GitCommit 是一个不可变的完整执行快照，包含 hash、parentHash、message、operations、results、stateAfter、timestamp。

有了 TaG，Alice 能做什么
TaG 支持从两个方向查询 commit 历史：
- 时间线：最近的交易情况如何
- 资产线：我们对英伟达都做过什么？

Why Now?
人类懒得写 commit。AI 写 commit 可以更长、更频繁、更诚实。
AI 作为 commit 作者有三个天然优势：
1. 不偷懒：老老实实写完整的推理过程
2. 不遗忘：写 message 是决策流程的一部分
3. 没有叙事偏差：message 是决策时写的，不是执行后补的

模式迁移：从 Vibe Coding 到 Vibe Trading
2023 年，人们很难想象未来代码都是由 AI 写的。
2026 年，人们很难想象自己写代码。
AI 完成了绝大多数的代码编写工作，但 Coding 的基础设施几乎没有任何变化。
IDE、Terminal、文件系统、Git —— 一样都没变。

结论：如果我们像构建 Coding 基础设施一样，去构建其他领域的基础设施，就可以迁移 AI 在开发任务上的卓越表现。
代码有 Git → 交易需要 TaG。

Vibe XX 本质是协作问题
Git 解决两个问题：
- 横向协作：许多人一起写代码
- 纵向协作：自己写了很长时间的代码，需要版本管理

而 Agent 和人一起工作，本质上就是协作问题。
金融行业几乎从来不解决协同问题，默认了决策者只有一个。
TaG 大幅度提高了人和 AI 协同做交易的效果。

将 TaG 带到回测中
实盘场景下，TaG 的核心价值是日志——一份完整的、结构化的、可查询的决策记录。
回测场景下，时间变成可逆的了。AI 可以倒回到任何一个历史时刻重来。
TaG 又变回了真正的版本管理——checkout 到某个 commit，扔掉后面所有的决策，让 Alice 从那个点重新来过。甚至可以 branch：同一个起点，两条不同的策略路径，跑完之后 diff 结果。

---
*Collected by: George on 2026-04-20*
