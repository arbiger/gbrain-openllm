---
type: concept
title: Mac Mini AI 助理系統架構
date: '2026-03-07T00:00:00.000Z'
tags:
  - ai-assistant
  - architecture
  - openclaw
  - system
---

# Mac Mini AI 助理系統架構

## 核心理念

三層分工：用最低成本實現 24/7 AI 助理服務。

---

## 架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Drive (共享中樞)                   │
│                  ~/Google Drive/precaster/                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   OpenClaw    │  │    Cowork     │  │Claude Code   │
│  (Telegram)   │  │  (Desktop)   │  │  (Terminal)  │
│                │  │               │  │              │
│ 24/7 監控     │  │ 複雜文件處理  │  │ 系統修復    │
│ 輕量任務      │  │ 批次操作      │  │ 技術任務    │
│ 協調者        │  │ 視覺化介面    │  │ 訂閱配額   │
└───────────────┘  └───────────────┘  └───────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                    ┌───────────────┐
                    │   George      │
                    │  (Telegram)   │
                    └───────────────┘
```

---

## 成本預估

| 工具 | 訂閱/成本 | 用途 |
|------|----------|------|
| **Claude Pro** | $20/月 | Cowork + Claude Code 配額 |
| **OpenClaw (MiniMax)** | ~$5-10/月 | 日常 API 費用 |
| **本地 Qwen3.5** | 免費 | 備援模型 |

---

## 委派機制

```
OpenClaw 發現複雜任務
    ↓
sessions_spawn (runtime="acp", agentId="claude-code")
    ↓
Claude Code 處理（用 Pro 訂閱配額）
    ↓
回傳結果 → OpenClaw 通知你
```

---

## 工作流範例

### 場景一：系統修復
1. 你：「Mac 上的 Python 環境壞了」
2. OpenClaw 分析 → 判定複雜
3. 委派給 Claude Code（訂閱配額）
4. Claude Code 診斷 + 修復
5. OpenClaw 通知完成

### 場景二：費用單據 OCR
1. Win 11 拍照 → Google Drive/input/
2. OpenClaw 監控資料夾（Skill）
3. 自動 OCR → 寫入 Excel
4. Telegram 通知結果

### 場景三：文件批次處理
1. Win 11 上傳 PDF → Google Drive/convert/
2. OpenClaw Skill 執行轉檔
3. 背景處理，成本趨近零
4. 完成通知

---

## 助理分工

| 助理 | 專長 | 介面 | 適合場景 |
|------|------|------|----------|
| **OpenClaw** | 24/7 監控、即時回應 | Telegram | 輕量任務、日常對話 |
| **Cowork** | 複雜文件處理、批次操作 | Desktop App | 手動觫發、大量處理 |
| **Claude Code** | 系統修復、技術任務 | Terminal | 緊急修復、深度問題 |

---

## 設定筆記

### Claude Code
- 移除 API Key 環境變數
- 用 `claude login` 登入 Pro 帳號
- 訂閱配額會自動套用

### OpenClaw
- 繼續使用 MiniMax API Key
- 複雜任務可委派給 Claude Code

### LM Studio
- 模型：Qwen3.5 27B
- API：http://localhost:1234/v1
- 作為本地備援

---

## 待實作

- [ ] 建立 RD Workspace（獨立 OpenClaw 實例）
- [ ] 撰寫 Google Drive 監控 Skill
- [ ] 設定 OpenClaw → Claude Code 委派流程
- [ ] 測試文件 OCR + 轉檔自動化

---

> 建立日期：2026-03-07
