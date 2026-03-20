'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' }
  }

  const supabase = await createClient()

  // 1. Verifica na sua tabela customizada 'users' (apenas email e password)
  const { data: customUser, error: customError } = await supabase
    .from('users')
    .select('email, password')
    .eq('email', email)
    .eq('password', password)
    .maybeSingle()

  if (customError) {
    return { error: `Erro na tabela users: ${customError.message}` }
  }

  if (!customUser) {
    return { error: 'Usuário não encontrado ou senha incorreta.' }
  }

  // 2. Tenta o login oficial no Supabase Auth
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    if (authError.message === 'Invalid login credentials') {
      return { 
        error: 'O usuário existe no banco, mas não no sistema de Autenticação. Faça o Cadastro novamente.' 
      }
    }
    return { error: `Erro de Autenticação: ${authError.message}` }
  }

  revalidatePath('/', 'layout')
  redirect('/hoje')
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' }
  }

  const supabase = await createClient()

  // 1. Cria o usuário no Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Insere apenas email e password na sua tabela 'users'
  const { error: insertError } = await supabase.from('users').insert([
    { 
      email, 
      password
    }
  ])
  
  if (insertError) {
    console.error('Erro ao salvar dados extras:', insertError.message)
  }

  return { success: 'Cadastro realizado com sucesso!' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
