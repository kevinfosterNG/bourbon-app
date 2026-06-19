import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { getPublicEnv } from '../config/env';

const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;
