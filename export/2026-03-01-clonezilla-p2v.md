---
type: concept
title: 2026 03 01 Clonezilla P2v
---

# Clonezilla P2V 現場操作速查表 (Phase 2: PVE 還原)

**目標**：將外接 SSD 中的映像檔，還原到 PVE 的虛擬機 (VM) 中。

**操作環境**：Proxmox VE 網頁介面 + 外接 SSD。

## 步驟 1: 將 SSD 連接至 PVE

1.  將 SL Tech SSD 插入 Acer Altos T15 F6 的 USB 孔。

2.  *(不需要在 PVE 介面掛載它，我們等一下用 USB 直通給 VM)*。

## 步驟 2: 建立接收端 VM (Target VM)

在 PVE 網頁介面右上角點擊 **\"Create VM\"**：

1.  **General**:

    - **VM ID**: 隨意 (例如 100)。

    - **Name**: Dell-Server-P2V。

2.  **OS**:

    - **Do not use any media** (先選這個，等下再掛 Clonezilla ISO)。

    - **Guest OS**:

      - 如果舊機是 **Linux**: 選 Linux / 5.x - 2.6 Kernel。

      - 如果舊機是 **Windows**: 選對應版本 (如 Win Server 2012/2016)。

3.  **System**:

    - **Graphic card**: 預設 (Default) 或 VirtIO-GPU。

    - **Machine**: i440fx (相容性較好)。

    - **BIOS**: **關鍵抉擇！**

      - 如果舊 Dell 是 **Legacy BIOS** 開機 -\> 選 SeaBIOS。

      - 如果舊 Dell 是 **UEFI** 開機 -\> 選 OVMF (UEFI)。

      - *(通常舊 T110 都是 SeaBIOS)*。

4.  **Disks (硬碟)**:

    - **Bus/Device**: 建議選 SATA 或 IDE (先求相容，還原成功後再改
      VirtIO)。

    - **Storage**: local-zfs (你的 ZFS Pool)。

    - **Disk size**: **必須大於或等於舊硬碟容量** (例如舊硬碟
      500GB，這裡建議設 **510GB**，大一點點比較安全)。

5.  **CPU**: 2 Cores (先給夠用就好)。

6.  **Memory**: 4096 MB (4GB)。

7.  **Network**: VirtIO (paravirtualized)。

8.  **Confirm**: 勾選 Start after created (先不要勾)，點擊 Finish。

## 

## 步驟 3: 掛載工具 (Clonezilla ISO & USB SSD)

VM 建立好之後，點擊它，進入 **Hardware (硬體)** 分頁。

1.  **掛載 Clonezilla ISO**:

    - 雙擊 **CD/DVD Drive**。

    - 選擇 Use CD/DVD disc image file (ISO)。

    - Storage 選 local，ISO image 選你上傳的 clonezilla-live.iso。

2.  **直通 USB SSD (關鍵)**:

    - 點擊上方 **Add (新增)** -\> **USB Device**。

    - 選擇 **Use USB Vendor/Device ID**。

    - 在下拉選單中，找到你的 SL Tech SSD (通常會顯示廠商名稱或型號)。

    - 點擊 Add。

## 步驟 4: 修改開機順序

1.  進入 **Options (選項)** 分頁。

2.  雙擊 **Boot Order**。

3.  將 **CD/DVD Drive** 拖曳到第一位 (Enabled)。

4.  點擊 OK。

## 步驟 5: 開始還原 (Restore)

1.  點擊右上角 **Console** -\> **Start Now**。

2.  你會看到 Clonezilla 的開機畫面 (跟在舊機上一樣)。

3.  **Language/Keymap**: 選預設。

4.  **Start Clonezilla** -\> **device-image**。

5.  **掛載儲存區 (Repository)**:

    - 選擇 **local_dev**。

    - 此時系統會偵測到兩顆硬碟：一顆是虛擬硬碟 (vda/sda)，一顆是你的 USB
      SSD (sdb)。

    - 請按 Enter 繼續。

    - 選擇你的 **USB SSD 分割區** (例如 sdb1) 掛載到 /home/partimg。

    - 目錄選 / (最上層)。

6.  **執行還原**:

    - 模式: **Beginner**。

    - 動作: 這次要選 **restoredisk** (還原映像檔到本機硬碟)。

    - 映像檔: 選擇你剛剛備份的那個資料夾 (dell-server-full-backup)。

    - 目標硬碟: 選擇 VM 的虛擬硬碟 (通常是 sda 或 vda，容量 510GB
      那顆)。

7.  **確認**:

    - 檢查映像檔: 選 No (備份時檢查過了，省時間)。

    - 連續按兩次 y 確認覆蓋資料。

## 

## 步驟 6: 收尾與開機

1.  等待還原完成 (進度條跑完)。

2.  選擇 **Poweroff (關機)**。

3.  回到 PVE 的 **Hardware** 分頁：

    - 移除 CD/DVD (設為 Do not use)。

    - 移除 USB Device (選中按 Remove)。

4.  進入 **Options** -\> **Boot Order**，把硬碟 (scsi0/sata0)
    設為第一位。

5.  **Start (開機)**，打開 Console 祈禱看到熟悉的舊系統登入畫面！
