import configs from '@/configs'
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(configs.SUPABASE_URL!, configs.SUPABASE_PUBLISHABLE_KEY!)
}
