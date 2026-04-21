---
type: concept
title: 2026 03 03 Openclaw Multi Agent Complete Guide
---

# OpenClaw Multi-Agent 系統完整指南

## 概述
OpenClaw 支援多種 Multi-Agent 架構，從輕量的 sub-agent 到完全隔離的多 agent 系統。

## 方案比較

| 方案 | 來源 | 隔離程度 | 難度 | 適合場景 |
|------|------|---------|------|----------|
| **agents.list** | 官方 docs | 完全隔離 | 中 | 多人共用、正式部署 |
| **Sub-agents** | 官方 | 輕量 | 低 | 臨時任務、單一對話內 |
| **OpenClaw-Advanced-Config** | TheSethRose | Docker沙盒 | 中 | 生產環境、安全要求高 |
| **openclaw-agents** | shenhao-stu | 完全 | 低 | 快速原型 |

## 1. agents.list（官方）

### 核心概念
一個 Agent = 完整隔離的大腦：
- **Workspace** - 檔案、AGENTS.md/SOUL.md/USER.md
- **State directory** - auth profiles、model registry
- **Session store** - 對話歷史

### 設定方式
```bash
# 建立新 agent
openclaw agents add work
```

### Config 範例
```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "workspace": "~/.openclaw/workspace"
      },
      {
        "id": "panchi",
        "workspace": "~/.openclaw/workspace-panchi",
        "tools": {
          "allow": ["gog"]
        }
      }
    ]
  },
  "bindings": [
    { "agentId": "main", "match": { "channel": "discord" } }
  ]
}
```

### 特性
- 每個 agent 有獨立 auth（不共享）
- Skills 可共享或 per-agent
- 用 bindings 綁定不同 channel/帳號

## 2. Sub-agents（官方）

### 核心概念
- 從現有 agent 背景 spawn 出來
- 所有 agents 平等，取決於操作順序
- 執行完後回傳結果給 parent

### Config
```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxConcurrent": 8,
        "allowAgents": ["*"]
      }
    }
  }
}
```

### 使用方式
- `/subagents spawn` 手動 spawn
- `sessions_spawn` tool 自動 spawn

## 3. OpenClaw-Advanced-Config

### 來源
GitHub: TheSethRose/OpenClaw-Advanced-Config

### 架構
```
Seth (協調者) ─┬─ Linus (程式開發)
              ├─ Finch (研究)
              └─ Otto (自動化)
```

### Agent 權限
| Agent | Role | Sandbox | Tools |
|-------|------|---------|-------|
| Seth | 協調者 | host | message, memory, sessions_spawn |
| Linus | 程式開發 | Docker | exec, read, write, edit... |
| Finch | 研究 | Docker | web_search, web_fetch |
| Otto | 自動化 | Docker | cron, exec |

## 4. openclaw-agents

### 來源
GitHub: shenhao-stu/openclaw-agents

### 特色
- 9 個預設 agent
- Channel 綁定（Discord, Telegram, LINE 等）
- Safe merge（不覆蓋現有 config）
- 4 種 workflow 模板

### 架構
👤 User → 🐾 Main → 🧠 Planner → Ideator/Critic/Surveyor/Coder/Writer/Reviewer/Scout

## 影片資源

### Video 1: OpenClaw Multi-Agent 系統介紹
- 主題：建立多個獨立的 Telegram Bot
- 每個 Agent 有自己的 workspace
- 展示：Bob（規劃/研究）+ Linus（開發）

### Video 2: OpenClaw Sub-Agent 教學
- 主題：Sub-agent 機制詳解
- `agents.list` 設定檔
- `max spawn depth` 控制層級
- TUI 互動介面

## Sandbox 模式

| Mode | 說明 |
|------|------|
| off | 不沙盒化，直接在 host 執行 |
| all | 永遠沙盒化 |
| non-main | 除了 main 都沙盒化 |
| inherit | 繼承 parent 設定 |

### Scope
- session：每個 session 一個 container
- agent：每個 agent 一個 container
- shared：共享 container

## 建議

### 初期
先用 `agents.list`，簡單設定：
- main（你自己用，全權限）
- panchi（給團隊，限制 tools）

### 以後擴充
- 需要 Docker 隔離 → OpenClaw-Advanced-Config
- 想要完整 workflow → openclaw-agents

## 相關資源
- [官方文檔](https://docs.openclaw.ai/concepts/multi-agent)
- [OpenClaw-Advanced-Config](https://github.com/TheSethRose/OpenClaw-Advanced-Config)
- [openclaw-agents](https://github.com/shenhao-stu/openclaw-agents)
