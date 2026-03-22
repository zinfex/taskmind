import { createClient } from '@/lib/supabase/server'

export async function tarefas(userId: string) {
  const supabase = await createClient()

  return await supabase
    .from('tarefas')
    .select('*')
    .eq('id_user', userId)
}
