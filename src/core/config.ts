<<<<<<< HEAD
import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'fs';
=======
import { readFileSync, writeFileSync, mkdirSync, chmodSync, existsSync } from 'fs';
>>>>>>> upstream/master
import { join } from 'path';
import { homedir } from 'os';
import type { EngineConfig } from './types.ts';

<<<<<<< HEAD
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

=======
/**
 * Where is the active DB URL coming from? Pure introspection, no connection
 * attempt. Used by `gbrain doctor --fast` so the user gets a precise message
 * instead of the misleading "No database configured" when GBRAIN_DATABASE_URL
 * (or DATABASE_URL) is actually set.
 *
 * Precedence matches loadConfig(): env vars win over config-file URL. Returns
 * null only when NO source provides a URL at all.
 */
export type DbUrlSource =
  | 'env:GBRAIN_DATABASE_URL'
  | 'env:DATABASE_URL'
  | 'config-file'
  | 'config-file-path' // PGLite: config file present, no URL but database_path set
  | null;

// Lazy-evaluated to avoid calling homedir() at module scope (breaks in serverless/bundled environments)
function getConfigDir() { return join(homedir(), '.gbrain'); }
function getConfigPath() { return join(getConfigDir(), 'config.json'); }

>>>>>>> upstream/master
export interface GBrainConfig {
  engine: 'postgres' | 'pglite';
  database_url?: string;
  database_path?: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
<<<<<<< HEAD
  providers?: Record<string, ProviderConfig>;
  brain?: BrainSection;
}

=======
}

/**
 * Load config with credential precedence: env vars > config file.
 * Plugin config is handled by the plugin runtime injecting env vars.
 */
>>>>>>> upstream/master
export function loadConfig(): GBrainConfig | null {
  let fileConfig: GBrainConfig | null = null;
  try {
    const raw = readFileSync(getConfigPath(), 'utf-8');
    fileConfig = JSON.parse(raw) as GBrainConfig;
  } catch { /* no config file */ }

<<<<<<< HEAD
=======
  // Try env vars
>>>>>>> upstream/master
  const dbUrl = process.env.GBRAIN_DATABASE_URL || process.env.DATABASE_URL;

  if (!fileConfig && !dbUrl) return null;

<<<<<<< HEAD
  const inferredEngine: 'postgres' | 'pglite' = fileConfig?.engine
    || (fileConfig?.database_path ? 'pglite' : 'postgres');

=======
  // Infer engine type if not explicitly set
  const inferredEngine: 'postgres' | 'pglite' = fileConfig?.engine
    || (fileConfig?.database_path ? 'pglite' : 'postgres');

  // Merge: env vars override config file
>>>>>>> upstream/master
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

<<<<<<< HEAD
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
=======
/**
 * Introspect where the active DB URL would come from if we tried to connect.
 * Never throws, never connects. Env vars take precedence (matches loadConfig).
 */
export function getDbUrlSource(): DbUrlSource {
  if (process.env.GBRAIN_DATABASE_URL) return 'env:GBRAIN_DATABASE_URL';
  if (process.env.DATABASE_URL) return 'env:DATABASE_URL';
  if (!existsSync(configPath())) return null;
  try {
    const raw = readFileSync(configPath(), 'utf-8');
    const parsed = JSON.parse(raw) as Partial<GBrainConfig>;
    if (parsed.database_url) return 'config-file';
    if (parsed.database_path) return 'config-file-path';
    return null;
  } catch {
    // Config file exists but is unreadable/malformed — treat as null source.
    return null;
  }
>>>>>>> upstream/master
}
