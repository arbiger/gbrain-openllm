---
type: concept
title: Omlx Setup Guide
---

# OpenClaw Unified Engine Setup (oMLX + MLX-Audio)

This document describes the fully unified MLX configuration for OpenClaw. It integrates **Qwen 3.5 9B** for memory and vision tracking, and **Qwen 3** Audio models for comprehensive local Voice capabilities (ASR and TTS) using an Apple Silicon optimized architecture.

## Primary Architecture
- **Reasoning**: `MiniMax-M2.7` (cloud, primary agent logic).
- **Inference Server**: `oMLX` v0.2.22 running on port `:8000` locally.
- **Audio Bridge**: Standalone `mlx-audio` Python server running on port `:8080` locally.

## Local Models Staged (`~/.omlx/models`)
1. Memory / VLM Endpoint: `Qwen3.5-9B-MLX-4bit`
2. Speech-to-Text (ASR): `Qwen3-ASR-1.7B-8bit` 
3. Text-to-Speech (TTS): `Qwen3-TTS-12Hz-1.7B-Base-8bit`

## Configuration Files

### 1. `~/.omlx/model_settings.json` (Server Config)
Ensure `oMLX` only pins the required models to prevent memory bloat:
```json
{
  "version": 1,
  "models": {
    "Qwen3.5-9B-MLX-4bit": {
      "force_sampling": false,
      "is_pinned": true,
      "is_default": true
    },
    "Qwen3-ASR-1.7B-8bit": {
      "force_sampling": false,
      "is_pinned": true,
      "is_default": false
    },
    "Qwen3-TTS-12Hz-1.7B-Base-8bit": {
      "force_sampling": false,
      "is_pinned": true,
      "is_default": false
    }
  }
}
```

### 2. `~/.openclaw/openclaw.json` (Agent Config Rules)

**A. Core Reasoning**
Set MiniMax as the default agent profile.
```json
  "agents": {
    "defaults": {
      "model": {
        "primary": "minimax/MiniMax-M2.7"
      }
    }
  }
```

**B. Memory Plugin (Provider definition)**
Register the 9B model in the `models.providers` block using the `openai-responses` API structure to avoid ChatML template reasoning leaks (the `<think>` tag bug).
```json
      "omlx": {
        "baseUrl": "http://127.0.0.1:8000/v1",
        "apiKey": "omlx",
        "api": "openai-responses",
        "models": [
          {
            "id": "Qwen3.5-9B-MLX-4bit",
            "name": "Qwen3.5-9B-MLX-4bit",
            "api": "openai-responses",
            "reasoning": false,
            "input": [
              "text"
            ],
            "contextWindow": 131072,
            "maxTokens": 8192
          }
        ]
      }
```

**C. Media & Voice (Audio / Vision)**
Configure the endpoints for Vision capabilities (`image`) pointing to port `:8000`, and Audio STT capabilities (`audio`) pointing to the standalone bridge at `:8080`.
```json
  "tools": {
    "media": {
      "models": [
        {
          "provider": "omlx",
          "model": "Qwen3.5-9B-MLX-4bit",
          "capabilities": ["image"],
          "type": "provider",
          "baseUrl": "http://127.0.0.1:8000/v1"
        },
        {
          "provider": "openai",
          "model": "/Users/george/.omlx/models/Qwen3-ASR-1.7B-8bit",
          "capabilities": ["audio"],
          "type": "provider",
          "baseUrl": "http://127.0.0.1:8080/v1"
        }
      ]
    }
  },
  "messages": {
    "tts": {
      "auto": "inbound",
      "provider": "openai",
      "openai": {
        "baseUrl": "http://127.0.0.1:8080/v1",
        "model": "/Users/george/.omlx/models/Qwen3-TTS-12Hz-1.7B-Base-8bit"
      }
    }
  }
```

**D. Memory Execution**
Route the Engram extraction plugin through the oMLX 9B model.
```json
  "plugins": {
    "entries": {
      "openclaw-engram": {
        "enabled": true,
        "config": {
          "localLlmEnabled": true,
          "localLlmUrl": "http://127.0.0.1:8000/v1",
          "localLlmModel": "Qwen3.5-9B-MLX-4bit",
          "localLlmMaxContext": 32768
        }
      }
    }
  }
```

## System Deployment Check
The `mlx-audio` library must be installed matching the python environment. You can launch the dedicated audio bridge with:
```bash
nohup python3.11 -m mlx_audio.server --port 8080 > /Users/george/.omlx/logs/audio_bridge.log 2>&1 &
```
Then start the OpenClaw gateway safely:
```bash
brew services start omlx
openclaw gateway restart
```
