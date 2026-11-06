import { createClient } from '@supabase/supabase-js';

// Cấu hình kết nối Supabase PostgreSQL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ilcfuavufajyzoorxafb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jTWoCeOWX6YvrSZTW50H0Q_LpixDjhE';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
