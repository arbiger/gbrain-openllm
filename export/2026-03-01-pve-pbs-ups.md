---
type: concept
title: 2026 03 01 Pve Pbs Ups
---

# PVE 與 PBS 備份、還原與 UPS 管理終極指南

本指南整合了備份、還原、Tailscale 安全連線，以及針對 CyberPower UPS
的電力管理設定。

## 🏗️ 階段一至階段九：(備份、還原、Tailscale 設定)

(請參考前版本，確保 PVE 與 PBS 運作正常且具備跳板功能。)

## 🔋 階段十：UPS 電力管理與自動關機設定 (CyberPower 專屬 - NUT)

針對 CyberPower UPS，我們使用 **NUT (Network UPS Tools)**。

### 1. 物理連接

- 將 UPS 的 **USB 監控線** 接到 **PVE (231)**。

### 2. 在 PVE 安裝 NUT 監控軟體

在 PVE 的 Shell 執行：

apt update && apt install nut -y

### 3. 設定監控參數 (需要修改四個設定檔)

#### **A. /etc/nut/nut.conf**

MODE=standalone

#### **B. /etc/nut/ups.conf**

\[cyberpower\]\
driver = usbhid-ups\
port = auto\
desc = \"CyberPower UPS\"

#### **C. /etc/nut/upsd.users**

\[upsmon\]\
password = mypassword\
upsmon master

#### **D. /etc/nut/upsmon.conf**

MONITOR cyberpower@localhost 1 upsmon mypassword master

### 🛠️ 疑難排解：解決權限與狀態問題

#### **問題 1：出現 \"insufficient permissions\"**

根據您的硬體 ID (**0764:0601**)，建立規則：

1.  nano /etc/udev/rules.d/90-nut-ups.rules

2.  貼入：SUBSYSTEM==\"usb\", ATTR{idVendor}==\"0764\",
    ATTR{idProduct}==\"0601\", MODE=\"0660\", GROUP=\"nut\"

3.  執行：udevadm control \--reload-rules && udevadm trigger

#### **問題 2：出現 \"No such file or directory\" (關於 .pid)**

- **現象**：執行 upsdrvctl stop 時噴出 fopen \... .pid: No such file。

- **解法**：這是因為驅動沒在執行，**直接忽略它**。請直接執行 upsdrvctl
  start 即可。

#### **問題 3：出現 \"ups.status: WAIT\"**

代表伺服器連上了，但還在等數據。

1.  upsdrvctl stop (報錯請忽略)

2.  upsdrvctl start (確認看到成功啟動的訊息)

3.  systemctl restart nut-server nut-client

4.  等待 10 秒後再次輸入 upsc cyberpower。

### 4. 啟動服務與檢查狀態

upsdrvctl start\
systemctl restart nut-server nut-client\
upsc cyberpower

**檢查連線狀態：**

- **ups.status: OL**：在線供電（正常）。

- **ups.status: OB**：電池供電（停電中）。

### 5. 如何讓 VM 安全關機？

當 NUT 偵測到電力不足觸發 SHUTDOWN 時，PVE 會自動通知 VM 關機。

- **VM 設定**：請前往 VM #100 \> **Options** \> **Start/Shutdown
  order**，將 **Shutdown timeout** 設為 **180** 秒。

## 🛠️ 維護巡檢重點表

  -----------------------------------------------------------------------
  **項目**                **週期**                **動作**
  ----------------------- ----------------------- -----------------------
  **備份檢查**            每日                    檢查昨晚 22:00
                                                  的備份有無報錯。

  **UPS 檢查**            每月                    輸入 upsc cyberpower
                                                  檢查電池電量與狀態。

  **還原演練**            每季                    依據 **階段六** 建立 VM
                                                  分身測試。

  **異地同步**            每週                    檢查 Google Drive 或
                                                  Synology NAS 同步。
  -----------------------------------------------------------------------
