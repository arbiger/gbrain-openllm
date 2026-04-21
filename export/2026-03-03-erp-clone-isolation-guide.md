---
type: concept
title: 2026 03 03 Erp Clone Isolation Guide
---

# ERP Clone & Isolated Test Environment Setup Guide

This guide explains how to create a "pure internal network only, external absolutely disconnected" isolated environment in PVE, allowing other designated VMs to connect, but the ERP itself cannot access the internet.

---

## 🏗️ Phase 1: Create PVE Internal-Only Switch (vmbr1)

This is the core of isolation. We create a virtual bridge that has no physical external connection - like a Hub without an uplink cable.

**PVE Settings:**
1. Click the node (231) > System > Network
2. Click Create > Linux Bridge
3. **Name:** `vmbr1`
4. **Bridge ports:** Leave EMPTY (do not fill in eth0 or any physical NIC - this ensures it has no physical exit)
5. **IP/Subnet:** Leave blank
6. Click "Apply Configuration"

---

## 🚀 Phase 2: Clone the Virtual Machine

1. **Select source VM:** Right-click #100 (Sunsoft ERP) > Clone
2. **Settings:**
   - **New ID:** 102
   - **Mode:** Full Clone
3. Click "Clone"

---

## 🔒 Phase 3: Configure "Pure Internal Network" Isolation

Before starting, move the cloned VM to the isolated network room.

1. **Change Bridge:** Click VM #102 > Hardware > Network Device
2. Change Bridge from `vmbr0` to `vmbr1`

3. **Console - Modify IP Parameters:**
   - Start VM #102, log in via PVE Console
   - Set static IP: e.g., `10.0.0.100`
   - Subnet Mask: `255.255.255.0`
   - **Gateway: DO NOT FILL** (this ensures even if there's a leak, it doesn't know how to send packets out)
   - **DNS: DO NOT FILL**

---

## 🤝 Phase 4: Allow "Specific Computers" to Connect

Now ERP is disconnected. You need another computer (e.g., your management VM) to have "dual NICs" as a jump host.

**Steps - Add specific VM to internal network:**

1. Select your management VM (e.g., VM #105)
2. Click Hardware > Add > Network Device
3. Bridge: Select `vmbr1`

4. **Configure second IP on that machine:**
   - Go to network settings, you'll see a new NIC
   - Set IP in the same segment, e.g., `10.0.0.10`
   - Also do NOT set Gateway

5. **Connectivity test:**
   - Now management machine has two NICs:
     - NIC 1: Connected to vmbr0 (or Tailscale) for your remote access
     - NIC 2: Connected to vmbr1, IP `10.0.0.10` → Can communicate with ERP
   - From management machine, run `ping 10.0.0.100` to connect to ERP
   - But ERP itself absolutely cannot access the internet

---

## 📝 Isolation Architecture Summary

| VM | ID | Network | Purpose |
|----|-----|---------|---------|
| ERP (#102) | 102 | vmbr1 (10.0.0.100), No Gateway | 100% Disconnected |
| Management (#105) | 105 | NIC1: vmbr0 (or Tailscale) / NIC2: vmbr1 (10.0.0.10) | Jump host |

**Security point:** External network (including other PVE VMs) absolutely cannot detect this isolated ERP unless manually added to vmbr1.

This solution is perfect for testing "time-locking" old software because you can freely change the time on this isolated ERP without affecting the outside world.
