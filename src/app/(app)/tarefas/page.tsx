'use client';

import { useTaskmind } from '@/app/providers';
import { useActionState, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrashAlt, FaCheck, FaAlignLeft } from 'react-icons/fa';
import { createTarefas, listTarefas, toggleTarefa, deleteTarefasDB, type ActionState } from '@/app/actions/tarefas';
import { BiTask } from 'react-icons/bi';
import LoadingSkeleton from '@/app/components/(app)/LoadingSkeleton';

export default function TarefasPage() {
  const { hoje } = useTaskmind();
  const [tarefasDB, setTarefasDB] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: ActionState = {
    error: null,
    success: null,
  };

  const [state, formAction, isPending] = useActionState(createTarefas, initialState);

  const carregarTarefas = useCallback(async () => {
    setCarregando(true);
    try {
      const resultado = await listTarefas();
      if (resultado.success && resultado.data) {
        setTarefasDB(resultado.data);
      }
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    carregarTarefas();
  }, [carregarTarefas]);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      carregarTarefas();
    }
  }, [state, carregarTarefas]);

  const handleToggle = async (id: number | string, statusAtual: any) => {
    const isFinalizada = statusAtual === true || statusAtual === "TRUE";
    const novoStatus = !isFinalizada;

    setTarefasDB(prev => prev.map(t => 
      t.id === id ? { ...t, finalizada: novoStatus } : t
    ));

    const res = await toggleTarefa(id, novoStatus);
    if (res.error) {
      alert("Erro ao atualizar tarefa: " + res.error);
      carregarTarefas();
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    setTarefasDB(prev => prev.filter(t => t.id !== id));

    const res = await deleteTarefasDB(id);
    if (res.error) {
      alert("Erro ao excluir tarefa: " + res.error);
      carregarTarefas();
    }
  };

  const dataFormatada = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
    });
  }, []);

  if (!mounted) return null;

  return (
    <section className="flex w-full flex-col gap-10 pb-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-lg shadow-red-500/20">
            <BiTask className="text-4xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-white">Minhas Tarefas</h1>
            <p className="text-slate-400">Gerenciando atividades de {dataFormatada}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">{tarefasDB.length} tarefas ativas</span>
        </div>
      </header>

      {state?.error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20"
        >
          {state.error}
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white/5 p-1 border border-white/10 backdrop-blur-md"
      >
        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center"
        >
          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/5 px-4 ring-1 ring-white/10 focus-within:ring-red-500/50 transition-all">
              <FaPlus className="text-slate-500 text-sm" />
              <input
                type="text"
                name="titulo"
                required
                placeholder="O que você precisa fazer?"
                className="flex-1 bg-transparent py-3 text-white outline-none placeholder:text-slate-600"
                disabled={isPending}
              />
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/5 px-4 ring-1 ring-white/10 focus-within:ring-red-500/50 transition-all">
              <FaAlignLeft className="text-slate-500 text-sm" />
              <input
                type="text"
                name="descricao"
                placeholder="Descrição (opcional)"
                className="flex-1 bg-transparent py-3 text-white outline-none placeholder:text-slate-600"
                disabled={isPending}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex h-[48px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-8 font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-500 active:scale-95 disabled:opacity-50"
          >
            <span>{isPending ? 'Adicionando...' : 'Adicionar'}</span>
            <FaPlus className="text-xs" />
          </button>
        </form>
      </motion.div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Lista de tarefas
          </h2>
        </div>

        {carregando ? (
          <LoadingSkeleton />
        ) : tarefasDB.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-16 text-center">
            <div className="mb-4 rounded-full bg-white/5 p-6 text-slate-700">
              <FaCheck className="text-4xl" />
            </div>
            <p className="text-lg font-medium text-slate-300">Tudo limpo por aqui!</p>
            <p className="text-sm text-slate-500 mt-2">Nenhuma tarefa cadastrada para hoje.</p>
          </div>
        ) : (
          <ul className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {tarefasDB.map(tarefa => {
                const isFinalizada = tarefa.finalizada === true || tarefa.finalizada === "TRUE";
                const dataCriacao = new Date(tarefa.created_at);
                const hojeDate = new Date();
                dataCriacao.setHours(0, 0, 0, 0);
                hojeDate.setHours(0, 0, 0, 0);
                const diffTime = hojeDate.getTime() - dataCriacao.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const isAtrasada = !isFinalizada && diffDays > 0;

                return (
                  <motion.li
                    layout
                    key={tarefa.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    onClick={() => handleToggle(tarefa.id, tarefa.finalizada)}
                    className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
                      isFinalizada 
                        ? 'border-white/5 bg-white/[0.02] opacity-60' 
                        : 'border-white/10 bg-white/5 hover:border-red-500/50 hover:bg-white/[0.08] hover:translate-x-1'
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        {isFinalizada ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                            <FaCheck className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="h-7 w-7 rounded-full border-2 border-white/20 transition-all group-hover:border-red-500 group-hover:scale-110" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-lg font-medium transition-all ${isFinalizada ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                          {tarefa.titulo}
                        </span>
                        {tarefa.descricao && (
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {tarefa.descricao}
                          </p>
                        )}
                        {isAtrasada && (
                          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md self-start">
                            Atrasada há {diffDays} {diffDays === 1 ? 'dia' : 'dias'}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(tarefa.id);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}
