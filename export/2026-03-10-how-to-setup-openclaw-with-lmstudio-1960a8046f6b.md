---
type: concept
title: 2026 03 10 How To Setup Openclaw With Lmstudio 1960a8046f6b
source: >-
  https://nwosunneoma.medium.com/how-to-setup-openclaw-with-lmstudio-1960a8046f6b
created: '2026-03-10T14:51:49.000Z'
tags:
  - ai
  - lmstudio
  - openclaw
  - setup
---

# How to Setup OpenClaw With LMStudio

> TLDR: 本地端架設 OpenClaw + LMStudio 教學，使用量化版 GLM-4.7 Flash 模型

---

## 硬體環境
- Lenovo Thinkpad
- OS: Linux (非 WSL)
- 模型: GLM-4.7 Flash (量化版)

## 安裝步驟

### 1. 安裝 LMStudio
- 安裝難度有點高 (對 Linux 新手)
- 參考影片: https://www.youtube.com/watch?v=Bhzpph-OgXU

### 2. 選擇模型
- 因硬體限制選擇量化版 GLM-4.7 Flash
- 測試回應時間: 50.57 秒 (較慢，但可接受實驗)

### 3. 安裝 OpenClaw
```bash
curl -fsSL https://openclaw.bot/install.sh | bash
```
- 選擇手動配置

### 4. 編輯 openclaw.json
在 `~/.openclaw/openclaw.json` 加入 LMStudio 設定：

```json
{
  "models": {
    "providers": {
      "lmstudio": {
        "baseUrl": "http://127.0.0.1:1234/v1",
        "apiKey": "lm-studio",
        "api": "openai-responses",
        "models": [
          {
            "id": "glm-4.7-flash",
            "name": "GLM-4.7 Flash",
            "reasoning": true,
            "contextWindow": 20000,
            "maxTokens": 8192,
            "cost": { "input": 0, "output": 0 }
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "lmstudio/glm-4.7-flash"
      }
    }
  }
}
```

### 5. 生成 Token
```bash
openssl rand -hex 20
```

### 6. 驗證設定
```bash
openclaw setup
# 輸出:
# Config OK: ~/.openclaw/openclaw.json
# Workspace OK: ~/.openclaw/workspace
# Sessions: OK: ~/.openclaw/agents/main/sessions
```

### 7. 啟動 Gateway
```bash
openclaw gateway status
# Listening: 127.0.0.1:18789
```

---

## 結論
- 作者初次設定完成，後續會繼續測試
- 本地模型好處：免 API 費用、隱私
- 缺點：回應速度較慢

---

*存入: 2026-03-10*
