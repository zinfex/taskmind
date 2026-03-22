import { createClient } from '@/lib/supabase/server'

export async function users(userId: string) {
  const supabase = await createClient()

  return await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
}
