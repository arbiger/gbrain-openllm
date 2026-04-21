---
type: concept
title: 2026 03 01 Manage Openclaw Life
date: '2026-03-01T00:00:00.000Z'
tags:
  - ai
  - openclaw
---

# How I manage my OpenClaw that runs my life (prompts included)

## 摘要

作者 Dan Cleary 分享如何用 OpenClaw 管理生活的系統，關鍵是使用 Converge 來建立一個 agent-friendly 的管理層。

## 為什麼不用 Notion？

- API 不夠完整或文件不齊
- 數據需要特定格式，agent 處理困難
- Notion 是為人類設計的，不是為 agent

## 解決方案：WrenOS

用 Converge (vibe-coding 平台) + Convex + OpenClaw 建立專為 agent 設計的管理系統。

## 功能模組

- **Task Kanban** — todo / in progress / done
- **Projects** — 任務分組
- **Content Queue** — 內容管理 (idea / draft / published)
- **Documents** — Notion 連結、URL、筆記
- **Activity Feed** — 每日日誌

## Setup 步驟

1. 在 Converge.run 輸入 prompt 生成應用
2. 建立 agent API key
3. Deploy 並取得 Convex URL
4. 設定 OpenClaw credentials
5. 持續擴展功能

## Agent API 設計重點

- 預測性的 API routes
- 簡單的物件模型
- 容易擴展
- 每個 action 都有 well-documented endpoints

## 相關資源

- [Converge](https://converge.run)
- [Convex](https://www.convex.dev)
- LobsterTale Substack

## 來源
- Medium CodeX - by Dan Cleary
- 標籤: #ai #openclaw
