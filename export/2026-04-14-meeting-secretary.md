---
type: concept
title: 2026 04 14 Meeting Secretary
---

# Meeting Secretary 正式開源：把會議錄音變成智能筆記，只要一個指令

**發布日期：** 2026-04-14  
**作者：** George  
**標籤：** #AI #LocalAI #MCP #OpenSource #MeetingAutomation

---

## 🎉 它上線了

經過一段時間的開發，[Meeting Secretary](https://github.com/arbiger/meeting-secretary) 正式開源了。

這是一個本地端優先的會議錄音處理 pipeline。只要一個指令，就能把 .m4a 檔案自動變成結構化的會議筆記——包含發音人區分、討論重點摘要、行動項目萃取，並自動按主題分類儲存。

---

## 問題是什麼

開會很容易，**追會議結論很難**。

常常發生這樣的事：
- 開會時埋頭記筆記，結果來不及聽清楚重點
- 會後要花 30 分鐘整理錄音檔，整理完已經忘了當初在吵什麼
- 行動項目寫在 LINE 裡，後來找不到

現有的雲端方案（Otter.ai、Fireflies.ai）有隱私疑慮，機密會議不能上傳。

---

## Meeting Secretary 怎麼解決

你的 Mac → 錄音 → Meeting Secretary → 結構化筆記（100% 本地）

完整流程：
1. 音檔正規化（FFmpeg）- 統一格式
2. 語音轉文字（mlx_audio + Whisper）- 本地 ASR，隱私無虞
3. 智能分析（omlx + Gemma-4）- 萃取重點、發音人標記、行動項目
4. 語意分類（symlinks）- 自動按主題歸類，不需要手動整理
5. 更新索引（index.md）- 中央導航頁，隨時查

所有東西都在你的硬碟裡。沒有資料上雲，沒有第三方接觸你的會議內容。

---

## 誰適合用

- **重視隱私的團隊** — 機密會議不能上雲，但需要會議記錄
- **AI Agent 愛好者** — 可以當作 OpenClaw MCP tool 直接呼叫
- **本地部署玩家** — 喜歡把所有東西跑在自己機器上的人
- **需要自動化的人** — 每次開會完自動產生筆記，不需要手動整理

---

## 快速開始

Clone：
git clone https://github.com/arbiger/meeting-secretary.git
cd meeting-secretary

安裝依賴：
brew install ffmpeg
pip install -r requirements.txt

餵入錄音：
python3 secretary.py --file ~/Downloads/meeting.m4a

或設定成 OpenClaw MCP tool：
openclaw mcp set secretary '{"command": "python3", "args": ["/path/to/secretary.py"]}'

---

## 下一步

- 支援更多音檔格式（MP3、WAV、WebM）
- 多語言即時翻譯
- 與現有 Calendar / Email 工具整合
- Web UI 管理介面

原始碼在 GitHub 上，歡迎 PR 和 Issue！

👉 https://github.com/arbiger/meeting-secretary

---

Meeting Secretary 是 Arbiger 開源專案矩陣的最新成員。如果你對本地 AI、Agent 架構、或是會議自動化有興趣，歡迎一起討論。
