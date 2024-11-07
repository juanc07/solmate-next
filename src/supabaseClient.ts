import { createClient } from '@supabase/supabase-js';

// Use process.env for Next.js environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const solmateSupabaseUrl = process.env.NEXT_PUBLIC_SOLMATE_SUPABASE_URL!;
const solmateSupabaseAnonKey = process.env.NEXT_PUBLIC_SOLMATE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const solmateSupabase = createClient(solmateSupabaseUrl, solmateSupabaseAnonKey);