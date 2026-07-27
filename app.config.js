const fs = require('node:fs');
const path = require('node:path');

function parseDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const parsed = {};
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

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

function loadDotEnv() {
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
      ...parseDotEnvFile(path.join(__dirname, fileName)),
    };
  }, {});
}

function deriveSupabaseUrl(explicitUrl, dbHost) {
  if (explicitUrl) {
    return explicitUrl;
  }

  if (!dbHost) {
    return '';
  }

  const match = dbHost.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
  if (!match) {
    return '';
  }

  return `https://${match[1]}.supabase.co`;
}

module.exports = ({ config }) => {
  const fileEnv = loadDotEnv();
  const env = {
    ...fileEnv,
    ...process.env,
  };

  const supabaseUrl = deriveSupabaseUrl(
    env.EXPO_PUBLIC_SUPABASE_URL || env.SUPABASE_URL,
    env.SUPABASE_DB_HOST,
  );
  const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_DB_PUB_KEY || '';

  return {
    ...config,
    name: 'Bourbon Brothers',
    slug: 'bourbon-finder',
    version: '1.0.0',
    orientation: 'portrait',
    platforms: ['ios', 'android', 'web'],
    plugins: ['expo-status-bar'],
    web: {
      bundler: 'metro',
      favicon: './assets/branding/bourbon-finder-favicon.png',
      output: 'single',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.bourbonfinder.app',
    },
    android: {
      package: 'com.bourbonfinder.app',
    },
    extra: {
      eas: {
        projectId: '52fca7bd-f77c-408e-b3a9-0292eca9139d',
      },
      publicEnv: {
        supabaseUrl,
        supabaseAnonKey,
      },
    },
  };
};
