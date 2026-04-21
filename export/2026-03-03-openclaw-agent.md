---
type: concept
title: 2026 03 03 Openclaw Agent
---

# 三種 OpenClaw Agent 設定策略 (翻譯+分析)

**來源:** Reddit r/OpenClaw
**日期:** 2026-03-03
**標籤:** #openclaw #agent #workflow #architecture

---

## 原文摘要

作者在公司部署了 3 個獨立的 AI Agent，各自承担不同角色：

| Agent | 角色 | 權限 | 描述 |
|-------|------|------|------|
| **Agent 1** | 公司營運者 | Google Drive, GitHub, Email, Notion, Calendar | 全方位員工，活躍於所有群組聊天，根據不同主題給予不同人格設定 |
| **Agent 2** | 開發者 | GitHub 專屬 | 純程式開發，可透過 Codex/Claude Code 啟動子 Agent 平行化任務 |
| **Agent 3** | 個人助理 | 隔離實例，僅個人 Email/Calendar/Notion | 處理瑣碎小事：語音轉寫、預約餐廳、管理行程 |

---

## 為什麼要分 3 個 Agent？

### 1. 權限分離 (Separation of concerns)
> 公司 Agent 不該有個人 Email 權限，開發者不需要知道行銷策略，個人助理不應接觸公司 Repo

### 2. 上下文分離 (Context separation)
> 每個 Agent 有上下文窗口限制，無關資訊會讓 Agent 效能下降並浪費 Token

---

## 點評

### 優點
- 符合最小權限原則 (Least Privilege)
- 保持上下文乾淨，提升回答品質
- 多重人格但共享記憶體 (聰明！)

### 潛在風險
- **維運複雜度:** 3 個 Agent = 3 份設定 + 3 組權限
- **數據一致性:** 跨 Agent 資訊如何同步？
- **成本:** Token 消耗可能是單一 Agent 的 2-3 倍

---

## 對我們的啟發

George 目前是「單一 Agent (Mag)」模式，這篇文章提供了一個擴充方向：

```
[未來擴充可能性]
Mag (Main) 
  ├── Company Operator (公司營運)
  │     └── 共享 memory，但限定 tools
  ├── Developer (ERP/Code)
  │     └── GitHub + LM Studio
  └── Personal Assistant (個人)
        └── 隔離實例，minimal tools
```
