---
type: concept
title: 2026 03 03 Openclaw Session
---

# OpenClaw Session 記憶架構討論

**日期:** 2026-03-03
**參與:** George, Mag
**標籤:** #openclaw #memory #architecture

---

## 問題背景

George 在測試 Discord 多 channel 多人協作時，發現不同 session 的記憶不同步：
- 技術討論 (ERP) 在 Session A 做好
- 其他 session 看不到

---

## 現況：Mag 的記憶架構

```
Mag (Main Agent)
  ├── MEMORY.md         ← 全域長期記憶（所有對話共享）
  ├── memory/2026-03-03.md  ← 每日日誌
  └── memory/2026-03-02.md
```

**優點:** 跨主題資訊互通、查東西一次到位
**缺點:** Context window 會變混亂、Token 消耗增加

---

## 解決選項

| 方案 | 做法 | 適合 |
|------|------|------|
| **統一記憶** | 所有 session 共用同一個 memory | 一個人用，多主題 |
| **分離記憶** | 每個 session 有自己的 memory | 多人協作，權限隔離 |
| **混合模式** | Global + Session-specific | 最靈活 |

---

## 結論

**建議：** 先用統一記憶，把流程跑順。
- 大多數時間是自己用 → 統一記憶方便
- 多人協作 → 用 Thread 聚在一起

---

## 待處理
- [ ] 未來考慮混合模式
- [ ] 評估是否需要 Session 分離
