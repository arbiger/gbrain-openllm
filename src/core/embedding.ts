/**
 * Embedding Service with OpenClaw-style Provider Support
 *
 * PRIMARY: omlx bge-m3-mlx-fp16 (1024 dimensions, local, free)
 * FALLBACK: OpenAI text-embedding-3-large (1536 dimensions, cloud)
 *
 * Retry with exponential backoff (4s base, 120s cap, 5 retries).
 * 8000 character input truncation.
 */

import OpenAI from 'openai';
import { loadConfig, getEmbeddingProvider, getEmbeddingFallback, type ProviderConfig, type ProviderModel } from './config.ts';

const MAX_CHARS = 8000;
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 4000;
const MAX_DELAY_MS = 120000;
const BATCH_SIZE = 100;

let primaryClient: OpenAI | null = null;
let fallbackClient: OpenAI | null = null;

function getClientForProvider(provider: ProviderConfig): OpenAI {
  if (provider.baseUrl.includes('openai.com')) {
    if (!fallbackClient) {
      fallbackClient = new OpenAI({ apiKey: provider.apiKey });
    }
    return fallbackClient;
  }
  if (!primaryClient) {
    primaryClient = new OpenAI({ baseURL: provider.baseUrl, apiKey: provider.apiKey });
  }
  return primaryClient;
}

export async function embed(text: string): Promise<Float32Array> {
  const truncated = text.slice(0, MAX_CHARS);
  const result = await embedBatch([truncated]);
  return result[0];
}

export async function embedBatch(texts: string[]): Promise<Float32Array[]> {
  const config = loadConfig();
  const truncated = texts.map(t => t.slice(0, MAX_CHARS));
  const results: Float32Array[] = [];

  for (let i = 0; i < truncated.length; i += BATCH_SIZE) {
    const batch = truncated.slice(i, i + BATCH_SIZE);
    const batchResults = await embedBatchWithRetry(batch, config);
    results.push(...batchResults);
  }

  return results;
}

async function embedBatchWithRetry(texts: string[], config: ReturnType<typeof loadConfig>): Promise<Float32Array[]> {
  const primary = config ? getEmbeddingProvider(config) : null;
  const fallback = config ? getEmbeddingFallback(config) : null;

  if (primary) {
    try {
      return await embedWithProvider(primary.provider, primary.model, texts);
    } catch (e) {
      console.warn(`[gbrain] omlx embed failed, trying fallback: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (fallback) {
    try {
      return await embedWithProvider(fallback.provider, fallback.model, texts);
    } catch (e) {
      console.error(`[gbrain] fallback embed also failed: ${e instanceof Error ? e.message : String(e)}`);
      throw e;
    }
  }

  throw new Error('No embedding provider configured');
}

async function embedWithProvider(provider: ProviderConfig, model: ProviderModel, texts: string[]): Promise<Float32Array[]> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const client = getClientForProvider(provider);
      const response = await client.embeddings.create({
        model: model.id,
        input: texts,
        dimensions: model.dimensions,
      });

      const sorted = response.data.sort((a, b) => a.index - b.index);
      return sorted.map(d => new Float32Array(d.embedding));
    } catch (e: unknown) {
      if (attempt === MAX_RETRIES - 1) throw e;

      let delay = BASE_DELAY_MS * Math.pow(2, attempt);

      if (e instanceof OpenAI.APIError && e.status === 429) {
        const retryAfter = e.headers?.['retry-after'];
        if (retryAfter) {
          const parsed = parseInt(retryAfter, 10);
          if (!isNaN(parsed)) {
            delay = parsed * 1000;
          }
        }
      }

      await sleep(delay);
    }
  }

  throw new Error('Embedding failed after all retries');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function embed_omlx(text: string): Promise<Float32Array> {
  const config = loadConfig();
  const primary = config ? getEmbeddingProvider(config) : null;
  if (!primary) throw new Error('omlx provider not configured');
  return embedWithProvider(primary.provider, primary.model, [text.slice(0, MAX_CHARS)])[0];
}

export async function embed_openai(text: string): Promise<Float32Array> {
  const config = loadConfig();
  const fallback = config ? getEmbeddingFallback(config) : null;
  if (!fallback) throw new Error('openai fallback not configured');
  return embedWithProvider(fallback.provider, fallback.model, [text.slice(0, MAX_CHARS)])[0];
}

export { MAX_CHARS as EMBEDDING_MAX_CHARS };
