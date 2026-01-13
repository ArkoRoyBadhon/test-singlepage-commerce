import configs from '@/configs'
import { createClient } from '@supabase/supabase-js'

export function createSupabaseAdmin() {
  return createClient(configs.SUPABASE_URL!, configs.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
