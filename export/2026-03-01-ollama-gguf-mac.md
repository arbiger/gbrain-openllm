---
type: concept
title: 2026 03 01 Ollama Gguf Mac
---

# 如何用 Ollama 跑自定義 GGUF 模型 (MAC)

這份指南將教你如何繞過 LM Studio，直接用 Ollama 載入你在 Hugging Face
下載的 .gguf 檔案，並讓它在 OpenClaw 中運行。

## 0. 前置準備：安裝版本的選擇 (App vs. Homebrew)

在 Mac 上，強烈建議使用 **Ollama App (官網下載版)**，而非 Homebrew 版。

- **為什麼選 App 版？**

  - 它會在選單列 (Menu Bar) 常駐一個小圖示，自動處理後台服務 (ollama
    serve)。

  - 只要圖示在，OpenClaw 就能隨時連線，不需要你手動打指令啟動伺服器。

- **避坑指南**：

  - **不要同時安裝**：如果你之前用 brew install ollama 裝過，建議先 brew
    uninstall ollama 移除，避免兩個版本搶佔 Port (11434) 導致衝突。

## 1. 觀念釐清：GGUF vs. MLX

- **GGUF**: 目前最通用的模型格式。Ollama 的底層 (llama.cpp)
  就是專門跑這個的。在 Mac 上，Ollama 會透過 **Metal** 加速，讓 GPU
  幫忙算，所以速度非常快。

- **MLX**: Apple 原生框架。雖然理論上限更高，但模型選擇較少。

- **結論**: 除非你要「微調 (Fine-tune)」模型，否則單純「執行
  (Inference)」，**Ollama 跑 GGUF 已經夠快了**，而且相容性最好。

## 2. 實戰步驟 (Step-by-Step)

### 第一步：下載 GGUF 模型

去 Hugging Face 下載你想要的模型（例如最新的 DeepSeek-R1 或 Qwen-2.5）。

- **建議版本**: 下載 Q4_K_M.gguf 或 Q5_K_M.gguf (這是在 Mac
  上速度與聰明程度的最佳平衡點)。

- 假設你下載了一個檔案，放在下載資料夾：
  \~/Models/Ministral-3-14B-Reasoning-2512-Q4_K_M.gguf

### 第二步：建立 Modelfile (這是關鍵)

Ollama 需要一張「身分證」才知道怎麼跑這個檔案。

1.  打開終端機 (Terminal)。

2.  建立一個沒有副檔名的檔案，名稱隨意 (例如 MyDeepSeek)。\
    nano Modelfile

3.  在裡面寫入以下內容。\
    **關鍵策略：** 這裡我們採用 Unsloth
    風格的「極簡主義」。我們不設定具體角色，而是設定 **「思考框架
    (Reasoning Framework)」**。這樣當 OpenClaw 載入不同的 soul.md
    時，模型可以完美適應，不會衝突。\
    FROM
    /Users/george/Models/Ministral-3-14B-Reasoning-2512-Q4_K_M.gguf\
    \
    \# Unsloth / Qwen Optimized Preset (針對 Qwen/Llama 3 優化的參數)\
    \# 讓它夠聰明，但不會胡言亂語\
    PARAMETER temperature 1.0\
    PARAMETER top_p 0.95\
    PARAMETER top_k 40\
    PARAMETER min_p 0.01\
    \
    \# 必備：加大 Context Window 以容納 OpenClaw 的長指令和工具說明\
    PARAMETER num_ctx 8192\
    \
    \# System Prompt - 萬用瑞士刀模式 (Swiss Army Knife Mode)\
    SYSTEM \"\"\"\
    You are a versatile AI engine capable of logical reasoning and tool
    usage.\
    \
    Core Operating Rules:\
    1. \*\*Follow Context\*\*: Strictly adhere to the persona and
    mission provided in the current session context.\
    2. \*\*Tool Execution\*\*: When tools are available, prioritize
    using them to fetch real data over generating text from memory.\
    3. \*\*Step-by-Step\*\*: For complex queries, breakdown the problem
    into logical steps (Chain of Thought).\
    4. \*\*Output Format\*\*: Provide clean, structured outputs (JSON,
    Markdown) when requested.\
    \"\"\"

4.  按 Ctrl+O 存檔，Enter 確認，Ctrl+X 離開。

### 第三步：創建或更新模型

Ollama 允許直接覆蓋舊模型，不需要先刪除。

- 指令格式：ollama create \<你想取的模型名字\> -f \<Modelfile檔案\>

ollama create openclaw-ministral-14b -f Modelfile

當你看到 success 字樣，就代表模型已經更新完成，隨時可以被 OpenClaw
呼叫了。

### 第四步：測試運行

直接在終端機跑跑看：

ollama run openclaw-ministral-14b

測試時，它應該會變得很「冷靜」，直接回答問題，這就是我們要的狀態。

## 2.5 關鍵知識：GGUF 壓縮版本與記憶體對照表 (Quantization Guide)

在 Hugging Face 下載模型時，你會看到一堆 Q4_K_M, Q5_K_S, Q8_0
的檔案。這些代碼代表模型的「壓縮程度」。

**簡單結論：請優先選擇 Q4_K_M。它是 CP 值之王。**

### 壓縮代碼解碼

- **Q** = Quantization (量化/壓縮)

- **數字** = 位元數 (Bits)。數字越大，模型越聰明，但也越肥、越慢。

- **K_M / K_S** = 壓縮演算法 (Medium / Small)。通常選 **M (Medium)**
  比較平衡。

### 常用版本比較表

  -------------------------------------------------------------------------------------------------------------------------
  **版本**       **全名**       **推薦度**     **說明**                                      **適合場景**
  -------------- -------------- -------------- --------------------------------------------- ------------------------------
  **Q4_K_M**     4-bit Medium   ⭐⭐⭐⭐⭐     **黃金標準 (Sweet                             日常助理、Coding、文書處理。
                                               Spot)**。幾乎無損的智商，但記憶體佔用減半。   

  **Q5_K_M**     5-bit Medium   ⭐⭐⭐⭐       如果你 RAM 還有剩，選這個會稍微聰明一點點     複雜邏輯推理、數學計算。
                                               (1-3% 提升)。                                 

  **Q6_K /       6-bit / 8-bit  ⭐⭐           接近原始模型大小，非常吃                      學術研究對精確度要求極高時。
  Q8_0**                                       RAM，但智商提升很有限。                       

  **IQ3_M /      3-bit          ⭐             智商有明顯下降，容易胡言亂語。                只有在硬體真的跑不動時才用。
  Q3_K**                                                                                     

  **FP16**       16-bit (原始)  ❌             **千萬別用**。這是未壓縮版，Mac               模型微調 (Fine-tuning) 專用。
                                               通常跑不動或極慢。                            
  -------------------------------------------------------------------------------------------------------------------------

### 記憶體 (RAM) 需求估算公式

**估算公式：模型參數 (B) x 壓縮位元數 (Q) ÷ 8 + 2GB (緩衝) = 所需 RAM**

*(以下為 Mac 統一記憶體建議值，需保留空間給 macOS 系統)*

  -----------------------------------------------------------------------
  **模型大小**            **推薦版本 (Q4_K_M)**   **建議 Mac 記憶體**
  ----------------------- ----------------------- -----------------------
  **8B** (Llama 3, Qwen)  \~5 GB                  **8GB** (緊繃) /
                                                  **16GB** (舒適)

  **14B** (Qwen, Mistral) \~9 GB                  **16GB** (剛好) /
                                                  **24GB** (推薦)

  **32B** (Qwen 2.5)      \~20 GB                 **32GB** (剛好) /
                                                  **48GB** (推薦)

  **70B** (Llama 3)       \~42 GB                 **64GB** (唯一選擇)
  -----------------------------------------------------------------------

*注意：如果你要跑 OpenClaw 這種 Agent，因為它會有很長的 System Prompt
和歷史紀錄 (Context)，建議記憶體要比上述估算值再多預留 4-8GB。*

## 2.6 進階調校：Modelfile 參數詳解 (Parameter Deep Dive)

這部分解釋了 Modelfile
裡那些神秘參數的作用。了解這些，你就能針對「寫程式 (Coding)」或「寫小說
(Creative)」調整不同的大腦。

### 核心參數 (The Big Knobs)

#### **1. Temperature (溫度：創造力控制)**

這決定了 AI 是「嚴謹」還是「奔放」。

- **Low
  (0.2)**：**精準、決定性高**。適合寫程式、除錯、數學計算。它幾乎只會選機率最高的那個字。

- **Medium (0.7 - 1.0)**：**平衡**。適合一般對話、摘要。

- **High (1.0+)**：**創意、隨機**。適合寫詩、腦力激盪，但容易產生幻覺。

#### **2. Min_P (雜訊閘門 - Qwen 必備)**

- **功能**：這是新一代的過濾器。它會忽略那些機率低於「最高機率 token 的
  X%」的選項。

- **為什麼重要**：對於 **Qwen (通義千問)** 或 **Llama 3**
  這種大模型，Unsloth 強烈建議設定 min_p 0.01 (即
  1%)。這能有效過濾掉那些「不合邏輯」的選項，讓模型變聰明。

#### **3. Top_P (核取樣)**

- **功能**：這是一個動態過濾器。例如設為 0.95，表示 AI
  只會在累積機率達到 95%
  的候選字中挑選。這能切掉尾端那些極低機率的怪字。

#### **4. Top_K (硬性截斷)**

- **功能**：強迫 AI 只能從前 K 個 (例如 40 個)
  最可能的字裡面選。這是一個硬限制，防止 AI 選到太冷僻的字。

### 推薦預設值 (The \"Unsloth Optimized\" Preset)

如果你不知道怎麼設，請直接抄這組設定。這是目前公認針對 **Qwen 2.5 /
Llama 3** 架構的最佳平衡點：

\# 適用於：通用助理、OpenClaw Agent\
PARAMETER temperature 1.0 \# Qwen 在 1.0 表現最好，只要有設 Min_P\
PARAMETER min_p 0.01 \# 關鍵！過濾雜訊\
PARAMETER top_p 0.95 \# 允許足夠的詞彙多樣性\
PARAMETER top_k 40 \# 避免太離譜的選詞

## 3. 快速切換模型 (Switching Models)

如果你想從 Mistral 換成 Qwen，不需要重新寫一個
Modelfile，只需要修改路徑：

1.  **下載新模型**: 例如 Qwen2.5-14B-Instruct-Q4_K_M.gguf。

2.  **修改 Modelfile**:\
    nano Modelfile\
    \
    \
    將第一行修改為新路徑：\
    \# FROM /Users/george/Models/Ministral\... (舊的註解掉或刪除)\
    FROM /Users/george/Models/Qwen2.5-14B-Instruct-Q4_K_M.gguf

3.  **建立新模型**: (給它一個新名字，這樣你可以同時保留 Mistral 和
    Qwen)\
    ollama create openclaw-qwen-14b -f Modelfile

4.  **OpenClaw 設定**: 去 openclaw.json 把 id 改成 openclaw-qwen-14b
    即可切換大腦。

## 4. 整合進 OpenClaw

現在你要讓 OpenClaw 用這個新模型，只需要修改 openclaw.json。

1.  開啟 openclaw.json。

2.  找到 ollama 的 models 區塊，加入這個新模型：

{\
\"id\": \"openclaw-ministral-14b\",\
\"name\": \"Ministral 14B Agent\",\
\"contextWindow\": 8192,\
\"maxTokens\": 4096\
}

3.  把 agents.defaults.model.primary 改成
    \"ollama/openclaw-ministral-14b\"。

4.  重啟 OpenClaw。

## 5. 進階技巧：為什麼這樣做更好？

比起用 LM Studio：

1.  **穩定性**：Ollama 是純指令行工具，沒有 GUI 的肥大 bug。

2.  **API 標準化**：Ollama 完美支援 OpenAI API 格式，OpenClaw
    連接起來最順。

3.  **完全控制**：透過 Modelfile，你可以為同一個 GGUF
    檔案建立不同的「分身」。

    - 建立一個 research-bot (設定 System Prompt 是嚴肅學者)。

    - 建立一個 chat-bot (設定 System Prompt 是輕鬆聊天)。

    - **它們共用同一個 GGUF 檔案，不佔額外硬碟空間！**

現在，去 Hugging Face 挖寶吧！任何 GGUF 都能變成你的 OpenClaw 大腦。

## 6. 疑難排解 (Troubleshooting)

### Error: missing tensor \'blk.0.ssm_in.weight\'

如果你在執行 ollama run 時看到類似這種「缺少
tensor」的錯誤，原因通常有兩個：

1.  **Ollama 版本過舊**：

    - **原因**：你下載了一個非常新的模型（例如 Qwen 2.5, DeepSeek V3, 或
      Mamba 架構），但你電腦上的 Ollama 是舊版的，看不懂新的 GGUF 結構。

    - **解法**：去 [[Ollama
      官網]{.underline}](https://ollama.com/download)
      下載最新版安裝，或執行 brew upgrade ollama。這是最常見的解法。

2.  **GGUF 檔案損毀**：

    - **原因**：下載過程中網路中斷，導致檔案不完整。

    - **解法**：去 Hugging Face 檢查檔案的 SHA256 碼，並在本地端執行
      shasum -a 256 \<檔案路徑\> 比對。如果不一樣，請重新下載。
