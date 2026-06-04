import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = 'https://wyhwnxoguqdzpszhzpzl.supabase.co';
const supabaseKey = 'sb_publishable_jAv-pvBiwYLOlRWbhShCEg_SkcJCNoH';

const ExpoSecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});