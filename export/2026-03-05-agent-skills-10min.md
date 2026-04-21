---
type: concept
title: 2026 03 05 Agent Skills 10min
url: 'https://youtu.be/QnmW0FC7eN0'
date: '2026-03-05T00:00:00.000Z'
source: YouTube
tags:
  - agent
  - ai
  - mcp
  - skill
  - tutorial
---

# 10分钟彻底讲透Agent Skills

## 影片資訊
- **標題**: 10分钟彻底讲透Agent Skills，深度解析Skills、workflow、MCP与Command的演进逻辑！
- **時長**: 約10分鐘
- **語言**: 中文

## 重點摘要

### Agent Skills 的核心概念
- 2025年初，Anthropic 在推出 MCP 後，提出 Agent Skills 概念
- Skill = 領域知識，告訴模型該如何做（本質上是高級 Prompt）
- MCP = 對接外部工具和數據

### 演進順序
1. **Function Call** - 最早的工具調用方式
2. **Tool Call** - 改進版本
3. **MCP (Model Context Protocol)** - 標準化協議
4. **Agent Skills** - 最新概念

### Skills 的核心機制：漸進式披露
- 首次鏈接時，只需加載 Skills 的元數據（幾千 Token）
- 不像 MCP 需要將所有工具全部塞進模型上下文（數萬 Token）
- 大幅節省 Token

### Skills vs MCP
| 特性 | Skills | MCP |
|------|--------|-----|
| 本質 | 領域知識/Prompt | 外部工具連接 |
| Token消耗 | 較少 | 較多 |
| 用途 | 告訴模型「如何做」 | 對接外部資源 |

## 相關資源
- [別再造Agent了！關於Agent Skills的詳細總結來了](https://zhuanlan.zhihu.com/p/1986802048608527579)
- [Agent Skills 完全指南](https://zhuanlan.zhihu.com/p/1999979760458167377)
- [GitHub: hello-agents](https://github.com/datawhalechina/hello-agents)
