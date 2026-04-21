---
type: concept
title: 2026 03 01 Mattermost
---

# Mattermost 企業級部署手冊 (PVE + Tailscale 跨網域版)

這份指南將協助您在 Proxmox VE (PVE) 上建立一個輕量、穩定，且能透過
Tailscale 與**身處不同網域**的 Mac Mini (Mag)
進行安全對接的企業通訊中心。

## 階段一：在 PVE 建立 LXC 容器

我們不使用笨重的 VM，而是使用 LXC (Linux Container) 來最大化效能。

1.  **進入 PVE 介面**，點擊右上角的 Create CT (建立容器)。

2.  **基礎設定 (General)：**

    - Hostname: mattermost-server

    - 取消勾選 Unprivileged container (為了後續跑 Docker 與 Tailscale
      網卡權限，請務必取消勾選)。

3.  **Template：** 選擇 Ubuntu 22.04 或 Debian 12。

4.  **硬碟 (Disk)：** 分配 20GB (對純文字通訊與一般圖片非常夠用)。

5.  **CPU 與 RAM：** 給予 2 Cores 和 4096 MB (4GB) 記憶體。

6.  **網路 (Network)：** 選擇靜態 IP (Static) 或 DHCP 皆可
    (因為最終我們會依賴 Tailscale IP)。

7.  完成建立並啟動容器。請記住這個容器的 **ID** (例如 101)。

## 階段二：安裝 Docker 與 Mattermost

進入剛建好的 LXC 容器的 Console (終端機)，依序執行：

### 1. 安裝 Docker

\# 更新系統並一鍵安裝 Docker\
apt update && apt upgrade -y\
curl -fsSL \[https://get.docker.com\](https://get.docker.com) -o
get-docker.sh\
sh get-docker.sh

### 2. 準備 Mattermost 目錄與啟動檔

mkdir -p /opt/mattermost\
cd /opt/mattermost\
\
\# 建立 docker-compose.yml\
nano docker-compose.yml

將以下內容貼入 docker-compose.yml (已升級至 Postgres 15)：

version: \"3.8\"\
services:\
postgres:\
image: postgres:15-alpine\
restart: unless-stopped\
volumes:\
- ./data/db:/var/lib/postgresql/data\
environment:\
- POSTGRES_USER=mmuser\
- POSTGRES_PASSWORD=mmuser_password\
- POSTGRES_DB=mattermost\
\
mattermost:\
image: mattermost/mattermost-team-edition:latest\
restart: unless-stopped\
ports:\
- \"8065:8065\"\
volumes:\
- ./data/config:/mattermost/config\
- ./data/data:/mattermost/data\
- ./data/logs:/mattermost/logs\
environment:\
- MM_SQLSETTINGS_DRIVERNAME=postgres\
-
MM_SQLSETTINGS_DATASOURCE=postgres://mmuser:mmuser_password@postgres:5432/mattermost?sslmode=disable&connect_timeout=10\
depends_on:\
- postgres

儲存並離開 (Ctrl+X, Y, Enter)。

### 3. 啟動伺服器

docker compose up -d

## 階段三：安裝 Tailscale (PVE LXC 專屬設定)

為了讓 Tailscale 能在 LXC 中建立虛擬網卡 (TUN)，我們需要先在 **PVE
實體主機** 上開權限，再進 **LXC 容器** 安裝。

### 步驟 A：在 PVE 主機 (Node) 開放網卡權限

1.  請點選 PVE 節點本身的 **Shell** (不是 LXC 的 Console)。

2.  編輯您剛剛建立的容器設定檔 (假設 ID 是 101)：\
    nano /etc/pve/lxc/101.conf

3.  在檔案最下方，加入這兩行來賦予 TUN 設備權限：\
    lxc.cgroup2.devices.allow: c 10:200 rwm\
    lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file

4.  儲存離開，然後**重新啟動該 LXC 容器**。

### 步驟 B：在 LXC 容器中安裝 Tailscale

1.  進入 mattermost-server (101) 的 **Console**。

2.  執行安裝指令：\
    curl -fsSL
    \[https://tailscale.com/install.sh\](https://tailscale.com/install.sh)
    \| sh\
    tailscale up

3.  執行後會給您一串網址，複製到瀏覽器登入您的 Tailscale 帳號即可綁定。

4.  獲取這台 LXC 的 Tailscale IP：\
    tailscale ip -4\
    \
    記下這組 100.x.x.x 的 IP (假設為 100.A.A.A)。

現在，您的手機或筆電只要開著 Tailscale，輸入 http://100.A.A.A:8065
就能進入 Mattermost 建立管理員帳號了！

## 階段四：跨網域連線佈局 (Mac Mini 端設定)

因為 Mac Mini 在另一個網域，我們需要讓它也加入 Tailscale，並允許
OpenClaw 接收外部指令。

### 1. 確保 Mac Mini 運行 Tailscale

在 Mac Mini 上開啟 Tailscale App，登入**與 PVE 同一個帳號**。

透過 App 查詢 Mac Mini 的 Tailscale IP (假設為 100.B.B.B)。

### 2. 解除 OpenClaw 本機限制

預設情況下，OpenClaw 只允許 Mac Mini 本機 (127.0.0.1)
存取。我們需要改為允許 Tailscale 網域存取。

編輯 Mac Mini 上的設定檔：

nano \~/.openclaw/openclaw.json

找到 gateway 區塊，將 \"bind\" 從 \"loopback\" 改為 \"all\"：

\"gateway\": {\
\"port\": 18789,\
\"mode\": \"local\",\
\"bind\": \"all\", // \<\-\-- 關鍵修改：允許外部 IP 存取\
\"auth\": {\
\"mode\": \"token\",\
\"token\": \"0d6476823ef2878b00d628415ccf855d3ee12b3612ae9537\"\
}\
}

存檔後重啟服務：

openclaw gateway restart

### 3. Mattermost Webhook 最終設定

當您進入 Mattermost 後台設定 Slash Command (例如 /mag) 時，將 Webhook
URL 指向 Mac Mini 的 Tailscale IP：

- **URL:** http://100.B.B.B:18789/v1/chat/completions

這樣一來，PVE 上的 Mattermost 就會透過 Tailscale 的加密通道，直達 Mac
Mini 的大腦進行運算，完全不受實體網域的限制！
