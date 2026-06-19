import Constants from 'expo-constants';

type PublicEnv = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

function readConfigPublicEnv(): PublicEnv {
  const expoExtra = Constants.expoConfig?.extra as { publicEnv?: PublicEnv } | undefined;
  return expoExtra?.publicEnv ?? {};
}

function trimValue(value?: string | null) {
  return value?.trim() ?? '';
}

export function getPublicEnv() {
  const configEnv = readConfigPublicEnv();

  return {
    supabaseUrl: trimValue(process.env.EXPO_PUBLIC_SUPABASE_URL) || trimValue(configEnv.supabaseUrl),
    supabaseAnonKey: trimValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) || trimValue(configEnv.supabaseAnonKey),
  };
}

export function getSupabaseConfigError() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();
  const missing = [];

  if (!supabaseUrl) {
    missing.push('Supabase URL');
  }

  if (!supabaseAnonKey) {
    missing.push('Supabase anon key');
  }

  if (missing.length === 0) {
    return '';
  }

  return `Missing ${missing.join(' and ')}. Add them to .env or Expo public env config.`;
}
