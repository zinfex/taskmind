"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTarefas(prevState: any, formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const finalizar = formData.get('finalizar') as string || null;
  const finalizada = "FALSE";

  if (!titulo) {
    return { error: "O título é obrigatório." };
  }

  try {
    const supabase = await createClient();
    
    // 1. Pega o usuário do Auth para saber o email
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      console.error(">>> Erro Auth:", authError);
      return { error: "Usuário não autenticado no Supabase Auth." };
    }

    const email = authData.user.email;

    // 2. Busca o ID NUMÉRICO (bigint) na sua tabela customizada 'users' usando o email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      console.error(">>> Erro ao buscar ID numérico na tabela users:", userError);
      return { error: "Não foi possível encontrar o ID do usuário no banco de dados." };
    }

    const id_user_numeric = userData.id;
    console.log(">>> ID Numérico encontrado:", id_user_numeric);

    // 3. Insere na tabela 'tarefas' usando o ID numérico
    const { error: insertError } = await supabase
      .from("tarefas")
      .insert([
        {
          titulo: titulo,
          finalizar: finalizar,
          finalizada: finalizada,
          id_user: id_user_numeric // Agora enviando um número (bigint)
        }
      ]);

    if (insertError) {
      console.error(">>> Erro Insert Tarefas:", insertError.message);
      return { error: `Erro ao salvar tarefa: ${insertError.message}` };
    }

    console.log(">>> Tarefa criada com sucesso!");
    revalidatePath("/tarefas");
    
    return { success: true };
  } catch (err: any) {
    console.error(">>> Erro Inesperado:", err);
    return { error: "Erro interno no servidor." };
  }
}

export async function listTarefas() {
    console.log(">>> Iniciando listTarefas");

  try {
    const supabase = await createClient();
    
    // 1. Pega o usuário do Auth
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return { error: "Usuário não autenticado." };
    }

    const email = authData.user.email;

    // 2. Busca o ID numérico na tabela users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return { error: "Usuário não encontrado no banco." };
    }

    // 3. Busca as tarefas do usuário
    const { data: tarefas, error: tarefasError } = await supabase
      .from("tarefas")
      .select("*")
      .eq("id_user", userData.id)
      .order("id", { ascending: false });

    if (tarefasError) {
      return { error: tarefasError.message };
    }

    return { success: true, data: tarefas };
  } catch (err) {
    return { error: "Erro ao buscar tarefas." };
  }
}

export async function toggleTarefa(id: string, formData: FormData) {
  console.log(">>> Iniciando toggleTarefa");

  try {
    const supabase = await createClient();
    
    // 1. Pega o usuário do Auth para saber o email
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      console.error(">>> Erro Auth:", authError);
      return { error: "Usuário não autenticado no Supabase Auth." };
    }

    const email = authData.user.email;

    // 2. Busca o ID NUMÉRICO (bigint) na sua tabela customizada 'users' usando o email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      console.error(">>> Erro ao buscar ID numérico na tabela users:", userError);
      return { error: "Não foi possível encontrar o ID do usuário no banco de dados." };
    }

    const id_user_numeric = userData.id;
    console.log(">>> ID Numérico encontrado:", id_user_numeric);

    // 3. Edita na tabela 'tarefas'
    const { error: insertError } = await supabase
      .from("tarefas")
      .update({ finalizada: true })
      .eq('id', id)

    if (insertError) {
      console.error(">>> Erro Update Tarefas:", insertError.message);
      return { error: `Erro ao editar tarefa: ${insertError.message}` };
    }

    console.log(">>> Tarefa editada com sucesso!");
    revalidatePath("/tarefas");
    
    return { success: true };
  } catch (err: any) {
    console.error(">>> Erro Inesperado:", err);
    return { error: "Erro interno no servidor." };
  }
}

export async function deleteTarefasDB() {
    console.log(">>> Iniciando deleteTarefas");

  try {
    const supabase = await createClient();
    
    // 1. Pega o usuário do Auth
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return { error: "Usuário não autenticado." };
    }

    const email = authData.user.email;

    // 2. Busca o ID numérico na tabela users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return { error: "Usuário não encontrado no banco." };
    }

    // 3. Busca as tarefas do usuário
    const { data: tarefas, error: tarefasError } = await supabase
      .from("tarefas")
      .select("*")
      .eq("id_user", userData.id)
      .order("id", { ascending: false });

    if (tarefasError) {
      return { error: tarefasError.message };
    }

    return { success: true, data: tarefas };
  } catch (err) {
    return { error: "Erro ao buscar tarefas." };
  }
}

