# GBrain OpenClaw-Style Configuration

**Date**: 2026-04-18
**Version**: GBrain 0.12.0 + OpenClaw-style providers

---

## Overview

GBrain now supports OpenClaw-style configuration with pluggable providers for both embeddings and LLM. This allows you to use local models (via omlx) as primary with cloud fallbacks.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      GBrain                              │
│                                                         │
│  ┌─────────────────┐      ┌─────────────────────────┐   │
│  │  Embedding      │      │  LLM (Query Expansion) │   │
│  │                 │      │                         │   │
│  │  PRIMARY: omlx  │      │  PRIMARY: Gemma (omlx)  │   │
│  │  bge-m3-mlx-fp16│      │  gemma-4-26b-a4b-it-oQ4  │   │
│  │                 │      │                         │   │
│  │  FALLBACK: OpenAI│      │  FALLBACK: MiniMax      │   │
│  │  text-embedding-3│      │  MiniMax-M2.7           │   │
│  └─────────────────┘      └─────────────────────────┘   │
│                                                         │
│  Config: OpenClaw-style config.json                      │
└─────────────────────────────────────────────────────────┘
```

## Config Format

```json
{
  "providers": {
    "omlx_embed": {
      "type": "embedding",
      "baseUrl": "http://127.0.0.1:8000/v1",
      "apiKey": "unlimited",
      "api": "openai-compatible",
      "models": [
        {
          "id": "bge-m3-mlx-fp16",
          "name": "bge-m3 embedding",
          "dimensions": 1024
        }
      ]
    },
    "omlx_llm": {
      "type": "llm",
      "baseUrl": "http://127.0.0.1:8000/v1",
      "apiKey": "unlimited",
      "api": "openai-compatible",
      "models": [
        {
          "id": "gemma-4-26b-a4b-it-oQ4",
          "contextWindow": 131072,
          "maxTokens": 8192
        }
      ]
    },
    "openai": {
      "type": "embedding",
      "baseUrl": "https://api.openai.com/v1",
      "apiKey": "sk-...",
      "api": "openai-compatible",
      "models": [
        {
          "id": "text-embedding-3-large",
          "dimensions": 1536
        }
      ]
    },
    "minimax": {
      "type": "llm",
      "baseUrl": "https://api.minimax.chat/v1",
      "apiKey": "...",
      "api": "openai-compatible",
      "models": [
        {
          "id": "MiniMax-M2.7",
          "contextWindow": 204800,
          "maxTokens": 8192
        }
      ]
    }
  },

  "brain": {
    "embedding_provider": "omlx_embed",
    "embedding_model": "bge-m3-mlx-fp16",
    "embedding_dimensions": 1024,
    "embedding_fallback": "openai",
    "llm_provider": "omlx_llm",
    "llm_model": "gemma-4-26b-a4b-it-oQ4",
    "llm_fallback": "minimax"
  }
}
```

## Provider Types

### Embedding Providers

| Provider | Model | Dimensions | Notes |
|----------|-------|------------|-------|
| `omlx_embed` | bge-m3-mlx-fp16 | 1024 | Local, free, fast |
| `openai` | text-embedding-3-large | 1536 | Cloud, paid |

### LLM Providers

| Provider | Model | Context Window | Notes |
|----------|-------|---------------|-------|
| `omlx_llm` | gemma-4-26b-a4b-it-oQ4 | 131072 | Local, free |
| `minimax` | MiniMax-M2.7 | 204800 | Cloud, paid |

## Fallback Mechanism

```typescript
// Embedding: omlx primary → OpenAI fallback
async embed(text: string): Promise<Float32Array> {
  try {
    return await this.embed_omlx(text);   // PRIMARY: omlx bge-m3
  } catch (e) {
    console.warn("omlx embed failed, trying OpenAI...");
    return await this.embed_openai(text);  // FALLBACK: OpenAI
  }
}

// Expansion: omlx primary → MiniMax fallback
async expandQuery(query: string): Promise<string[]> {
  try {
    return await this.expand_gemma(query); // PRIMARY: omlx Gemma
  } catch (e) {
    console.warn("omlx LLM failed, trying MiniMax...");
    return await this.expand_minimax(query); // FALLBACK: MiniMax
  }
}
```

## Setup

### 1. Initialize GBrain

```bash
gbrain init
```

This creates a default config with omlx as primary and cloud providers as fallback.

### 2. Verify Setup

```bash
gbrain doctor
```

Expected output:
```
✅ Embedding provider: omlx (bge-m3-mlx-fp16)
✅ LLM provider: omlx_llm (gemma-4-26b-a4b-it-oQ4)
✅ Fallback: minimax (MiniMax-M2.7)
```

### 3. Test Embedding

```bash
echo "Hello world" | gbrain embed
```

### 4. Test Query with Expansion

```bash
gbrain query "meeting notes" --expand
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (for fallback embedding) |
| `MINIMAX_API_KEY` | MiniMax API key (for fallback LLM) |
| `GBRAIN_DATABASE_URL` | Database connection URL |
| `DATABASE_URL` | Alternative database URL |

## Fresh Brain Required

When using dynamic dimensions (1024 vs 1536), existing brains with mismatched dimensions will fail. To fix:

```bash
rm -rf ~/.gbrain/brain.pglite
gbrain init
gbrain import <your-docs>
```

## Troubleshooting

### omlx Not Running

```bash
# Check if omlx is running
curl -s http://127.0.0.1:8000/v1/models

# Start omlx if needed
omlx serve &
```

### Dimension Mismatch

If you see errors about dimensions:
1. Check `~/.gbrain/config.json` brain.embedding_dimensions
2. Verify the model dimensions in providers section match
3. Delete brain and reinitialize if needed

### Fallback Not Working

1. Verify cloud API keys are set in environment or config
2. Check provider baseUrl is correct
3. Run `gbrain doctor --verbose` for detailed diagnostics
