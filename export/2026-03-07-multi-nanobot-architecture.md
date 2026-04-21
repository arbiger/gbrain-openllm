---
type: concept
title: 多 ZeroClaw/Nanobot 架構規劃
date: '2026-03-07T00:00:00.000Z'
tags:
  - architecture
  - multi-agent
  - nanobot
  - workspace
---

# 多 ZeroClaw/Nanobot 架構規劃

## 核心理念

一人配一個 AI Agent，統一回報給 Mag 整合 + 自動化。

---

## 最終架構

```
┌─────────────────────────────────────────────┐
│              Mattermost                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │#ch ing │ │#sales  │ │#engineer│ ...   │
│  └─────────┘ └─────────┘ └─────────┘      │
└──────────────────┬──────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌────────┐   ┌────────┐    ┌────────┐
│Nanobot │   │Nanobot │    │Nanobot │
│ Ching  │   │ Sales  │    │ Engineer│
└────────┘   └────────┘    └────────┘
    │              │              │
    └──────────────┼──────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│              gog (Google Workspace)          │
│  Gmail │ Calendar │ Sheets │ Drive         │
└─────────────────────────────────────────────┘
                   │
                   ▼
              Mag (主控)
              統整 + 自動化
```

---

## 成本策略

| 用途 | 方案 | 費用 |
|------|------|------|
| **日常** | Qwen 本地 (LM Studio) | 免費 |
| **複雜** | Claude Code (直接叫) | $20/月 (Pro 訂閱) |
| **備援** | Gemini CLI | API 收費 |

**關鍵：**
- 不讓我（第三方）直接叫 Claude → 避免額外收費
- 複雜任務 → 用戶直接叫 Claude Code → 用 Pro 訂閱配額

---

## Nanobot vs ZeroClaw

| 項目 | Nanobot | ZeroClaw |
|------|---------|----------|
| **程式碼** | ~4,000 行 | 較多 |
| **開發速度** | 活躍 (經常更新) | 慢 |
| **功能** | MCP, 多channel, Docker | 基本 |
| **安裝** | `pip install nanobot-ai` | ? |

### Nanobot 支援

- **Providers**: OpenAI, MiniMax, Qwen, DeepSeek, Mistral, vLLM (本地)
- **Channels**: Discord, Slack, Telegram, WhatsApp, DingTalk, Feishu, QQ, Matrix
- **MCP**: ✅
- **Docker**: ✅

---

## Mag 控制權限

```
Mag (主控)
    │
    ├── SSH/Tailscale → Nanobot #1 ( Ching )
    │       ├── 讀取設定
    │       ├── 修改設定
    │       ├── Debug logs
    │       └── 重啟服務
    │
    ├── SSH/Tailscale → Nanobot #2 ( Sales )
    │       └── ...
    │
    └── SSH/Tailscale → Nanobot #3 ( Engineer )
            └── ...
```

---

## 工作流

1. 每個 Nanobot 服務一位同事
2. 用 gog 串 Google Workspace
3. 結果回報到 Mattermost 各自頻道
4. Mag 統整 + 自動化

---

## 儲存

- **Memory / 日誌** → Mattermost 頻道
- **長期資料** → Obsidian / Google Drive

---

## 待辨

- [ ] 在 PVE 上測試 Nanobot
- [ ] 定義每個同事的 Skills
- [ ] 串接 ERP / 資料庫
- [ ] 設定 SSH/Tailscale 控制

---

> 建立日期：2026-03-07
