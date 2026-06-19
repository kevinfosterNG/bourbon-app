import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

function parseDotEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const parsed = {};
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^(['"])(.*)\1$/, '$2');
    parsed[key] = value;
  }

  return parsed;
}

function resolveAppEnv() {
  return (
    process.env.APP_ENV ||
    process.env.EAS_ENV ||
    process.env.EAS_BUILD_PROFILE ||
    process.env.NODE_ENV ||
    'development'
  ).trim();
}

function loadFileEnv() {
  const appEnv = resolveAppEnv();
  const candidateFiles = [
    '.env',
    '.env.local',
    `.env.${appEnv}`,
    `.env.${appEnv}.local`,
  ];

  return candidateFiles.reduce((merged, fileName) => {
    return {
      ...merged,
      ...parseDotEnvFile(path.resolve(fileName)),
    };
  }, {});
}

export function loadSupabaseDbEnv() {
  const fileEnv = loadFileEnv();
  const env = {
    ...fileEnv,
    ...process.env,
  };

  if (env.SUPABASE_DB_URL) {
    return {
      connectionString: env.SUPABASE_DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  const requiredKeys = [
    'SUPABASE_DB_HOST',
    'SUPABASE_DB_PORT',
    'SUPABASE_DB_NAME',
    'SUPABASE_DB_USER',
    'SUPABASE_DB_PASSWORD',
  ];

  const missing = requiredKeys.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required Supabase DB env vars: ${missing.join(', ')}`);
  }

  return {
    host: env.SUPABASE_DB_HOST,
    port: Number(env.SUPABASE_DB_PORT),
    database: env.SUPABASE_DB_NAME,
    user: env.SUPABASE_DB_USER,
    password: env.SUPABASE_DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

export function loadSupabaseProjectEnv() {
  const fileEnv = loadFileEnv();
  const env = {
    ...fileEnv,
    ...process.env,
  };
  const dbHost = env.SUPABASE_DB_HOST?.trim() ?? '';
  const projectRef = dbHost.replace(/^db\./, '').replace(/\.supabase\.co$/i, '');
  const publicUrl = env.EXPO_PUBLIC_SUPABASE_URL?.trim() || (projectRef ? `https://${projectRef}.supabase.co` : '');

  return {
    projectRef,
    publicUrl,
    publishableKey: env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || env.SUPABASE_DB_PUB_KEY?.trim() || '',
  };
}

export function getResolvedAppEnv() {
  return resolveAppEnv();
}
