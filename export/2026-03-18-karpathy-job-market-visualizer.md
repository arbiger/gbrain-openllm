---
type: concept
title: 2026 03 18 Karpathy Job Market Visualizer
date: '2026-03-18T00:00:00.000Z'
source: karpathy.ai/jobs
tags:
  - ai
  - economics
  - jobs
  - karpathy
  - visualization
---

# US Job Market Visualizer - Karpathy

## 關於

這是 Andrej Karpathy 製作的視覺化工具，展示了美國勞工統計局（BLS）職業前景手冊中的 342 種職業。

## 主要功能

- **涵蓋範圍**：143M 個工作崗位
- **每個矩形面積**：與總就業人數成比例
- **顏色顯示**：可切換不同指標
  - BLS 預測增長前景
  - 中位數薪資
  - 教育要求
  - AI 曝露程度

## AI Exposure 評分標準

由 LLM 驅動的職業 AI 曝露程度評分（0-10 分）：

| 分數 | 曝露程度 | 範例職業 |
|------|---------|---------|
| 0-1 | 最低 | 屋頂工人、園藝師、商業潛水員 |
| 2-3 | 低 | 電工、水管工、消防員、牙科保健員 |
| 4-5 | 中等 | 警員、護理師、獸醫 |
| 6-7 | 高 | 教師、經理、會計師、記者 |
| 8-9 | 極高 | 軟體工程師、平面設計師、翻譯、資料分析師 |
| 10 | 最高 | 資料輸入員、電話行銷員 |

## 評分邏輯

**關鍵信號**：工作是否可完全在遠端辦公室用電腦完成

- **高曝露**（7+）：主要數位化工作（寫作、編碼、分析、溝通）
- **低曝露**：需要物理存在、手動技能或即時人類互動

## 重要提醒

> 這些是粗略的 LLM 估計，不是嚴謹的預測。高分不代表工作會消失。
> 
> 例如：軟體工程師獲得 9/10 分，因為 AI 正在轉變他們的工作——但需求可能隨著每位工程師變得更有效率而增加。

## 數據來源

- [Bureau of Labor Statistics Occupational Outlook Handbook](https://www.bls.gov/ooh/)
- [GitHub Source Code](https://github.com/karpathy/jobs)

## 相關標籤

#ai #economics #jobs #karpathy #visualization
