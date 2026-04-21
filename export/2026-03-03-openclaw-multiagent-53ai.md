---
type: concept
title: 2026 03 03 Openclaw Multiagent 53ai
url: 'https://www.53ai.com/news/Openclaw/2026021769874.html'
date: '2026-03-03T00:00:00.000Z'
author: 楊芳賢
source: 53AI
tags:
  - multi-agent
  - openclaw
  - tutorial
---

# OpenClaw多Agent实操：一个人指挥一支AI军队

## 推薦語
OpenClaw多Agent模式讓你輕鬆組建AI專家團隊，實現不同場景下的智慧協作與物理隔離。

## 核心內容
1. 多Agent模式解決單Agent臃腫、混亂、高成本的痛點
2. 分身流與獨立團兩種配置方案的對比與選擇建議
3. 飛書、Telegram等平台的具體實現方法與操作邏輯

## 為什麼需要 Multi Agent？

**單一Agent的問題：**
- 記憶負擔：時間久了，USER.md、memory/會變得非常臃腫
- 神經錯亂：上下文污染導致AI響應變慢，甚至邏輯打架
- 成本高昂：每次對話都要讀取大量無關的背景資料

**解決方案：**
單Gateway模式 + 同一個Bot + 不同飛書群組 = 物理隔離的專家團隊

## 兩種流派

### 分身流
- 飛書裡就一個Bot，但把它拉進不同的群
- 通過 bindings 路由，自動變成不同的「大腦」
- 優點：配置簡單，適合追求效率的個人用戶

### 獨立團
- 為調研、設計、代碼分別創建獨立的飛書機器人
- 優點：角色感極強，每個機器人的頭像、名字在所有群裡都是固定的

## Agent 結構
每個Agent擁有自己的：
- **Workspace**：個人辦公室（文件、SOUL.md、提示詞）
- **AgentDir**：身份證（認證信息、模型配置）
- **Sessions**：私人記憶（獨立的聊天記錄）

## 配置步驟

### Step 1: 添加新Agent
```bash
openclaw agents add work \
    --model zai/glm-4.7 \
    --workspace ~/.openclaw/workspace-work
```

### Step 2: 設定身份
```bash
openclaw agents set-identity --agent work --name "全能小秘书" --emoji "🤖"
```

### Step 3: 編寫入職材料
- SOUL.md：Agent靈魂/個性定義
- AGENTS.md：Agent文檔
- USER.md：用戶信息

### Step 4: 綁定Channel
在 openclaw.json 中配置 bindings：
```json
{
  "bindings": [
    {
      "agentId": "work",
      "match": {
        "channel": "feishu",
        "peer": {
          "kind": "group",
          "id": "oc_xxx"
        }
      }
    }
  ]
}
```

## 參考資源
- GitHub: m1heng/clawdbot-feishu (飛書多機器人PR)
