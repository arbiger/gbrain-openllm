---
type: concept
title: 2026 02 18 Openclaw Configuration Team Structure
---

# OpenClaw + LM Studio Technical Setup & Parameter Guide

## 1. The \"Anti-Hang\" Configuration (LM Studio)

To fix the \[Server Error\] \[object Object\] and connection drops,
ensure these server settings are active.

### Server Tab Settings

- **Port:** 1234 (Default)

- **Cross-Origin Resource Sharing (CORS):** ON (Enabled)

- **Context Length:** 32768

  - *Note:* Unsloth recommends this for memory efficiency while
    maintaining a strong working memory. If your Mac struggles with the
    34GB model + Context, lower this to 16384.

- **Apply Prompt Formatting:** ON

- **System Prompt Role:** \"System\"

## 2. LLM Parameter Deep Dive

This section explains how the \"Brain\" works. Understanding these
allows you to tune Alfred and Forge for specific tasks.

### Core Concept: Temperature

Temperature controls the \"creativity level\" of the AI. By adjusting
it, you shift the probability distribution, deciding if the AI is
conservative or adventurous.

**Example Scenario**

The model must complete the sentence: *\"The cat is \_\_\_\_\"*

The probabilities for the next token might be:

- Playing: 0.5

- Sleeping: 0.25

- Eating: 0.15

- Driving: 0.05 (Illogical)

- Flying: 0.05 (Illogical)

**The Impact of Temperature:**

- **Low (e.g., 0.2):** Focused and Deterministic. The model almost
  always picks the highest probability (\"Playing\"). Best for coding
  and math.

- **Medium (e.g., 0.7 - 1.0):** Balanced. The model selects from
  \"Playing\", \"Sleeping\", or \"Eating\" based on probability without
  bias.

- **High (e.g., 2.0):** Adventurous. The model might pick \"Driving\" or
  \"Flying\", creating poetic or chaotic results.

**Usage Scenarios:**

1.  **QA / Coding (Forge):** Lower temperature ensures accuracy and
    reliability.

2.  **Creative Writing / Brainstorming:** Higher temperature increases
    diversity and unique vocabulary.

### Appendix: Core Parameters

Besides temperature, these parameters shape the output quality:

  -----------------------------------------------------------------------
  **Parameter**                       **Function & Recommendation**
  ----------------------------------- -----------------------------------
  **Top_P (Nucleus Sampling)**        **The Filter.** Creates a dynamic
                                      list of the most probable words
                                      whose cumulative probability hits
                                      the threshold (e.g., 0.95). It cuts
                                      off the \"tail\" of bad answers
                                      while keeping more options than
                                      Top_K.

  **Top_K**                           **The Hard Cut.** Only allows the
                                      model to choose from the top K
                                      words (e.g., 40). It prevents the
                                      model from choosing extremely
                                      rare/wrong words.

  **Min_P**                           **The Noise Gate.** *Crucial for
                                      Qwen.* It ignores any token that
                                      has a probability lower than a
                                      percentage of the top token. (e.g.,
                                      if Top is 50%, and Min_P is 0.01,
                                      anything under 0.5% is deleted).

  **Repetition Penalty**              **Anti-Loop.** The higher the
                                      number, the less likely the model
                                      is to repeat a word it just said.

  **Frequency Penalty**               **Vocabulary Variety.** Penalizes
                                      words based on how many times they
                                      have appeared in the text so far.
                                      Encourages using new words.

  **Presence Penalty**                **Topic Diversity.** Penalizes a
                                      token if it exists at all in the
                                      text. Encourages moving to new
                                      topics.

  **Max New Tokens**                  **Length Control.** Limits the
                                      response size (e.g., 2000 tokens)
                                      to prevent memory overflows.
  -----------------------------------------------------------------------

## 3. Recommended Settings for Qwen 80B (Reap-i1)

These settings are based on **Unsloth\'s official benchmarks** for the
Qwen 3 / 2.5 architecture. Qwen handles higher entropy better than
Llama.

### The \"Unsloth / Qwen Optimized\" Preset

*Apply these in LM Studio\'s right-hand sidebar.*

  -----------------------------------------------------------------------
  **Parameter**           **Value**               **Reason**
  ----------------------- ----------------------- -----------------------
  **Temperature**         1.0                     Qwen works best at 1.0
                                                  (Standard) rather than
                                                  lower values, provided
                                                  Top_P/Min_P are set
                                                  correctly.

  **Top P**               0.95                    A slightly wider filter
                                                  than usual to allow for
                                                  Qwen\'s advanced
                                                  reasoning.

  **Top K**               40                      Limits the selection
                                                  pool to the top 40
                                                  logical choices.

  **Min P**               0.01                    **Vital.** Sets a floor
                                                  for probability. (Note:
                                                  standard Llama.cpp
                                                  default is 0.05, but
                                                  Qwen prefers 0.01).

  **GPU Offload**         Max                     Ensure the slider is
                                                  100% to the right
                                                  (Apple Metal).
  -----------------------------------------------------------------------

### Hardware Note (M4 Pro)

> \"Don\'t have 46GB RAM or unified memory? No worries you can run our
> smaller quants\... It is best to have the model size = to the sum of
> your compute.\" --- *Unsloth*

Since you are running the **Reap-i1 (34GB)** version on an **M4 Pro
(likely 48GB)**, you are in the \"Green Zone.\" You should expect
roughly **20+ tokens/s** if the context isn\'t full.

## 4. Sources

- **Zhihu Guide (LLM Parameters):**
  [[https://zhuanlan.zhihu.com/p/666670367]{.underline}](https://zhuanlan.zhihu.com/p/666670367)

- **Unsloth Qwen Documentation:**
  [[https://unsloth.ai/docs/models/qwen3-coder-next]{.underline}](https://unsloth.ai/docs/models/qwen3-coder-next)
