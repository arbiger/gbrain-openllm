---
type: concept
title: 2026 03 22 Long Running Agent
author: N/A
source: N/A
created: '2026-03-22T22:20:25.000Z'
tags:
  - ai
  - anthropic
  - coding-agent
  - long-running
  - subagents
---

# Long-running Agent 的真正意思：交接零成本

> **TLDR:** 本文糾正了 Long-running Agent 的概念：核心不是「一個 session 跑很久」，而是「交接零成本」。介紹了四個工程範式：1) Planning 寫在磁碟上 2) Initializer + Coding Agent 接力架構 3) 角色化 Multi-Agent workflow（gstack）4) 多層 Review stack。來源：Anthropic《2026 Agentic Coding Trends Report》

---

Long-running Agent / Loop Agent 的真正概念：

核心觀念：Long-running 的核心是「交接零成本」，不是一個 session 跑很久。

常見痛點：Context 要爆的時候就開始 compact，甚至要 Reset Session，沒辦法延續。

𝟏. Planning — 計畫要寫在磁碟上，不是 context 裡
・Coding Agent 的 Plan Mode 的 Plan 通常只存在 context window 裡，/clear 就沒了
・用 planning-with-files skill 把計畫寫成三個 markdown 檔（task_plan.md、findings.md、progress.md）
・比喻：Context Window = RAM，Filesystem = Disk

𝟐. Long-running — 不是一個 session 一直跑，是交接零成本
Anthropic 工程團隊建造 claude.ai clone（200+ features）發現三個失敗模式：
・Agent 嘗試 one-shot 整個 app → context 在實作中途燒完
・後面的 Agent 看到前面已經有進度 → 直接宣布完成，提早下班
・Agent 寫完 code 跑 unit test 就標記 done → 但 E2E 根本是壞的

解法：Initializer + Coding Agent 雙 Prompt 架構
・第一個 session（Initializer）建立環境：feature checklist（JSON格式）、init.sh 開機腳本、空的交班日誌 claude-progress.txt、initial git commit
・每個 session（Coding Agent）跑 git flow 流程：
  1. 讀交班日誌 + git log
  2. 讀 feature list，挑最高優先做
  3. 跑 init.sh 啟動 dev server
  4. 跑 smoke test 確認 app 還活著
  5. 實作一個 feature
  6. E2E 驗證這個 feature 真的 work
  7. git commit + 更新交班日誌
・每個 session 結束時 code 必須是「可以 merge 到 main」的狀態

𝟑. Multi-Agent — 不是多開 terminal，是每個 Agent 有角色
Gstack（Garry Tan 開源的 Claude Code setup）提供角色化 workflow：
・/plan-ceo-review — CEO 視角，定義「建什麼、為什麼」
・/plan-eng-review — 工程Manager 視角，鎖定架構和 edge cases
・/review — Staff Engineer 級 code review
・/qa — 用 Chromium 瀏覽器做 E2E 測試
・/ship — deploy checklist + test coverage audit
・工程師的角色從 coder 變成 orchestrator

𝟒. Review — 多層、多模型、不只看一次
實際的多層 review stack：
・/simplify — 做完 feature 馬上跑，3 個平行 agent 分別看 code reuse / quality / efficiency
・/review — PR-level review，找 bugs、logic errors、edge cases、security issues
・/codex — 用 OpenAI Codex CLI 做完全獨立的 cross-model review
・/qa — 真瀏覽器 E2E 測試

核心理念：「Human oversight shifts from reviewing everything to reviewing what matters」

馬上可以試的工程範式轉移：
1. 裝 planning-with-files → 所有計畫從 context 搬到 filesystem
2. 在 CLAUDE.md 寫入 Session Protocol → 每個 session 自動遵守 long-running 的 7 步 loop
3. 裝 gstack → 角色化多 Agent workflow
4. 做完 feature 的 SOP 改成 /simplify → /review → /codex 三層 review
5. 建一個 Initializer prompt template 存成 custom skill → 每個新專案一鍵建立 long-running 環境

---
*Collected by: George on 2026-03-22*
