'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Task = {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  concluida: boolean;
};

type Habit = {
  id: string;
  titulo: string;
  horario: string; // HH:MM
};

type TaskmindState = {
  tarefas: Task[];
  habitos: Habit[];
  conclusoesHabitos: Record<string, boolean>; // chave: `${habitId}:${data}`
};

type TaskmindContextType = TaskmindState & {
  hoje: string;
  adicionarTarefa: (titulo: string, data?: string) => void;
  alternarTarefa: (id: string) => void;
  removerTarefa: (id: string) => void;
  adicionarHabito: (titulo: string, horario: string) => void;
  removerHabito: (id: string) => void;
  alternarHabitoNoDia: (habitoId: string, data: string) => void;
  habitoConcluidoNoDia: (habitoId: string, data: string) => boolean;
};

const TaskmindContext = createContext<TaskmindContextType | undefined>(
  undefined,
);

const STORAGE_KEY = 'taskmind-state-v1';

function getHojeISO() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function carregarEstadoInicial(): TaskmindState {
  if (typeof window === 'undefined') {
    return {
      tarefas: [],
      habitos: [],
      conclusoesHabitos: {},
    };
  }

  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) {
      return {
        tarefas: [],
        habitos: [],
        conclusoesHabitos: {},
      };
    }
    const parsed = JSON.parse(bruto) as TaskmindState;
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('estado inválido');
    }
    return {
      tarefas: parsed.tarefas ?? [],
      habitos: parsed.habitos ?? [],
      conclusoesHabitos: parsed.conclusoesHabitos ?? {},
    };
  } catch {
    return {
      tarefas: [],
      habitos: [],
      conclusoesHabitos: {},
    };
  }
}

export function TaskmindProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<TaskmindState>(() =>
    carregarEstadoInicial(),
  );

  const hoje = useMemo(() => getHojeISO(), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch {
      // falha silenciosa no localStorage
    }
  }, [estado]);

  const adicionarTarefa = useCallback((titulo: string, data?: string) => {
    const limpa = titulo.trim();
    if (!limpa) return;
    const quando = data ?? hoje;
    setEstado(prev => ({
      ...prev,
      tarefas: [
        ...prev.tarefas,
        {
          id: `tarefa-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          titulo: limpa,
          data: quando,
          concluida: false,
        },
      ],
    }));
  }, [hoje]);

  const alternarTarefa = useCallback((id: string) => {
    setEstado(prev => ({
      ...prev,
      tarefas: prev.tarefas.map(t =>
        t.id === id ? { ...t, concluida: !t.concluida } : t,
      ),
    }));
  }, []);

  const removerTarefa = useCallback((id: string) => {
    setEstado(prev => ({
      ...prev,
      tarefas: prev.tarefas.filter(t => t.id !== id),
    }));
  }, []);

  const adicionarHabito = useCallback((titulo: string, horario: string) => {
    const limpa = titulo.trim();
    if (!limpa || !horario) return;
    setEstado(prev => ({
      ...prev,
      habitos: [
        ...prev.habitos,
        {
          id: `habito-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          titulo: limpa,
          horario,
        },
      ],
    }));
  }, []);

  const removerHabito = useCallback((id: string) => {
    setEstado(prev => {
      const proximosHabitos = prev.habitos.filter(h => h.id !== id);
      const proximasConclusoes: Record<string, boolean> = {};

      for (const [chave, valor] of Object.entries(prev.conclusoesHabitos)) {
        if (!chave.startsWith(`${id}:`)) {
          proximasConclusoes[chave] = valor;
        }
      }

      return {
        ...prev,
        habitos: proximosHabitos,
        conclusoesHabitos: proximasConclusoes,
      };
    });
  }, []);

  const alternarHabitoNoDia = useCallback((habitoId: string, data: string) => {
    const chave = `${habitoId}:${data}`;
    setEstado(prev => ({
      ...prev,
      conclusoesHabitos: {
        ...prev.conclusoesHabitos,
        [chave]: !prev.conclusoesHabitos[chave],
      },
    }));
  }, []);

  const habitoConcluidoNoDia = useCallback(
    (habitoId: string, data: string) => {
      const chave = `${habitoId}:${data}`;
      return Boolean(estado.conclusoesHabitos[chave]);
    },
    [estado.conclusoesHabitos],
  );

  const value: TaskmindContextType = {
    ...estado,
    hoje,
    adicionarTarefa,
    alternarTarefa,
    removerTarefa,
    adicionarHabito,
    removerHabito,
    alternarHabitoNoDia,
    habitoConcluidoNoDia,
  };

  return (
    <TaskmindContext.Provider value={value}>
      {children}
    </TaskmindContext.Provider>
  );
}

export function useTaskmind() {
  const ctx = useContext(TaskmindContext);
  if (!ctx) {
    throw new Error('useTaskmind deve ser usado dentro de TaskmindProvider');
  }
  return ctx;
}

