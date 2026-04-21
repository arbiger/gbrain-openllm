---
type: concept
title: 2026 02 28 Excel 3 Tab Rule
date: '2026-02-28T00:00:00.000Z'
tags:
  - concept
  - software
---

# The 3-Tab Rule: How to structure your Excel file like a software developer

## 摘要

大多數 Excel 試算表失敗的原因是：把原始數據、計算和最終報告混在同一頁。這種「Frankenstein」設定讓工作簿難以審計且容易出錯。

借鑒軟體工程的 MVC 框架，將數據（模型）、計算（控制器）和介面（視圖）分開，可以建立一個穩定的環境，讓你可以重新設計表面而不破壞核心邏輯。

## 三層結構

### Tab 1: Source（數據層 / Model）
- 存放原始數據
- 嚴格規則：
  - **不美化格式**：不要合併儲存格、不要手動高亮
  - **不要手動公式**：將原始輸入與計算分開
- 將數據轉換為 Excel 表格（Ctrl+T）

### Tab 2: Logic（邏輯層 / Controller）
- 這是引擎室，把原始數據轉化為有意義的資訊
- 使用現代替代：
  - FILTER、SORT、UNIQUE 動態陣列函數
  - LET 和 LAMBDA 函數（建立可重用的自訂函數）
- 這是「作者才能看」的標籤

### Tab 3: Interface（介面層 / View）
- 這是客戶或經理唯一會看到的標籤
- 三個核心元件：
  - **用戶輸入**：下拉選單、日期選擇器
  - **視覺效果**：圖表、迷你圖
  - **高層報告**：摘要顯示

## 優點
- 數據與呈現分開
- 重新設計介面不影響核心邏輯
- 保護數據不被意外編輯

## 來源
- [HowToGeek](https://www.howtogeek.com/microsoft-excel-3-tab-rule-structure-spreadsheet-like-a-software-developer/)
- 標籤: #software #concept
