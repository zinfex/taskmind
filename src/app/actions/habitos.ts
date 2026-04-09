"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error: string | null;
  success: boolean | null;
  limitReached?: boolean;
  timestamp?: number;
};

async function getUserData(supabase: any) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", authData.user.email)
    .maybeSingle();

  return userData || null;
}

export async function createHabitos(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const titulo = formData.get('titulo') as string;
  const finalizar = formData.get('finalizar') as string || null;

  if (!titulo) {
    return { error: "O título é obrigatório.", success: null };
  }

  try {
    const supabase = await createClient();
    const userData = await getUserData(supabase);

    if (!userData) {
      return { error: "Usuário não autenticado ou não encontrado.", success: null };
    }

    // Verificação de Limite PRO (4 hábitos)
    if (!userData.is_pro) {
      const { count, error: countError } = await supabase
        .from("habitos")
        .select("*", { count: 'exact', head: true })
        .eq("id_user", userData.id);

      if (!countError && count !== null && count >= 4) {
        return { error: "Limite de hábitos atingido.", success: false, limitReached: true, timestamp: Date.now() };
      }
    }

    const { error: insertError } = await supabase
      .from("habitos")
      .insert([
        {
          titulo,
          finalizar,
          id_user: userData.id
        }
      ]);

    if (insertError) {
      return { error: insertError.message, success: null };
    }

    revalidatePath("/habitos");
    revalidatePath("/hoje");
    return { error: null, success: true, timestamp: Date.now() };
  } catch (err: any) {
    return { error: "Erro interno no servidor.", success: null };
  }
}

export async function listHabitos() {
  try {
    const supabase = await createClient();
    const userData = await getUserData(supabase);

    if (!userData) {
      return { error: "Usuário não autenticado." };
    }

    const { data: habitos, error: queryError } = await supabase
      .from("habitos")
      .select("*")
      .eq("id_user", userData.id)
      .order("id", { ascending: false });

    if (queryError) {
      return { error: queryError.message };
    }

    return { success: true, data: habitos };
  } catch (err) {
    return { error: "Erro ao buscar hábitos." };
  }
}

export async function toggleHabito(habito_id: number | string, novoStatus: boolean, data?: string) {
  const dataConclusao = data || new Date().toISOString().split('T')[0];

  try {
    const supabase = await createClient();
    const userData = await getUserData(supabase);

    if (!userData) {
      return { error: "Usuário não autenticado." };
    }

    if (novoStatus) {
      // Marcar como concluído
      const { error } = await supabase
        .from("habitos_conclusoes")
        .upsert({ habito_id, data: dataConclusao }, { onConflict: 'habito_id,data' });
      
      if (error) return { error: error.message };
    } else {
      // Desmarcar
      const { error } = await supabase
        .from("habitos_conclusoes")
        .delete()
        .eq("habito_id", habito_id)
        .eq("data", dataConclusao);

      if (error) return { error: error.message };
    }

    revalidatePath("/habitos");
    revalidatePath("/hoje");
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao atualizar status do hábito." };
  }
}

export async function deleteHabitosDB(id: number | string) {
  try {
    const supabase = await createClient();

    // Primeiro tentamos excluir conclusões (embora ON DELETE CASCADE seja melhor)
    await supabase
      .from("habitos_conclusoes")
      .delete()
      .eq("habito_id", id);

    const { error } = await supabase
      .from("habitos")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/habitos");
    revalidatePath("/hoje");
    return { success: true };
  } catch (err) {
    return { error: "Erro ao excluir hábito." };
  }
}
