---
type: concept
title: 2026 04 17 Distribution Engineer Four Levels Framework
author: N/A
source: N/A
created: '2026-04-17T23:12:44.000Z'
tags:
  - research
---

# Distribution Engineer - Four Levels Framework

> **TLDR:** Distribution Engineer 四個層次：L1 自動化現有工作、L2 AI 作為思考夥伴、L3 做以前性價比太低的工作、L4 建只有你會建的客製工具。Anthropic 案例：用 sub-agent 分工（Figma plugin + MCP server + memory system）把廣告創作從 2 小時縮短到 15 分鐘，產出增加 10 倍。

---

He splits the work into two specialised sub-agents. One that only writes headlines, capped at 30 characters. One that only writes descriptions, capped at 90 characters. Each agent is tuned to its specific constraint so the output quality is way higher than cramming both into a single prompt. This is agent architecture applied to ad copy. This is systems thinking and systems engineering.

Then he built a Figma plugin that takes all those new headlines and descriptions, finds the ad templates in his Figma files, and automatically swaps the copy into each one. Up to 100 ready-to-publish ad variations generated at half a second per batch. What used to take hours of duplicating frames and copy-pasting text by hand, gone.

For performance tracking he built an MCP server connected to the Meta Ads API. Ask Claude which ads performed best this week. Get real answers from live data. No dashboard. No manual reporting.

And the part that closes the entire loop: a memory system that logs every hypothesis and every experiment result across iterations. So when he generates the next batch, Claude automatically pulls in what worked and what didnt from every previous round. A self evolving system - not available in any saas, custom made for his unique flows and products.

Ad creation went from 2 hours to 15 minutes. 10x more creative output. More variations tested across more channels than most full marketing teams.

The Four Levels. Most People Are At The Bottom.

Level 1: Automate what you already do. Reporting, copy, data pulls. You replaced a few hours of grunt work. This is table stakes. Everyone will be here within 6 months.

Level 2: Use AI as a thinking partner where its better than you. Build a marketing knowledge base with your in-house data, competitor research, previous campaigns. Hook up multiple models running in parallel. It requires you to actually build something. Most marketers dont build. They operate.

Level 3: Do work that was below the ROI threshold before. Mining negative keywords across every ad group. Monitoring every competitor move in real time. Turning every webinar into a brand-voice article. This work always existed in theory. Nobody had the hours for it. The Distribution Engineer has the hours because they built agents that dont sleep.

Level 4: Build custom tools only you would ever build.

---
*Collected by: George on 2026-04-17*
