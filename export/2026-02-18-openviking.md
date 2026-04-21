---
type: concept
title: 2026 02 18 Openviking
---

OpenViking最近很火，晚上学了一下，决定加到我的系统中。

以下是我对OpenViking的理解：

传统 RAG 的三个死穴，OpenViking 是怎么解的？
做过 RAG 的人都踩过这些坑：

❌ chunk 没有上下文关系，搜出来的片段语义孤立
❌ 向量相似 ≠ 真正相关，召回率高但精度低
❌ 每次会话结束，AI 什么都没学到

💡 OpenViking 的核心思路：用「文件系统范式」替代「平铺向量库」

所有上下文统一映射到虚拟文件树 viking://
viking://

├── resources/   ← 文档/代码/网页

├── user/memories/  ← 用户偏好

└── agent/

    ├── skills/     ← 可复用技能

    └── memories/   ← 任务经验

每个节点有唯一 URI，AI 可以像操作文件一样操作上下文，完全可追踪、可调试。


🏗️ L0/L1/L2 三层上下文，彻底解决 token 爆炸
写入时自动生成三层：

• L0 Abstract：~100 tokens，快速判断「这里有没有我要的东西」
• L1 Overview：~2k tokens，规划阶段的决策依据
• L2 Detail：完整原文，真正需要时才读
类比：先看书的封面摘要 → 再看目录 → 最后才翻正文
AI 不需要每次读完整本书，大幅降低推理成本。

🔍 目录递归检索，解决「语义相似但实际无关」

传统向量搜索：全库暴力找最相似 chunk → 精度差

OpenViking 的策略：

1️⃣ 意图分析 → 拆解多个检索条件

2️⃣ 顶层向量搜索 → 锁定高分目录

3️⃣ 进入目录二次精细搜索

4️⃣ 有子目录则继续递归向下

5️⃣ 汇总候选集，返回最终结果

  

先定位「书房」，再找「书架」，再找「具体那本书」

层层缩小范围，召回率和精度同时提升。


🔄 Session 自动记忆提取，让 Agent 越用越聪明

  

每次会话结束触发记忆提取：

• 用户偏好 → 写入 user/memories/

• 任务经验 → 写入 agent/memories/

  

下次启动自动加载，不需要用户重新介绍自己。

Agent 真正实现「上下文自进化」。


总结一句话：

RAG 存的是碎片，OpenViking 存的是结构。


#AI #RAG #LLM #AIAgent #ContextEngineering #OpenSource
