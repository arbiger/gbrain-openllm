---
type: concept
title: 2026 03 08 Ai Agent Openfang Zeroclaw Nanobot
---

# AI Agent 系統架構討論 - OpenFang / ZeroClaw / NanoBot 選項

日期: 2026-03-08
標籤: #AI #Agent #OpenFang #ZeroClaw #NanoBot #OpenClaw

---

## 討論背景

思考 AI Agent 加入工作流的可行性：
1. 短期目標：增加工作效率
2. 中長期目標：減少人力

---

## AI 團隊架構概念

### 核心理念
- **Agent = 員工的 AI 助手**
- **Monitor = 隱形監督 (不能說)**
- **PostgreSQL = 統一資料源**
- **系統自成長 = 觀察學習**

### 工作流程
```
員工 + Agent → 討論需求 → 圍繞 PostgreSQL 創造工具
                                            ↓
                                    每日總結與建議
                                            ↓
George (老闆) ← 統整建議 ← Mag (我)
```

---

## AI Agent 選項比較

| 項目 | OpenClaw | NanoBot | ZeroClaw | OpenFang | PicoClaw |
|------|----------|---------|----------|----------|-----------|
| 語言 | TypeScript | TypeScript | Rust | Rust | Go |
| RAM | >1GB | 輕量 | <5MB | 32MB | <10MB |
| Mattermost | ✅ | ❓ | ✅ | ❓ | ❌ |
| 彈性 | 高 | 中 | 低 | 高 | 低 |
| 定位 | 全功能 | 平衡 | 安全 | Agent OS | 超輕量 |

---

## OpenFang 詳細規格

### 特色
- 單一 binary: 32MB
- 7 Hands (預建代理)
- 16 security systems
- 53 tools
- 40 channels
- 27 LLM providers
- Dashboard: http://localhost:4200
- 不需要 Docker/pip

### 7 Hands 功能

| Hand | 功能 |
|------|------|
| Clip | YouTube → 短影片 + AI 配音 |
| Lead | 潛在客戶發現 + 評分 |
| Collector | OSINT 監控 + 知識圖譜 |
| Predictor | 預測引擎 (含信心區間) |
| Researcher | 深度研究 + 引用報告 |
| Twitter | 自動發文 + 互動 |
| Browser | 網頁自動化 (需審批) |

### OpenFang 應用想像

```
OpenFang Hands          你的系統
────────────────────────────────
Lead (改)          →   Supplier Finder (供應商搜尋)
                         ↓
                   component-price-tracker (價格追蹤)
                         ↓
                   水位系統 (庫存)
                         ↓
                   下單系統 (PO)

Collector (OSINT)  →   競爭對手/供應商監控
Researcher        →   市場研究
Browser           →   自動報價/下單 (需審批)

⚠️ 目前無現成採購 Hand，需改造 Browser/Lead Hand
```

---

## 安全機制比較

### WASM Sandbox (OpenFang)
- 隔離程式碼執行環境
- 防止惡意程式碼影響主系統
- 類似「保全系統」，正常生活不受影響

### Workspace (ZeroClaw)
- 隔離檔案/目錄存取
- 防止亂讀寫檔案
- 類似「防盜門」，進出不方便但安全

### 綁手程度評估

| 安全層級 | 綁手程度 | 適合誰 |
|----------|----------|--------|
| None (裸奔) | ❌ 完全不綁 | 個人實驗 |
| ZeroClaw workspace | ⚠️ 稍微 | 團隊內部 |
| WASM Sandbox | ⚠️⚠️ 較多 | 生產環境 |

**結論**: OpenFang 設計較平衡，應該不會綁手綁腳

---

## 待完成功能 (CRM/採購/生產)

### 已完成 ✅
- [x] 研發助理 - gog 查詢共用 email

### 外銷業務 CRM
- [ ] A. 業務歷史報價查詢
- [ ] B. Quotauton / 報價單產生
- [ ] C. Invoice / Packing List 產生
- [ ] D. 接單後通知生產系統

### 採購模組
- [ ] 2-1. 計算水位
- [ ] 2-2. 產出訂單

### 生產模組
- [ ] 生產交期計算

---

## 開發流程建議

```
討論需求 → 寫規劃書 → 給 Antigravity 實作
(省 token)
```

---

## 參考資源

- OpenFang: https://github.com/RightNow-AI/openfang
- ZeroClaw: https://github.com/zeroclaw-labs/zeroclaw
- NanoBot: https://github.com/HKUDS/nanobot
- PicoClaw: https://github.com/sipeed/picoclaw
- OpenFang 官網: https://openfang.sh/
