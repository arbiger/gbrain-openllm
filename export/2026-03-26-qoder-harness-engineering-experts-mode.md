---
type: concept
title: 2026 03 26 Qoder Harness Engineering Experts Mode
author: Qoder (@qoder_ai_ide)
source: 'https://x.com/qoder_ai_ide/status/1903823949496672664'
created: '2026-03-26T00:00:00.000Z'
tags:
  - AI
  - Coding Agent
  - Experts Mode
  - Harness Engineering
  - 軟體工程
---

# How Qoder builds Harness Engineering into Experts Mode

---

## ⚡ 一句話摘要

> 競爭優勢已從「模型能力」轉移到「模型之外的所有東西」——這就是 Harness Engineering。

---

## 🔧 核心比喻

| 層面 | 對應 |
|------|------|
| Model | CPU（原始算力） |
| Context Window | RAM（有限的工作記憶體） |
| Agent Harness | 作業系統（管理上下文、啟動程序、標準驅動） |
| Agent | 應用程式（跑在 OS 上） |

---

## 🏢 行業現狀

頂級工程組織已在生產環境使用 Harness Engineering：

- **Stripe** fork 了 Block 的開源 agent Goose，建立 Blueprint（狀態機），每週合併 1,300+ 個全 agent 驅動的 PR
- **Shopify** 開源了 Roast，工作流框架交織 AI 步驟與確定性程式碼
- **Ramp** 在 OpenCode 之上建立 Inspect，30% 的合併 PR 來自 agent
- **Coinbase** 從頭建了 Cloudbot，PR 審查週期從 150 小時縮短到 15 小時
- **OpenAI** 用 Codex 推到「零手寫程式碼」到百萬行程式碼規模

---

## ⚠️ 單一 Agent Harness 的五個結構限制

**① Context Window 是零和遊戲**
研究、寫碼、測試、review 全搶同一個窗口。任務越複雜，資訊密度越低。

**② 角色切換的認知負擔**
一個 agent 同時擔任 Tech Lead、SWE、QA、Code Reviewer → 表現很差

**③ 長執行鏈的漂移問題**
任務鏈越長，偏離原始目標的機率越高。沒有外部 checkpoint，錯誤會傳播並累積。

**④ 功能正確性驗證不足**
多數做法專注內部品質（lint、架構），但忽略驗證產品實際上是否能運作。程式碼可能乾淨、沒錯誤，但業務邏輯卻是錯的。

**⑤ 終端執行風險**
Agent 跑 shell 命令時，一個錯誤指令可能造成不可逆損害。Blocklist容易被繞過，確認對話方塊則打斷流程。

---

## 🎯 底層邏輯

> **Harness Engineering = 為 AI Agent 設計控制系統**
> 目標：構建基礎設施，讓 agent 能持續寫出正確的程式碼，跨越長時間迭代，且可審計、可回滾、可擴展。

---

*📚 資料來源：Qoder (@qoder_ai_ide) — 2026-03-24*

---

## 🏗️ Qoder Experts Mode 架構

Qoder 的 Experts Mode 對應五個問題的五個機制：

### ① 協作與執行分離
**Leader 負責協調，從不實作。**
- 接收需求 → 拆解任務 → 管理依賴 → 追蹤進度 → 回報結果
- 像是 Tech Lead + 領域工程師的角色
- Leader 本身是一個 meta-Harness，管理一群專門 Agent Harnesses

### ② 異步平行：DAG 驅動的任務編排
- 所有 SWE Agents **預設異步並行執行**
- Leader 建立專家任務時，系統**不會 blocking**
- 依賴關係形成輕量 DAG：
  - 「實作後端 API」和「建構前端頁面」並行執行
  - 「整合測試」等待兩者完成
- 每個專家在獨立 Context Window 運作 → **零和問題消失**

### ③ 星狀拓撲：集中式協調
- SWE Agents **不直接互相溝通**
- 所有協調都經過 Leader
- 拒絕點對點溝通的原因：沒人掌握完整畫面、專家之間可能做出矛盾決定、成員增加時連線追蹤呈指數增長
- 使用者也在協調路徑中：可隨時插入新指令，Leader 在下一個循環拾取

### ④ 專門角色：每個 Expert 都是自己的 Harness
- **這是影響最終輸出品質最重要的設計選擇**
- 每個 Expert 是獨立的 Harness，針對特定任務類型調整
- 不同的工具集、不同的上下文注入策略、不同的執行約束
- 不是「換 system prompt」，是**整個 Harness 都不同**
- Role isolation 從源頭消除上下文競爭 → 效果比任何壓縮策略都好

### ⑤ 跨模型調度：Harness 層的模型編排
- 單一 Agent 系統綁定一個模型處理所有事
- 但不同任務需要不同能力：研究需要強推理、寫碼需要強程式生成、瀏覽驗證需要視覺理解
- 每個 Expert 可使用不同模型：
  - **Researcher Expert** → 最強推理模型
  - **Dev Expert** → 最佳程式碼生成模型
  - **Browser Expert** → 多模態模型
  - **Reviewer Expert** → 對安全和效能問題最敏感的模型

---

## 📊 內部 Benchmark 成果

| 對比 | 品質提升 | 成本 |
|------|---------|------|
| vs 單一 Agent Mode | **+67%** | **< 2/3** |
| vs Claude Code Agent Teams | **+16%** | — |

---

> **底層邏輯**：當我們希望 Agents 像工程團隊一樣協作，Harness 就需要從「包裝單一模型」進化到「組織一個團隊」。

---

*📚 資料來源：Qoder (@qoder_ai_ide) — 2026-03-24*

---

### ⑥ 功能正確性驗證：填補業界缺口

多數 Harness 系統只能告訴你「程式碼是否乾淨」，更少能做到「產品實際上是否能運作」。

Qoder 建了三個專門的驗證 Expert：

- **Browser Expert**：在真實瀏覽器中對真實使用者流程跑 E2E 驗證，檢查互動流程、頁面渲染、視覺回歸——這是靜態分析和單元測試達不到的層級
- **QA Expert**：使用「變更感知上下文機制」，只針對「本次變更實際影響的程式碼」範圍內驗證，而非一般性地跑所有測試
- **Code Reviewer Expert**：跑語意差分 + 调用链分析，抓出那些「單獨看沒問題但會在呼叫圖其他地方引入副作用」的改動

Leader 在執行鏈中調度這三者。驗證在程式碼完成後立即觸發，錯誤在擴散到下游任務之前就被抓到。

### ⑦ Self-Evolution：從靜態 Harness 到動態學習系統

傳統 Harness 是靜態的：一次配置好就一直那樣，直到有人手動更新。

Qoder Experts 引入**任務級技能萃取**：
- 當系統偵測到修正、從失敗中恢復、或收到明確的使用者指示時，Leader 和每個 SWE Agent 會從各自的領域獨立萃取出可複用的技能
  - 寫碼 Expert → 萃取出實作模式
  - 驗證 Expert → 萃取出檢查策略
  - Review Expert → 萃取出審查啟發式

- 這些技能存在記憶系統中，遇到類似任務時自動召回
- 隨著時間推移，系統不再犯已經學過的錯誤

這個循環（任務完成 → 技能萃取 → 記憶整合 → 技能召回 → 直接成功）將靜態 Harness 轉變為真正會進步的系統。

### ⑧ 終端執行安全：多平台沙盒 + 智能攔截

寫程式碼只完成一半工作，執行才是一切風險所在的地方。

**Shell 語法解析**：
- Shell 語法在不同 OS 差異極大（Bash、PowerShell、Cmd）
- Qoder 為每種 Shell 建立獨立 AST 解析器，穿透命令巢狀結構，識別每個實際會執行的子命令
- 例如 `$(rm -rf /)` 藏在看似無害的外層命令中 → 解析器會提取出 `rm` 並標記為高風險

**三層風險檢查（全部獨立、任一觸發就阻擋）**：
1. 硬編碼 Blocklist：抓已知危險命令（`rm -rf`、`format`、`dd if=`）
2. 規則引擎：偵測「單獨無害但組合危險」的命令-參數組合
3. LLM 語意分析層：讀取命令意圖，抓到前兩層漏掉的威脅

**OS 層級沙盒**：
- 原則：**先隔離，然後在邊界內授予完整權限**
- Agent 在沙盒內自由操作，但爆震半徑有限
- Stripe 的 devboxes 也是類似做法（「cattle, not pets」），但需要雲端基礎設施；Qoder 將其做為本地產品能力

---

## 💡 核心總結

> **Harness 的複雜度不應該落在使用者身上。**
>
> 嚴謹並沒有從軟體工程消失，只是轉移了——從函式實作轉移到系統約束、從手動審查轉移到自動化治理。
>
> **不應該需要自己去 fork 開源 agent、架沙盒、設計 Blueprints、寫 500 條規則檔、實作多平台安全機制。**

---

*📚 資料來源：Qoder (@qoder_ai_ide) — 2026-03-24*

---

## 🔗 參考文獻

- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering) — OpenAI
- [Minions: Stripe's one-shot, end-to-end coding agents](https://stripe.com/blog/agents) — Stripe
- [Minions Part 2](https://stripe.com/blog/agents-part-2) — Stripe
- [Introducing Roast: Structured AI workflows made easy](https://shopify.com/blog/roast) — Shopify
- [Why We Built Our Own Background Agent](https://ramp.com/blog/background-agent) — Ramp
- [How Coinbase scaled AI to 1,000+ engineers](https://coinbase.com/blog/scaling-ai) — Coinbase

---

## 🚀 Try Experts Mode (Beta)

> **Qoder** — Agentic Coding Platform for Real Software.
> Think deeper, build better.
