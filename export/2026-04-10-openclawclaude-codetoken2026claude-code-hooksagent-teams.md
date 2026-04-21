---
type: concept
title: 2026 04 10 Openclawclaude Codetoken2026claude Code Hooksagent Teams
author: AI超元域
source: 'https://youtu.be/iJEfIc1mrsc?si=9Ic3TSAu9ldKsyJG'
created: '2026-04-10T19:22:16.000Z'
tags:
  - research
  - youtube
---

# OpenClaw高级使用经验之如何调用Claude Code最省Token2026年最强生产力Claude Code Hooks回调Agent Teams实现全自动开发零轮询方案详解效率神器

> **TLDR:** ## 核心觀點總結：

Open Cloud 傳統調用 Cloud Code 需不斷輪詢狀態，導致 Token 消耗巨大。透過使用 Cloud Code 的 Hooks 回調功能，可實現真正的零輪詢方案：Open Cloud 只在發出任務和讀取結果時各調用一次，中間過程由 Cloud Code 自主完成並主動回傳通知，大幅降低 Token 消耗。結合新增的 Agent Teams 並行開發功能，可實現全自動化的開發工作流。

---

最近为大家做了多期 Open Cloud 相关的视频，而且昨天我还发了一期 Open Cloud 的高级用法的视频。但最近我发现，几乎每期视频的评论区都会有留言提到 Open Cloud 调用 Cloud Code 会非常消耗 Token。因为在之前的视频中，我有为大家演示过用 Open Cloud 来调用 Cloud Code 进行编程开发。我们只需要为 Open Cloud 下达一个指令，然后让 Open Cloud 全程操作 Cloud Code 为我们实现编程开发。 但是我们如果采用传统的方式，也就是常规的方式，让 Open Cloud 直接调用 Cloud Code 的话，那么 Open Cloud 每隔几秒就会轮询一次，检查一下 Cloud Code 的状态以及 Cloud Code 的输出。使用这种传统方式的话，Open Cloud 必须时刻盯着 Cloud Code，所以 Open Cloud 就会消耗非常多的 Token。所以我发现，在评论区大家抱怨 Open Cloud 调用 Cloud Code 会消耗更多的 Token，因为大家采用的是这种常规的传统方式。 所以 Open Cloud 要采用不断轮询的方式来查询 Cloud Code 的状态，也就是 Cloud Code 它执行的任务越久，在 Open Cloud 中它轮询的次数就越多，所消耗的 Token 也越多。所以我们可以完全不需要用这种传统的方式，直接让 Open Cloud 来调用 Cloud Code，因为无论是 Open Cloud 还是 Cloud Code，它们都非常非常的灵活，所以越灵活就越强大，就越有利于我们去自定义一些功能，从而轻松解决用 Open Cloud 调用 Cloud Code 的时候。 产生大量的 token 消耗，尤其是 Cloud Code 在前几天新增了 Agent Teams 这个新特性。因为 Agent Teams 相当于在 Cloud Code 中随时可以创建一个完整的开发团队，而且每个 Agent 呢都是独立的进程，所以是真正的并行执行。而且每个 Agent 之间还可以相互通信，还能共享任务列表，能自动认领，还能实现专职角色分工。比如说负责开发前端的 Agent，负责开发后端的 Agent，还有负责测试的 Agent。 所以在 Cloud Code 中有了 Agent Teams 这个最强大的新特性，在 Open Cloud 中就可以更加轻松的向 Cloud Code 赋派任务，让 Cloud Code 全自动完成整个开发工作流。想让 Open Cloud 以更节省 Token 的方式来调用 Cloud Code，其实非常简单，我们只需要用到 Cloud Code Hooks 功能，在 Open Cloud 中可以结合 Cloud Code 的 Hooks 功能，真正实现调用 Cloud Code 进行自主开发。 并且能够实现真正的零轮询，而且还能非常节省token。当开发任务完成之后，我们还能在聊天软件的群组中自动接收到任务完成的通知，包括实现的是什么任务，然后项目存储的路径，还有耗时，还有 Cloud Code 的 Agent Teams 是否已经启用，还有具体完成的功能，还有项目的文件结构等内容。下面我们就看一下我是如何通过 Cloud Code 的 Hooks 来实现了整个流程。下面我们先通过这个流程图让大家更直观的感受一下。 在 Cloud Code 中通过 Hooks 回调来实现的整个步骤是怎样的？首先是由 Open Cloud 将我们要开发的任务委派给 Cloud Code，像这个委派只执行一次，而且它是后台运行，不会阻塞 Open Cloud 的对话窗口和它的主 Agent。当 Cloud Code 接到任务之后，它就会进行自主开发还有测试。当任务完成之后，它就会触发 Stop 事件。第三步就是 Cloud Code 中 Hooks 自动触发。 它会先将执行结果写入到这个文件中，然后再发送 wake event 来唤醒 OpenCL。在这里采用了 stop event 以及 session end event，实现双重保障，来保障在聊天软件中我们能够真正收到它的任务完成的通知。然后 OpenCL 就会读取这个文件中的这些结果和状态。当它读取完这些结果和状态之后，它就会回复给我们，也就是通过我们的聊天软件来回复给我们这些状态。 像这个流程的话，Open Cloud 只在给 Cloud Code 分发任务的时候调用一次 Cloud Code，然后这中间的流程不需要 Open Cloud 参与。在最后这里，Open Cloud 再读取一下这个执行的结果，并且将执行结果发送给用户。所以在第一步，Open Cloud 只是给 Cloud Code 下发一个任务，它下发任务的过程所消耗的 Token 几乎可以忽略不计。在最后这里，它只是读取一下结果，将处理结果发送给用户，而且这个结果里的内容非常少，甚至不超过一千字。 所以在最后一个步骤，它所消耗的 token 也几乎可以忽略不计。在 Cloud Code 自主完成这个任务的过程中，Open Cloud 不需要对 Cloud Code 进行轮询。好，下面我也讲解一下我是如何实现的。在 Cloud Code 中，通过 stop hook 来达到任务完成自动回调的效果。在刚才也提到了，我们使用了 stop

---
*Collected by: George on 2026-04-10*
