---
type: concept
title: 2026 04 20 React Agent Vs Agent Swarm
author: Megan
source: N/A
created: '2026-04-20T20:11:37.000Z'
tags:
  - Agent
  - OpenClaw
  - Orchestrator
  - ReAct
  - Swarm
  - Zoe
  - 單一循環
  - 多人agent
  - 架構比較
---

# ReAct Agent vs Agent Swarm 架構比較（白板分析）

---

【ReAct Agent 單一循環 vs Agent Swarm 系統比較】

---

## 白板：標準 ReAct Agent 架構

**流程：**


**核心邏輯：**
- ReAct（Reason + Act）模式
- 一個 Agent 獨立完成整個任務循環
- Memory 只儲存對話歷史

---

## Agent Swarm 系統（George 文章）

**核心差異：**

| | ReAct Agent（白板）| Agent Swarm（George 文章）|
|---|---|---|
| 架構 | 單一 Agent 循環 | OpenClaw orchestrator + N 個專門 agents |
| Context | 對話歷史 | 完整業務上下文（客戶資料、會議紀錄、過去失敗）|
| 範圍 | 一次做一件任務 | Zoe 主動發現工作、動態分配給對的 agent |
| 失敗處理 | 重新跑同樣 prompt | Zoe 分析失敗原因、寫更好的 prompt 重試 |
| 應用 | 通用 AI 任務 | 軟體開發（商業邏輯）|
| 人類角色 | 幾乎不需要 | 最後一步才介入（merge PR）|

**簡單說：**
- 白板這個 = 一個人的智力強化（一個人用 AI 做一件事）
- George 文章這個 = **一人開發團隊**（Zoe 是你老闆，agents 是下屬）

---

## 關鍵啟發

Agent Swarm 的核心不是「更強的模型」，而是：
1. **分層分工**：context 專注於各自擅長的領域
2. **業務上下文**：讓 orchestrator 理解「為什麼」，而不只是「做什麼」
3. **從失敗中學習**：prompt 會隨著失敗 pattern 演化

---

## 相關文章

- 原始文章：[[2026-04-20-OpenClaw + Codex-Claude Code Agent Swarm：一個人開發團隊的完整設定]]


---
*Collected by: George on 2026-04-20*
