---
type: concept
title: 2026 04 20 Openclaw Codex Claude Code Agent Swarm
author: 匿名（OpenClaw用戶分享）
source: N/A
created: '2026-04-20T20:01:31.000Z'
tags:
  - Agent Orchestrator
  - Agent Swarm
  - Claude Code
  - Codex
  - Context Window
  - Dev Team
  - Git Worktree
  - Mac Mini
  - Minions
  - OpenClaw
  - Parallel Agents
  - Stripe
  - Zoe
  - 一人開發團隊
---

# OpenClaw + Codex/Claude Code Agent Swarm：一個人開發團隊的完整設定

---

【OpenClaw + Codex/Claude Code Agent Swarm：一個人開發團隊的完整設定】

---

■ 作者的前提

作者在 2025 年 1 月之前直接使用 Codex/Claude Code，2025 年 1 月之後用 OpenClaw 作為協調層（orchestration layer），讓 Zoe（OpenClaw agent）統籌其他 Codex/Claude Code agents。

---

■ 成果亮點

- 單日最高 94 commits（那天有 3 個客戶電話，壓根沒開編輯器）
- 平均每天約 50 commits
- 30 分鐘內 7 個 PRs
- 想法 → 產品上線閃電快
- 每月成本：約 （Claude）+ （Codex），可從  開始

---

■ 為何需要 Agent Orchestrator

【為何一個 AI 無法同時做兩件事】

Context window 是零和遊戲。
- 填入代碼 → 沒有空間裝業務上下文
- 填入客戶歷史 → 沒有空間裝程式碼庫

這就是兩層系統為何有效的原理：每個 AI  loaded with exactly what it needs.

【Codex/Claude Code 的盲點】
它們看得懂代碼，但不懂你的業務全貌。

【OpenClaw 作為協調層】
- 持有所有業務上下文（客戶資料、會議記錄、過往決策）
- 翻譯歷史上下文為精確的 prompts
- Coding agents 專心寫代碼，orchestrator 專心做高層策略

---

■ 與 Stripe Minions 的異曲同工

Stripe 發表的背景 agent 系統「Minions」——平行 coding agents + 集中式協調層。
作者說：我無意中建了同樣的系統，只是跑在我的 Mac mini 上。

---

■ 完整 8 步工作流（真實範例）

**Step 1：客戶請求 → Zoe 評估範圍**

客戶電話後想要跨團隊復用配置。
作者和 Zoe 一起 scope 出功能需求（template 系統）。
Zoe 做三件事：
1. 立即充值 credits 解除客戶封鎖
2. 從 prod 資料庫拉取客戶配置（read-only access，Codex agents 永遠不會有這個）
3. Spawn Codex agent，附上包含所有上下文詳細 prompt

**Step 2：Spawn the Agent**

每個 agent 有自己的工作樹（隔離 branch）和 tmux session：
```bash
git worktree add ../feat-custom-templates -b feat/custom-templates origin/main
cd ../feat-custom-templates && pnpm install
```

（待續——文章中後還有 Step 3-8）

---
*Collected by: George on 2026-04-20*


---

## Step 3：Monitoring in a Loop

Cron job 每 10 分鐘檢查所有 agents（改進版 Ralph Loop）。
不是直接 poll agents（太貴），而是讀取 JSON registry 檢查：

`.clawdbot/check-agents.sh` 的功能：
- 檢查 tmux sessions 是否活著
- 檢查追蹤 branch 上的 open PRs
- 透過 gh cli 檢查 CI 狀態
- CI fail 或關鍵 review feedback → 自動 respawn（最多 3 次）
- 只有需要人類介入才 alert

作者：I'm not watching terminals. The system tells me when to look.

---

## Task Registry 格式

啟動時寫入 `.clawdbot/active-tasks.json`：
```json
{
 "id": "feat-custom-templates",
 "tmuxSession": "codex-templates",
 "agent": "codex",
 "description": "Custom email templates for agency customer",
 "repo": "medialyst",
 "worktree": "feat-custom-templates",
 "branch": "feat/custom-templates",
 "startedAt": 1740268800000,
 "status": "running",
 "notifyOnComplete": true
}
```

完成時更新：
```json
{
 "status": "done",
 "pr": 341,
 "completedAt": 1740275400000,
 "checks": {
  "prCreated": true,
  "ciPassed": true,
  "claudeReviewPassed": true,
  "geminiReviewPassed": true
 },
 "note": "All checks passed. Ready to merge."
}
```

---

## Step 4：Agent 建立 PR

Agent  commit → push → `gh pr create --fill`
這階段還不會通知作者——PR 本身不是 done。

**Definition of Done（很重要，agent 必須知道）：**
- PR created
- Branch synced to main（無 merge conflicts）
- CI passing（lint, types, unit tests, E2E）
- Codex review passed
- Claude Code review passed
- Gemini review passed
- Screenshots included（if UI changes）

---

## Step 5：Automated Code Review

每個 PR 由三個 AI 模型 review，各有分工：

| 評論者 | 擅長 | 評價 |
|--------|------|------|
| **Codex Reviewer** | Edge cases、邏輯錯誤、race conditions | 最徹底，false positive 低 |
| **Gemini Code Assist** | 安全問題、可擴展性問題 | 免費且實用，會給出具體修復建議 |
| **Claude Code Reviewer** | 驗證其他 reviewer 標記的問題 | 多數建議過度工程化，mostly useless |

三個都直接在 PR 上留言。

---

## Step 6：Automated Testing

CI pipeline 包含：
- Lint + TypeScript checks
- Unit tests
- E2E tests
- Playwright tests（對 preview 環境跑的測試，與 prod 完全相同）

新增規則（上周）：PR 有改任何 UI → 必須在 PR description 附截圖，否則 CI fail。
好處：作者不需要點进 preview 看，只看截圖就知道改什麼。

---

## Step 7：Human Review

這時作者終於收到 Telegram 通知：「PR #341 ready for review.」

此時狀態：
- ✅ CI passed
- ✅ 三個 AI reviewers 都approved
- ✅ 截圖顯示 UI 改動
- ✅ Edge cases 都有記錄在 review comments

作者實際 review 時間：**5-10 分鐘**。很多 PR 直接 merge，根本不需要讀代碼。

---

## Step 8：Merge + 清理

PR merges。
每日 cron job 清理孤兒 worktrees 和 task registry json。

---

## The Ralph Loop V2

**Ralph Loop 原始概念：** 從記憶拉上下文 → 產生輸出 → 評估結果 → 保存學習。

**多數實作的問題：** 每個 cycle 都跑同樣的 prompt。學到的東西改善未來檢索，但 prompt 本身是靜態的。

**作者的改進方向：** 讓 prompt 本身隨著學習動態演化。


---

## Zoe 的進化：Failure Handling + Proactive Discovery

**Agent 失敗時，Zoe 不只是重跑同樣的 prompt，而是根據完整業務上下文找出解法：**

| 失敗類型 | Zoe 的回應 |
|----------|------------|
| Agent  context 用完了 | "Focus only on these three files." |
| Agent 走向錯誤方向 | "Stop. The customer wanted X, not Y. Here's what they said in the meeting." |
| Agent 需要 clarfication | "Here's customer's email and what their company does." |

Zoe babysits agents through to completion。她擁有 agents 沒有的 context——客戶歷史、會議記錄、過去嘗試過什麼、為何失敗。她用這些 context 在每次重試時寫出更好的 prompts。

**Zoe 主動找工作的時機：**
- ☀️ 早上：掃描 Sentry → 发现 4 個新錯誤 → spawn 4 個 agents 調查並修復
- 📞 會議後：掃描會議紀錄 → 標記 3 個客戶提到的功能需求 → spawn 3 個 Codex agents
- 🌙 傍晚：掃描 git log → spawn Claude Code 更新 changelog 和客戶文檔

作者原話：客户电话后去散步。回来一看 Telegram：「7 PRs ready for review. 3 features, 4 bug fixes.」

**成功 pattern 會被記錄下來：**
- "This prompt structure works for billing features."
- "Codex needs the type definitions upfront."
- "Always include the test file paths."

Reward signals：CI passing + 三個 code reviews passing + 人類 merge。
任何失敗都觸發 loop。時間久了，Zoe 的 prompts 越來越好。

---

## 如何選擇合適的 Agent

| Agent | 擅長 | 用途 |
|-------|------|------|
| **Codex** | backend logic、複雜 bugs、跨檔案重構、需要推理的任務 | 90% 的工作主力 |
| **Claude Code** | frontend、git 操作（權限問題少）| 按鈕樣式修復 |
| **Gemini** | 設計品味 | 生成 HTML/CSS spec → 交給 Claude Code 實作 |
| **Gemini** | 不同 superpower | 美麗的 UI 先由 Gemini 設計，Claude Code 接手 component system 實作 |

Zoe 根據任務選擇正確的 agent，並在它們之間路由輸出。

---

## How to Set This Up

作者說：把這篇文章貼進 OpenClaw，告訴它「Implement this agent swarm setup for my codebase.」
它會：
- 讀取架構
- 建立 scripts
- 設定目錄結構
- 配置 cron 監控

**10 分鐘完成。No course to sell you.**

---

## 瓶頸：沒人預期到的天花板

**RAM 是瓶頸。**

每個 agent 需要：
- 自己的工作 tree
- 自己的 node_modules
- 同時跑 builds、type checks、tests

5 個 agents 同時運行 = 5 個平行 TypeScript 編譯器 + 5 個測試運行器 + 5 組 dependencies。

作者 16GB Mac Mini → 最多 4-5 agents 就開始 swap。

作者因此入手 Mac Studio M4 Max 128GB RAM（$3,500），2025 年 3 月底到貨，會分享是否值得。

---

## Up Next：一人百萬美元公司

**2026 年會看到大量一人百萬美元公司。**

核心想像：
- AI orchestrator 作為自己的延伸（Zoe 之於作者）
- delegation 給專業化的 agents（Engineering / Customer Support / Ops / Marketing）
- 每個 agent 專注自己擅長的事
- 人類保持雷射聚焦 + 完全控制

下一波創業者不會僱 10 個人做一個人靠對的系統就能完成的事。他們會這樣建造——保持小而美、快速、每日 delivery。


---

## 作者的真心話（尾部）

**對 AI slop 的反省：**

> "There's so much AI-generated slop right now. So much hype around agents and 'mission controls' without building anything actually useful. Fancy demos with no real-world benefits."

作者說：我在嘗試做相反的事——少點 hype，多點實際建造的記錄。**真實客戶、真實營收、真實 commit 生產到 production，也有真實虧損。**

**作者在建的產品：Agentic PR**

- 定位：一人公司挑戰企業 PR 行業現有巨頭
- 價值主張：幫助 startups 獲得媒體曝光，**不需要 $10k/month retainer**
- 做法：agents 幫助 startups 做 PR

作者說：If you want to see how far I take this, follow along.
