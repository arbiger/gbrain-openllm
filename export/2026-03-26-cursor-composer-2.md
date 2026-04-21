---
type: concept
title: 2026 03 26 Cursor Composer 2
author: Cursor Research Team
source: >-
  https://cursor.com/resources/Composer2.pdf +
  https://cursor.com/blog/composer-2
created: '2026-03-26T00:00:00.000Z'
tags:
  - AI
  - Composer2
  - Cursor
  - MoE
  - RL
  - 強化學習
  - 程式開發
---

# Cursor Composer 2 技術報告摘要

---

## 🎯 核心成果

| Benchmark | Composer 2 | Composer 1.5 | Composer 1 |
|-----------|-----------|-------------|------------|
| **CursorBench** | 61.3 | 44.2 | 38.0 |
| **Terminal-Bench 2.0** | 61.7 | 47.9 | 40.0 |
| **SWE-bench Multilingual** | 73.7 | 65.9 | 56.9 |

**價格**：$0.50/M input / $2.50/M output tokens

---

## 🗺️ 訓練路徑（兩階段）

### Stage 1：Continued Pretraining（持續預訓練）

- **基座模型**：Kimi K2.5（MoE 架構，總參數 1.04T / 激活參數 32B）
- **資料**：海量 code-heavy 數據
- **上下文擴展**：32k → **256k**
- **目標**：讓模型骨子裡刻滿「代碼直覺」，perplexity 直線下降，代碼理解能力起飛

### Stage 2：大規模異步 RL（強化學習）

- **訓練環境**：在真實 Cursor Session 裡訓練（用 AnyRun 快照 + 全工具鏈動態裁剪）
- **獎勵函數**：正確性簡潔性、風格一致性、工具使用效率
- **關鍵手段**：硬任務上採樣 + 自總結鏈式生成，形成閉環迭代

---

## 🔸 核心黑科技

> **訓練 = 生產環境零差異，domain gap 幾乎為 0**

教出來的 Composer 2 一上線直接碾壓 Opus 4.6：
- CursorBench：**61.3% vs 44.2%**（+17.1%）
- SWE-bench Multilingual：**73.7%**

---

## 🛠️ 可複製的 6 步方法論

1. **選強 MoE 基座起步**：Qwen2.5-Coder / DeepSeek / Kimi 類開源，省錢省力
2. **Continued Pretrain 自家代碼庫**：把過去 1-2 年所有項目 + Git History + PR 評論打包成 code-heavy 數據集，用 LoRA 微調 32k→256k 長上下文
3. **強制加 Self-Summarization**：Prompt 裡永遠先要求「先總結上文關鍵信息，再輸出下一步規劃」
4. **搭建異步 RL 閉環**：用任何 AI coding 工具 + 本地工具（grep/edit/shell），讓 AI 自己跑任務→自己打分→再訓練（Ray 或 LangGraph 就夠）
5. **引入 Non-Linear Penalty**：Prompt 裡加「簡單任務別廢話，複雜任務必須多想 3 步」，結合溫度+長度懲罰調行為
6. **建立自己的 Benchmark 飛輪**：記錄真實需求，測準確率+成本，形成數據閉環持續迭代

---

## 📄 官方資源

- **論文 PDF**：https://cursor.com/resources/Composer2.pdf
- **發布文章**：https://cursor.com/blog/composer-2
- **模型文檔**：https://cursor.com/docs/models/cursor-composer-2

---

*📚 資料來源：Cursor Research Team — Composer 2 Technical Report*
