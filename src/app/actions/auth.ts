'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type AuthActionState = {
  error: string | null;
  success: string | null;
};

export async function login(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.', success: null }
  }

  try {
    const supabase = await createClient()

    // 1. Verifica na sua tabela customizada 'users'
    const { data: customUser, error: customError } = await supabase
      .from('users')
      .select('email, password')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle()

    if (customError) {
      return { error: `Erro na tabela users: ${customError.message}`, success: null }
    }

    if (!customUser) {
      return { error: 'Usuário não encontrado ou senha incorreta.', success: null }
    }

    // 2. Tenta o login oficial no Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      if (authError.message === 'Invalid login credentials') {
        return { 
          error: 'O usuário existe no banco, mas não no sistema de Autenticação. Faça o Cadastro novamente.',
          success: null
        }
      }
      return { error: `Erro de Autenticação: ${authError.message}`, success: null }
    }
  } catch (err) {
    return { error: 'Erro inesperado no login.', success: null }
  }

  revalidatePath('/', 'layout')
  redirect('/hoje')
}

export async function signup(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.', success: null }
  }

  try {
    const supabase = await createClient()

    // 1. Cria o usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { error: authError.message, success: null }
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

    return { success: 'Cadastro realizado com sucesso!', error: null }
  } catch (err) {
    return { error: 'Erro inesperado no cadastro.', success: null }
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, error: 'Usuário não autenticado' }
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .maybeSingle()

  return {
    user: {
      ...user,
      ...userData
    },
    error: error ? error.message : null
  }
}
