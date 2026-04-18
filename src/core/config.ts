import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type { EngineConfig } from './types.ts';

function getConfigDir() { return join(homedir(), '.gbrain'); }
function getConfigPath() { return join(getConfigDir(), 'config.json'); }

export type ProviderType = 'embedding' | 'llm';
export type ApiType = 'openai-compatible';

export interface ProviderModel {
  id: string;
  name?: string;
  dimensions?: number;
  contextWindow?: number;
  maxTokens?: number;
}

export interface ProviderConfig {
  type: ProviderType;
  baseUrl: string;
  apiKey: string;
  api: ApiType;
  models: ProviderModel[];
}

export interface BrainSection {
  embedding_provider: string;
  embedding_model: string;
  embedding_dimensions: number;
  embedding_fallback?: string;
  llm_provider: string;
  llm_model: string;
  llm_fallback?: string;
}

export interface GBrainConfig {
  engine: 'postgres' | 'pglite';
  database_url?: string;
  database_path?: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
  providers?: Record<string, ProviderConfig>;
  brain?: BrainSection;
}

export function loadConfig(): GBrainConfig | null {
  let fileConfig: GBrainConfig | null = null;
  try {
    const raw = readFileSync(getConfigPath(), 'utf-8');
    fileConfig = JSON.parse(raw) as GBrainConfig;
  } catch { /* no config file */ }

  const dbUrl = process.env.GBRAIN_DATABASE_URL || process.env.DATABASE_URL;

  if (!fileConfig && !dbUrl) return null;

  const inferredEngine: 'postgres' | 'pglite' = fileConfig?.engine
    || (fileConfig?.database_path ? 'pglite' : 'postgres');

  const merged = {
    ...fileConfig,
    engine: inferredEngine,
    ...(dbUrl ? { database_url: dbUrl } : {}),
    ...(process.env.OPENAI_API_KEY ? { openai_api_key: process.env.OPENAI_API_KEY } : {}),
  };
  return merged as GBrainConfig;
}

export function saveConfig(config: GBrainConfig): void {
  mkdirSync(getConfigDir(), { recursive: true });
  writeFileSync(getConfigPath(), JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
  try {
    chmodSync(getConfigPath(), 0o600);
  } catch {
    // chmod may fail on some platforms
  }
}

export function toEngineConfig(config: GBrainConfig): EngineConfig {
  return {
    engine: config.engine,
    database_url: config.database_url,
    database_path: config.database_path,
  };
}

export function configDir(): string {
  return join(homedir(), '.gbrain');
}

export function configPath(): string {
  return join(configDir(), 'config.json');
}

export function getEmbeddingProvider(config: GBrainConfig): { provider: ProviderConfig; model: ProviderModel } | null {
  if (!config.providers || !config.brain) return null;
  const providerName = config.brain.embedding_provider;
  const provider = config.providers[providerName];
  if (!provider) return null;
  const model = provider.models.find(m => m.id === config.brain!.embedding_model);
  if (!model) return null;
  return { provider, model };
}

export function getEmbeddingFallback(config: GBrainConfig): { provider: ProviderConfig; model: ProviderModel } | null {
  if (!config.providers || !config.brain?.embedding_fallback) return null;
  const provider = config.providers[config.brain.embedding_fallback];
  if (!provider) return null;
  const modelId = config.brain.embedding_model;
  const model = provider.models.find(m => m.id === modelId);
  if (!model) return null;
  return { provider, model };
}

export function getLLMProvider(config: GBrainConfig): { provider: ProviderConfig; model: ProviderModel } | null {
  if (!config.providers || !config.brain) return null;
  const providerName = config.brain.llm_provider;
  const provider = config.providers[providerName];
  if (!provider) return null;
  const model = provider.models.find(m => m.id === config.brain!.llm_model);
  if (!model) return null;
  return { provider, model };
}

export function getLLMFallback(config: GBrainConfig): { provider: ProviderConfig; model: ProviderModel } | null {
  if (!config.providers || !config.brain?.llm_fallback) return null;
  const provider = config.providers[config.brain.llm_fallback];
  if (!provider) return null;
  const modelId = config.brain.llm_model;
  const model = provider.models.find(m => m.id === modelId);
  if (!model) return null;
  return { provider, model };
}

export function createDefaultOpenClawConfig(): GBrainConfig {
  return {
    engine: 'pglite',
    providers: {
      omlx_embed: {
        type: 'embedding',
        baseUrl: 'http://127.0.0.1:8000/v1',
        apiKey: 'unlimited',
        api: 'openai-compatible',
        models: [
          {
            id: 'bge-m3-mlx-fp16',
            name: 'bge-m3 embedding',
            dimensions: 1024,
          },
        ],
      },
      omlx_llm: {
        type: 'llm',
        baseUrl: 'http://127.0.0.1:8000/v1',
        apiKey: 'unlimited',
        api: 'openai-compatible',
        models: [
          {
            id: 'gemma-4-26b-a4b-it-oQ4',
            contextWindow: 131072,
            maxTokens: 8192,
          },
        ],
      },
      openai: {
        type: 'embedding',
        baseUrl: 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY || '',
        api: 'openai-compatible',
        models: [
          {
            id: 'text-embedding-3-large',
            dimensions: 1536,
          },
        ],
      },
      minimax: {
        type: 'llm',
        baseUrl: 'https://api.minimax.chat/v1',
        apiKey: process.env.MINIMAX_API_KEY || '',
        api: 'openai-compatible',
        models: [
          {
            id: 'MiniMax-M2.7',
            contextWindow: 204800,
            maxTokens: 8192,
          },
        ],
      },
    },
    brain: {
      embedding_provider: 'omlx_embed',
      embedding_model: 'bge-m3-mlx-fp16',
      embedding_dimensions: 1024,
      embedding_fallback: 'openai',
      llm_provider: 'omlx_llm',
      llm_model: 'gemma-4-26b-a4b-it-oQ4',
      llm_fallback: 'minimax',
    },
  };
}
