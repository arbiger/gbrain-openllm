---
type: concept
title: 2026 04 04 6gtts7bwhispervibevoice Tts
author: AI探索与发现
source: 'https://youtu.be/eMdaLfxI0fw?si=_oeyajJ74FLlpO-0'
created: '2026-04-04T15:37:42.000Z'
tags:
  - research
  - youtube
---

# 6G显存跑TTS7B模型干翻WhisperVibeVoice本地部署教程微软开源完全免费 语音识别  TTS  语音输入法

> **TLDR:** # 核心观点总结

微软开源Web Voice系列语音模型，包括7B参数的语音识别模型（处理60分钟音频，

---

Hello，大家好，欢迎来到AI探索与发现。本期分享有微软开源的语音模型Web Voice，笔记链接我会放在视频下方。Web Voice它包含了三个模型，分别是语音识别、文本转语音和实时语音。语音识别模型一次能处理长达六十分钟的音频，不仅可以识别单人朗读，还能转录多人对话甚至歌词，识别准确率高，速度快。我本地测试下来，一段十分钟语音，Web Voice只需要三十秒，而用Whisper转录需要两分钟。 它的文本转语音模型只有一点五B参数，可以一次合成长达九十分钟的语音，并且语气连贯自然，没有串音。只要六G显存就能在本地运行。Web Voice还有个更小的模型，零点五B参数，专门用来做实时语音生成，最长可以连续生成十分钟音频，支持中英法德葡萄牙等十几种语言。 前两天还上线了 Vibe，一个语音识别的客户端，类似豆包的语音输入法，直接说话它就会帮你实时转成文字，基本上可以代替键盘输入。目前完全免费。Vibe Voice 主页上，这里有三个模型的下载链接。语音识别原始模型是 7B 参数，大约十六个 G，它还有对应的 Hugging Face 版本，这个地址可以下载，支持 Transformer 直接调用。 运行语音识别模型最少要16G显存，1.5B文本转语音和0.5B的实时语音模型，在本地部署需要6G显存、16G内存。如果你是手动部署的话，需要先安装好Python和Git工具。英伟达显卡的话，还要先安装好CUDA 12.8，可以按这里的步骤进行安装。如果你在国内， 安装前先开VPN的TUN模式，或者在命令窗口设置好代理，然后克隆程序库，创建虚拟环境，然后激活虚拟环境，最后用开发模式安装依赖包。依赖包安装完以后，可以用pip查看一下安装情况，可以看到它这里默认安装的是PyTorch的CPU版。 如果想要用显卡推理，需要先卸载默认的 PyTorch，再安装带有扩大版本的 PyTorch。演示程序在这个 demo 目录里，这个是实时语音的 demo 程序，可以用这条指令来执行。第一次运行会自动下载模型，启动完成后可以输入这个地址访问。 这个是语音识别的demo程序，运行它可以用这条指令。需要注意的是，由于官方担心滥用，TTS的演示程序在官方库里已经被移除了。如果想要在本地运行TTS，可以到这个网址安装这个早期的社区版本。它的安装步骤跟上面官方版是一样的。 如果你不想手动安装，也可以直接下载我的整合包。整合包链接我也会放在视频下方。下载好以后，先解压 Web Voice，再解压 Models，然后把整个 Models 文件夹移过来。模型文件里，这个是 TTS 模型，这个是实时语音模型。语音识别由于我显存不够，本地没法测试，所以没放进来。 双击这个实时语音脚本就可以运行。第一次运行会比较慢，要等几十秒。它会在线下载一些模型参数文件。等这里显示程序启动完成，打开浏览器，输入这个地址就可以访问。我们复制一段文本来测试一下。然后这里选择对应的语言，目前还不支持中文。这两个参数，cfg代表合成的随机性，数值越小，模型发挥的自由度就越大。 这个代表推理步数，越大音质越好，但生成更慢。我们可以用默认值，点 Start 就开始生成。 Hello and welcome to Planet in Peril. I'm your host Alice. We're here today to discuss a really sobering new report that looks back at the last ten years of climate change from 2015 to 2025. 它 paints a picture not just of steady warming, but of a dangerous acceleration. And to help us unpack this, I'm joined by our expert panel. Welcome, Carter, Frank, and Maya. 这是韩语的效果。 안녕하세요. 오늘 하루도 힘내세요. 무슨 일이든지 좋은 일만 가득하길 바래요. 还有西班牙语。 Maza le pájaro en mano que siento volando. 最后这段法语比较长，但实际效果还是很流畅的。在我机器上基本上感觉不到卡顿。 这个是文本转语音的启动脚本，同样第一次运行也会稍慢，等这里所有模型加载完成，出现这个访问地址，然后在浏览器里输入这个地址，在这里输入要生成语音的文本，这个是设置几个人说话。 我先测试下一个人朗读，然后选音色。每种语言都有三种音色可选。下面还有高级参数，这两个是跟刚才实时语音里一个意思。下面是种子

---
*Collected by: George on 2026-04-04*
