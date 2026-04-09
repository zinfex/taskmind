"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error: string | null;
  success: boolean | null;
  limitReached?: boolean;
  timestamp?: number;
};

export async function createTarefas(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const titulo = formData.get('titulo') as string;
  const descricao = formData.get('descricao') as string || null;
  const finalizar = formData.get('finalizar') as string || null;
  const finalizada = false;

  if (!titulo) {
    return { error: "O título é obrigatório.", success: null };
  }

  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return { error: "Usuário não autenticado.", success: null };
    }

    const email = authData.user.email;

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!userData) {
      return { error: "Usuário não encontrado no banco.", success: null };
    }

    // Verificação de Limite PRO (3 tarefas)
    if (!userData.is_pro) {
      const { count, error: countError } = await supabase
        .from("tarefas")
        .select("*", { count: 'exact', head: true })
        .eq("id_user", userData.id);

      if (!countError && count !== null && count >= 3) {
        return { error: "Limite de tarefas atingido.", success: false, limitReached: true, timestamp: Date.now() };
      }
    }

    const { error: insertError } = await supabase
      .from("tarefas")
      .insert([
        {
          titulo,
          finalizar,
          descricao,
          finalizada,
          id_user: userData.id
        }
      ]);

    if (insertError) {
      return { error: insertError.message, success: null };
    }

    revalidatePath("/tarefas");
    revalidatePath("/hoje");
    return { error: null, success: true, timestamp: Date.now() };
  } catch (err: any) {
    return { error: "Erro interno no servidor.", success: null };
  }
}

export async function listTarefas() {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return { error: "Usuário não autenticado." };
    }

    const email = authData.user.email;
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!userData) {
      return { error: "Usuário não encontrado." };
    }

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

export async function toggleTarefa(id: number | string, novoStatus: boolean) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("tarefas")
      .update({ finalizada: novoStatus })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/tarefas");
    revalidatePath("/hoje");
    return { success: true };
  } catch (err) {
    return { error: "Erro ao atualizar status." };
  }
}

export async function deleteTarefasDB(id: number | string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tarefas")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/tarefas");
    revalidatePath("/hoje");
    return { success: true };
  } catch (err) {
    return { error: "Erro ao excluir tarefa." };
  }
}
