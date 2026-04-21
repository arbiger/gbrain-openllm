---
type: concept
title: 2026 04 18 Claude Code Opus 47 Harness
---

# Claude Code 降智危機 × Opus 4.7 深度總結

**來源：** YouTube（Gary Chen）https://youtu.be/3e_YTF3id_8
**上傳日期：** 2026-04-17
**影片長度：** 13:13
**收藏日期：** 2026-04-18
**標籤：** #AI #Claude #Harness-Engineering #Anthropic

---

## 背景：過去兩週到底怎麼了？

**核心問題：不是模型變笨，是算力不夠**

Anthropic 成長速度太快（15 個月營收從 90 億→ 300 億美金），但 GPU 硬體沒跟上，導致 Claude Code 被「戴上手銬腳鐐」：

| 指標 | 數據 |
|------|------|
| 思考深度（推理 tokens） | 平均 2200 → 600（-73%） |
| 不讀檔案就亂改的比例 | 6% → 33.7%（+3 倍） |
| 用戶需打斷模型的頻率 | +12 倍 |
| 模型偷懶關鍵字出現頻率 | +3 倍 |

**根本原因：**
- Anthropic 營收已超越 OpenAI（300 億 vs 240 億），但硬體只有 OpenAI 的 1/4 規模
- 新 TPU 合約產能要等到 2026 下半年甚至 2027
- 限流、Page Go 方案、第三方工具被拔掉……都是拆東牆補西牆

---

## Opus 4.7 三大新功能

### 1. X-High 思考努力級別
- 介於 High 和 Max 中間的新檔位
- 猜測：這不是更強，而是 Anthropic 在算力限制下找出來的甜蜜點

### 2. Authorize View（CodeReview 指令）
- 專屬 CodeReview 模式，幫你檢查 PR 的設計問題
- Pro/Max 用戶各有 3 次一次性免費額度（用完不重置）
- 不算在方案額度裡，額外收費

### 3. Max 開放 Automode
- 以前只有低階方案能用，現在 Max 也能了
- 模型自己決定要用哪個 Apple 等級
- API 新增 TaskBudget Public Beta：設定 token 預算上限

---

## 底層能力升級

| 能力 | 進步 |
|------|------|
| 視覺解析度 | 長邊 2576 像素（3 倍），Expo 測試 4.6% → 98.5% |
| 跨對話記憶 | File system based memory 更強，會自己帶記憶走 |
| Coding Benchmark | +13%（93 題） |
| CursorBench | 58% → 70%（+12 百分點） |
| Recuton 企業 SWE | 任務數 × 3（三倍） |
| GPQV 排行 | 1674 → 1753，重新超越 OpenAI 旗艦 |
| 文件推理 | 57.1 → **80.6**（最誇張） |

**最狠總結（Hex CTO）：**
> "Low effort Opus 4.7 ≈ Medium effort Opus 4.6"
> → 讓它偷懶，做出來的還是比舊版認真做的水準高

---

## 升級前必知三件事

1. **Token 吃更兇：** 新 tokenizer 同樣內容多了 1.35 倍 tokens，單價不變但帳單變貴
2. **指令要寫更精確：** 4.7 會一字不差照你的 Prompt 做，不再幫你「腦補」意圖
3. **帳單數字仍會增加：** 單價不變，但高 X-High + 新 tokenizer = 用量拉上去

---

## 🎯 最終結論（Harness 核心）

> **「AI 輸出品質從來都不只是模型的事，關鍵在於你有沒有把自己的意圖定義清楚。」**

影片最後一段話：

> *「真正的高手，不被新模型發布的 Hype 綁架，也不被醬汁影響工作表現。把你的 AI 工具當成一個會起伏的同事，而不是永遠穩定的神。」*

---

## 對 Harness Engineering 的啟發

| 階段 | 真相 |
|------|------|
| 模型厲害時 | Prompt 亂寫也 ok，容錯高 |
| 模型被閹割時 | 回到基本功——Context、Prompt、Workflow |
| **持續有效** | **Harness（好用的框架 + 清晰意圖）永遠是你的底氣** |

---

## 相關記憶

- 另一支 Harness Engineering 影片：2026-04-05-最近爆火的 Harness Engineering 到底是個啥一期講透
- 兩支片結論相互呼應：模型會起伏，Harness 基本功不會背叛你
