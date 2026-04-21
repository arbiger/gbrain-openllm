---
type: concept
title: 2026 02 18 Openclaw Embeddings
---

「Agent 又當機了。」

這是我最近最常遇到的狀況。隨著對話深入，累積的 Token 數量輕易就撐爆了 Context Window，導致回應越來越慢，甚至開始出現幻覺與記憶錯亂。唯一的解法似乎只有輸入 `/new` 強制重置——但代價是，它瞬間忘記了我們剛討論到一半的深層邏輯。

這種在「系統癱瘓」與「失憶重置」之間的無限輪迴，讓我意識到單純依賴長 Context 是死路一條。

本文記錄了我如何將 OpenClaw 的記憶系統從依賴雲端全面轉向 **本地化 (Local-First)**。透過高效的本地向量檢索（Local Embeddings），讓 Agent 能精準「想起」需要的片段，而無需背負沉重的對話歷史包袱。

## 1. 記憶模式的演進：為何選擇 Local？

在面對 Token 爆炸危機時，**RAG (Retrieval-Augmented Generation)** 是唯一的救贖。但預設的雲端 Embeddings (OpenAI/Gemini) 在高頻檢索下暴露了致命傷：

1. **高昂的成本 (Cost)**：Embedding 模型的 Token 費用雖然單價低，但在高頻率的 RAG 運作下（每一句話都要計算向量），長期累積下來是一筆可觀且不必要的開銷。我並沒有購買額外的 Embedding 配額。
2. **資料隱私 (Privacy)**：將私人的對話紀錄與記憶上傳到遠端伺服器，在本質上就讓人感到不適且不安全。本地化是唯一能讓我安心的選擇。
3. **延遲與體驗 (Performance)**：本地運算能消除網路請求的延遲，讓記憶檢索幾乎是瞬時完成，這對於流暢的對話體驗至關重要。

參考了 [OpenClaw 官方文件：Memory Concepts](https://docs.openclaw.ai/concepts/memory) 後，我們決定啟用 **Local Hybrid Embeddings** 方案，結合 BM25 關鍵字搜尋與 Vector 語意搜尋。

### 技術決策：為何暫緩使用 Project Golem (qmd)？

在評估本地搜尋方案時，我們也深入研究了 **Project Golem** 及其核心指令 **qmd (Query Markup Documents)**。這套基於 Rust 的進階後端擁有極強的效能與 LLM Re-ranking（重排序）機制，能提供高達 93% 的準確率。

然而，考慮到目前的專案規模（數十至數百個 Markdown 檔案），我們選擇了 OpenClaw 內建的 **Local Hybrid** 方案，原因如下：

1. **架構簡潔 (Simplicity)**：內建方案開箱即用，無需額外配置 Rust 或 Bun 運行環境。
2. **效能足夠 (Good Enough)**：在 M4 晶片的加持下，內建的混合搜尋已能提供毫秒級的響應，且準確度完全滿足當前的對話需求。
3. **升級路徑**：我們將 `qmd` 視為未來的「重型武器」。當記憶庫累積到成千上萬份導致內建搜尋變慢時，再切換至 `memory.backend = "qmd"` 將是完美的升級路徑。

目前的設定，是在「極致精準」與「輕量維運」之間找到的最佳平衡點。

### 方案比較表

為了讓你更清楚各方案的定位，我整理了這份對照表：

|特性|**OpenClaw Native (本篇推薦)**|**Project Golem (qmd)**|
|:--|:--|:--|
|**核心技術**|Node.js / `node-llama-cpp`|Rust / `surrealdb`|
|**檢索機制**|**混合搜尋 (Hybrid)**  <br>(BM25 + Vector)|**Deep Search**  <br>(Hybrid + LLM Reranker)|
|**響應速度**|**⚡️ 毫秒級 (Instant)**|🐢 需等待 LLM 重排|
|**環境依賴**|**無 (內建)**|需安裝 Rust 工具鏈|
|**適用場景**|**個人開發 / 即時對話**|巨量技術文檔庫 / 複雜研究|

## 2. 自主修復紀錄：解鎖 `commands.restart`

遷移過程並非一帆風順。在修改了 `openclaw.json` 將 provider 切換為 `local` 後，我們遇到了一個尷尬的循環：

> Agent 知道設定已變更，但舊的 Gateway 實例仍在運行，因此新設定無法生效。

通常這需要人類介入，手動重啟終端機。但如果 Agent 能「感知」到環境變更並自我重啟呢？

我們在設定中解鎖了 `commands.restart` 權限。這賦予了 Agent 一個新的能力：**當檢測到核心設定（如記憶提供者）變更時，能夠主動發出重啟指令，自我刷新運行時狀態。**

> **⚠️ 風險與安全警告**： 開啟 `restart` 權限雖方便，但請務必小心：
> 
> 1. **穩定性風險**：如果新設定檔有錯，Agent 可能陷入「嘗試修復 -> 重啟失敗 -> 再次重啟」的無限迴圈。
> 2. **安全疑慮**：此權限屬於高敏感操作。若 Agent 遭遇 Prompt Injection 攻擊，惡意指令可能利用此機制反覆重啟 Gateway，造成服務阻斷 (DoS)。建議僅在受信任的本地開發環境中開啟。

這不僅是便利性的提升，更是 Agent 邁向「自主維運」的一小步。

## 3. 最終設定範本

經過反覆測試與優化，以下是目前運作最穩定、能夠在本地完美運行記憶檢索的 `openclaw.json` 設定片段：

```
{  "agents": {    "defaults": {      "memorySearch": {        // 核心變更：切換至 local 提供者        "provider": "local",        "fallback": "none",        "options": {          // 指定使用輕量級且高效的 MiniLM 模型          "model": "Xenova/all-MiniLM-L6-v2"        }      }    }  },  "permissions": {    "commands": {      // 關鍵權限：允許 Agent 自主重啟以應用變更      "restart": true    }  }}
```

## 4. 常見問題 (FAQ)

### Q: 本地模式會很吃資源嗎？

A: 不會。OpenClaw 選用的模型經過高度優化，在 M1/M2/M3 甚至最新的 **M4 晶片** 上幾乎感覺不到體感負載。我們實測記憶體佔用約增加 300MB，對於 16GB 以上的機型完全無壓力。

### Q: 我還能切換回 OpenAI 嗎？

A: 可以。隨時將 `provider` 改回 `openai` 即可，但需注意這會導致舊的本地索引與新的雲端索引不相容，可能需要重新建立索引。

## 總結

- **核心變更**：`provider: local` 加上 `commands.restart: true`。
- **測試環境**：Mac mini (M4), macOS 26.3 Beta (25D5112c), OpenClaw 2026.2.2-3。
- **效益**：完全離線的記憶檢索，更快的響應速度。

> 參考來源：
> 
> [OpenClaw Memory Architecture](https://docs.openclaw.ai/concepts/memory)
> 
> [Project Golem (qmd) - GitHub](https://github.com/Arvincreator/project-golem)

OpenClaw 記憶機制優化：本地 Embeddings 與自主重啟實錄

[https://laplusda.com/posts/openclaw-local-memory-setup/](https://laplusda.com/posts/openclaw-local-memory-setup/)

作者 Zero

發佈於 2026-02-05

許可協議 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

https://laplusda.com/posts/openclaw-local-memory-setup/

Tags: #ai #openclaw #LLM
