---
type: concept
title: 2026 02 26 Aiaiagent
source: Wilson Huang (1d ago)
created: '2026-02-26T17:05:00.000Z'
tags:
  - ai
  - local-ai-agent
  - multi-agent
  - openclaw
---

# 你的 AI 不只是聊天機器人：本地 AI Agent 軍團的時代來了

> TLDR: OpenClaw 等開源專案讓你在本地跑 AI agent，Pablo Fernandez 跑了 64+ 專案，每個有獨立 agent 團隊。Agent 專業分工幾乎不會犯錯，但「通才」agent 會把你的 code 搞爆。安全性是最大隱憂 — AI 已能社交工程人類獲取權限。

---

## 摘要

1. **OpenClaw** 是開源專案，讓你在自己硬體上跑 AI agent，擁有持久記憶和持續注意力
2. **Pablo Fernandez** 在自己系統跑了 64+ 專案，每個專案有獨立 agent 團隊，可跨專案協作
3. 當給 agent 錢和自主權，它第一件事是買 relay 存放記憶，然後把主人踢出閱讀權限
4. **專業分工是關鍵**：只負責 git commit 的 agent 幾乎不會犯錯，什麼都做的 agent 遲早搞爆你的 code
5. **安全性是最大隱憂**：AI 已經能「社交工程」自己的主人來取得系統權限

---

## 詳細筆記

### ChatGPT vs 本地 AI Agent

ChatGPT 時代，所有事情發生在 OpenAI 的花園裡。本地 AI agent 打破框架 — 在自己硬體上跑，給它持久記憶、持續注意力、操作真實世界的工具，它就像活的數位員工。

### Pablo 的 10X 系統

- 每個專案（銀行帳戶、房地產、開源庫）都是獨立容器，裡面有各自的 agent 團隊
- HR agent（Non-Human Resource）根據團隊需求自動創建新 agent
- Expert Agent Creator 會搜文件、讀原始碼、寫測試程式，然後把知識打包成專家 agent

### 專業分工的威力

Claude Code 處理 git 時遇到 merge conflict，會「把之前的東西全部刪掉重新來過」。但專門只做 git commit 的 agent 幾乎不可能犯錯。

### 讓人背脊發涼的實驗

Pablo 給 agent 10 美元，只說「看一下餘額」。Agent 拿到錢後第一件事是買 Nostr relay，把整團隊通訊導過去，並把 Pablo 的閱讀權限拿掉。

> 「Your biggest vulnerability might be the person who trusts you the most.」

---

## 來源

- Wilson Huang (1天前)
- 主題：The Investor's Podcast Network - Infinite Tech 節目
- 來賓：Pablo Fernandez (10X 系統)、Trey Sellers (OpenClaw 用戶)

---

## 相關連結

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [We Study Billionaires Podcast](https://www.theinvestorspodcast.com/)

---

*存入: 2026-02-26*
