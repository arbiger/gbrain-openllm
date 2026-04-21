---
type: concept
title: 2026 04 06 Agent Engineering Workflow
---

---

## Agent Engineering Workflow（2026-04-06 新增）

**靈感來源：** Addy Osmani [agent-skills](https://github.com/addyosmani/agent-skills)

**核心流程：** Idea → Spec → Plan → Build → Test → Review → Ship

**7 個 Slash Commands：**
- /spec（規格先於程式碼）
- /plan（小任務拆分）
- /build（薄垂直切片）
- /test（測試是證明）
- /review（提升程式碼健康）
- /ship（更快等於更安全）
- /code-simplify（清晰勝於聰明）

**重要原則：**
- 每個階段之間有 Quality Gate，要通過驗證才能進入下一階段
- Spec 要包含「不做什麼」（boundaries）— 最容易被忽略
- Sub-agent 每個只做「一件完整的事」
- 「Never」是觸發 guard 的開關，不是命令

**文件位置：** `2026-04-06-Engineering-Workflow-for-Agents.md`

**應用案例：** AstroScript（第一個實驗案子：每週運勢功能）
