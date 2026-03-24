import { createClient } from '@/lib/supabase/server'

export async function habitos(userId: string) {
  const supabase = await createClient()

  return await supabase
    .from('habitos')
    .select('*')
    .eq('id_user', userId)
}
