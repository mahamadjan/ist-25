import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Если ключи не заданы, используем заглушки, чтобы приложение не падало с белым экраном
const url = supabaseUrl || 'https://placeholder-project.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient<any>(url, key);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
