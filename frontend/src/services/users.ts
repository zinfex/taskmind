import { createClient } from '@/lib/supabase/server'

export async function users(userId: string) {
  const supabase = createClient()

  return await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
}