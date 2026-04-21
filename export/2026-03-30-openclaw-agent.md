---
type: concept
title: 2026 03 30 Openclaw Agent
author: Jing Shi
source: 'https://youtu.be/dwH2jKDgKlw'
created: '2026-03-30T20:10:38.000Z'
tags:
  - ai
  - test
  - youtube
---

# OpenClaw 我的多Agent系统怎么做到自动发现问题自动修复判断引擎  注意力保护实战

> **TLDR:** 這個影片說明如何在 OpenClaw 中建立多Agent系統的重點：1) Hook/Cron/Heartbeat 的自動化機制 2) 注意力保護的重要性 3) Judgment Engine 判斷引擎的設計思路

---

那前几期我们已经开始去探索了，比如说怎么样去设置 plugin hook，怎么样设置 cron job 或者 heartbeat，然后以及怎么样设置多 agent 的自动工作流，怎么样设置它的安全，怎么样让它的 memory 更好的被记住，怎么样去 build 一个 knowledge flywheel，我们都已经 touch 到了。然后上一期呢，我们其实重点去呃去 focus 在说怎么样去自多 agent 这个系统自我演。 所以，我们沉淀下来一个 project 叫 operational analytics，就是给你一个 dashboard。比如说，每天看到这个 dashboard，你就会一目了然，发现了什么，哪里有问题。这样，你就会针对性的去提这个问题。那这个 dashboard，它只是说，把我所有在意的一些 metrics 给它记录下来。那真正 这个背后让它实现自我优化的、自我演进的这个引擎，才是我们今天需要 touch 的非常非常呃干的一期。OK，那 dashboard 显示出来了，不等于这个 agent 多 agent 的系统，它就会自动发现问题来解决。为什么？因为这里它其实是以之前的是一个断层。 发现问题，matrix展示在那儿，他也只是把这个job做完了。那我的任务，我之前的任务就是说，我看到这个matrix没对，我就告诉他，哎，这个没有对。然后他就马上起一个任务，然后他去开fix。所以在这里，我核心的价值给他输出的是一个我的判断力，我来提问题，你这里不对，这里不对。但是对于我们的目标来讲，我们希望这个系统是它可以自动优化的，那它必须要具备一个。 OK. Second, actually very interesting, is I call it attention trap. What does it mean? Before, I think when we work in a big factory, for example, the boss gives you a job, and then immediately finish it, you will think this person is very, very responsive, very good. This in a big factory, we think this is good. But when you work with a bunch of agents together, when you play the role of a boss, 你就会发现，你有一个问题，他马上解决；你有一个小建议，他马上改了。然后他就一直一个又一个，然后你所有的精力被切成了最小最小的这种碎块，而一直被他所 distract。然后这个时候，我其实发现，我失去了很大块的整块的时间来想更大的一些问题框架呀、战略呀，或者是这种 framework 等等。 那我的注意力其实就变成了这个系统里面最贵的资源，而也也它也变成了一个 bottleneck。然后，所以在这两个情况下，我的一个 insight after 之后呢，是说如果我真的让它全自主，其实是我需要怎么能够把我的判断力，就是发现问题的能力，或者是定义问题的能力，给它植入到这个系统里面，以及怎么能在这个系统里面能够很好的。 Protect my attention. We have a paper called "Attention is all you need." So in this world, what time, what things, you spend every minute, that is the most, most, most, most valuable or the most important. So in this system, how can I protect my attention? Can let me be more responsible, can let me think more about the operation of this system, has become my research topic. Based on these two insights, let's look at how to do it. OK, first, how can we build this judgment engine? 也就是说，基于我之前所有的这个呃，就是 feedback，我会发现说，他其实呃，判断问题其实分两类，一类呢是主观的，比如说我的一些感受，呃，作为一个用户的，或者是作为一个老板，或是作为一个 board 对这个前沿的一个事情的看法是方向性的，是战略性的是需要 brainstorming 的。然后另外一个呢是。 确定性的就是要么是 bug，要么是有问题。那这一轮，所以我就想说，那我先把这两类型的问题先 decouple 开，然后呢， decouple 开之后，我怎么样在这个系统里面去找到这个机制？那 Open Cloud 在这一块它做的非常好，它其实是有一个，就是呃既定的一个机制，就是它有 hook，它也有 cron，这两个或者 heartbeat，这三个它 build in 的这个功能，其实 suppose 就可以把这种客观的确定性的问题给它自动化下来。 那怎么自动化呢？就比如说，在这里面，agent的规则，我用的是cron job，我就让它去看今天在我基于我那个OA analytics那个dashboard，比如说大家看到的这个，比如说今天这个数据就是比昨天降了百分之五，那这个在agent那个cron job里面，它会自动trigger一个issue。然后第二个呢，就是我发现它有一些重复的。 确定的一些问题。那我在这里面，我就借用了它的系统的这个 hook。然后就是，比如说定时的去看，哦，它 cron job 失败了。就是当它整个 agent 的任务完成之后，它只要失败，它会自动的写入一条 log。那这个东西它不取决于 agent 的 LM

---
*Collected by: George on 2026-03-30*
