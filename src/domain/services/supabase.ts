import { createClient, Provider } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_KEY || '';

const supabase = createClient(url, key)

export const authenticateUser = (provider: Provider) => supabase.auth.signInWithOAuth({ provider });

export default supabase;
