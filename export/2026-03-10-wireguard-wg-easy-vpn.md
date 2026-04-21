---
type: concept
title: 2026 03 10 Wireguard Wg Easy Vpn
url: 'https://blog.darkthread.net/blog/wireguard/'
date: '2026-03-10T00:00:00.000Z'
author: 黑暗執行緒
source: Darkthread 黑暗執行緒
tags:
  - self-hosted
  - server
  - tech
  - vpn
  - wireguard
---

# 無腦自建私人 VPN 服務 - wg-easy WireGuard

## 概述
教你如何自建 WireGuard VPN 服務，使用 wg-easy Docker 容器輕鬆架設。

## WireGuard vs OpenVPN

| 特性 | WireGuard | OpenVPN |
|------|-----------|---------|
| 程式碼 | 4000 行 | 10萬+ 行 |
| 連線速度 | < 1 秒 | 3-8 秒 |
| 協定 | UDP | TCP/UDP |
| 加密 | 固定現代算法 | 協商式 |

### WireGuard 優點
- 程式碼單純，易安全審核
- 內建於 Linux 核心
- 建立連線速度超快
- UDP 不會因網路瞬斷重連

### WireGuard 缺點
- UDP 在嚴格控管網路環境易被封鎖
- 無法協商加密方式

## Tailscale
基於 WireGuard 的便捷解決方案：
- 免去金鑰管理麻煩
- 像使用 App 一樣簡單
- 免費版：3 使用者、100 裝置

## wg-easy 安裝

### docker-compose.yml
```yaml
services:
  wg-easy:
    environment:
      - WG_HOST=<對外IP>
      - WG_PORT=51820
      - PASSWORD_HASH=<bcrypt雜湊>
    image: ghcr.io/wg-easy/wg-easy
    container_name: wg-easy
    volumes:
      - ./:/etc/wireguard
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv4.ip_forward=1
```

### 產生 bcrypt 密碼雜湊
```bash
docker run ghcr.io/wg-easy/wg-easy:14 wgpw MY_PASSWORD
```

## 連線方式
1. **手機**：安裝 WireGuard App，掃描 QRCode
2. **PC**：安裝 WireGuard Client，匯入 .conf 檔

## 進階設定

### 只連特定網段
在 .conf 中修改：
```
# 預設：全部走 VPN
AllowedIPs = 0.0.0.0/0, ::/0

# 改為只連家中內網
AllowedIPs = 192.168.1.0/24
```

### 保持連線
```
PersistentKeepalive = 25
```

## 心得
- 連線速度大勝 OpenVPN
- UDP 模式不易因訊號不穩中斷
- 需注意：如果架在 Docker 中間多一站，傳輸速率會略降

## 相關資源
- [WireGuard 官網](https://www.wireguard.com/install/)
- [wg-easy GitHub](https://github.com/wg-easy/wg-easy)
- [Tailscale 下載](https://tailscale.com/download)
