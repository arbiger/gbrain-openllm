---
type: concept
title: 2026 04 06 Engineering Workflow For Agents
---

# Engineering Workflow for AI Agents

> 靈感來源：Addy Osmani [agent-skills](https://github.com/addyosmani/agent-skills)
> 討論日期：2026-04-06
> 應用案例：AstroScript（第一個實驗案子）

---

## 核心流程

```
Idea → Refine → Spec → Plan → Build → Test → Review → Ship
```

每個階段之間有 **Quality Gate**，不是做完就進入下一個，要先通過驗證。

---

## 七個命令對應的階段

| Slash Command | 階段 | 核心原則 |
|--------------|------|---------|
| `/spec` | Spec | 規格先於程式碼 |
| `/plan` | Plan | 拆分為小、可驗證的任務 |
| `/build` | Build | 薄垂直切片（thin vertical slices）|
| `/test` | Test | 測試是證明，不是事後補 |
| `/review` | Review | 提升程式碼健康 |
| `/ship` | Ship | 更快等於更安全 |

---

## 關鍵原則（George 吸收版）

### ✅ 對的

1. **規格先行** → 先想清楚「做什麼」和「不做什麼」
2. **分小子任務** → 對應 sub-agent 的顆粒度控制
3. **增量建構** → 小案子適合 thin vertical slices
4. **來回修改** → 每段輸出都要被驗證
5. **多用 never** → 不是禁止，是觸發 guard 的開關

### ⚠️ 容易被忽略的

1. **Spec 的 Boundaries** — 要寫「不做什麼」，不只是「做什麼」
2. **Quality Gate** — 每階段結束前要通過驗證才能進入下一階段
3. **Sub-agent 顆粒度** — 每個 agent 只做「一件完整的事」

---

## Spec 模板

每個 spec 應該包含：

```markdown
## Objectives
目標是什麼？

## Commands to run
怎麼驗證成功？

## Structure
目錄結構 / 模組設計

## Code style
寫法約束（如：ESLint rules、命名規範）

## Boundaries（最容易被忽略！）
- 明確不做什麼
- 限制範圍
- 哪些是 out of scope
```

---

## Anti-Rationalization Table（Never 觸發器）

| 當你想... | 停下來，先問... |
|-----------|-----------------|
| 一次做太多 | 這段能不能更小？|
| skip 測試 | 這段邏輯誰來驗證？|
| 假設用戶需求 | 用戶真的說了嗎？|
| 跳過 spec 直接寫 code | 約束條件想清楚了嗎？|
| 一次丟很多給 sub-agent | 每個 agent 的職責是什麼？|

---

## Quality Gate 檢查清單

### Idea → Spec
- [ ] 目標清楚
- [ ] Out of scope 明確
- [ ] 成功標準定義

### Spec → Plan
- [ ] 任務夠小（~100 lines per change）
- [ ] 每個任務可獨立驗證
- [ ] 任務之間的依賴關係清楚

### Plan → Build
- [ ] 每個任務都有 acceptance criteria
- [ ] 測試策略確定（unit/integration/e2e）

### Build → Test
- [ ] 程式碼符合 spec 的 boundaries
- [ ] 測試覆蓋關鍵邏輯

### Test → Review
- [ ] 所有測試通過
- [ ] Code review 通過

### Review → Ship
- [ ] 文件更新
- [ ] Change log 寫了

---

## AstroScript 應用構想

**現狀：**
- 核心功能：星盤計算（Swiss Ephemeris）
- Landing page：已建立
- 每週運勢：待建構
- 塔羅牌模組：待建構

**可以套用的地方：**
1. 把「每週運勢功能」當成第一個完整的 spec → plan → build → test → review → ship 流程
2. 用 Quality Gate 確保每個功能上線前都有驗證
3. Sub-agent 分工：一個負責計算邏輯、一個負責 HTML 報告、一個負責 email 流程

**備註：** 這個案子不大，很適合拿來練習 incremental build 的方式。

---

## 相關標籤

#方法論 #AI-Agent #Engineering-Workflow #Addy-Osmani #agent-skills #AstroScript
