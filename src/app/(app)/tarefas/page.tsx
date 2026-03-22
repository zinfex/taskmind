'use client';

import { useTaskmind } from '@/app/providers';
import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrashAlt, FaCheck } from 'react-icons/fa';

export default function TarefasPage() {
  const { hoje, tarefas, adicionarTarefa, alternarTarefa, removerTarefa } =
    useTaskmind();
  const [titulo, setTitulo] = useState('');

  const tarefasDeHoje = tarefas.filter(t => t.data === hoje);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!titulo.trim()) return;
    adicionarTarefa(titulo);
    setTitulo('');
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
          Minhas Tarefas
        </h1>
        <p className="text-slate-400">
          Gerencie suas atividades do dia <span className="font-medium text-red-400">{hoje}</span>
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-slate-800/50 p-1 ring-1 ring-slate-800"
      >
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col gap-2 rounded-xl p-4 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <FaPlus className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="O que você precisa fazer hoje?"
              className="flex-1 bg-transparent px-1 py-2 text-lg text-slate-100 outline-none placeholder:text-slate-600 focus:ring-0"
            />
          </div>
          <button
            type="submit"
            disabled={!titulo.trim()}
            className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 font-semibold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-500 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <span>Adicionar</span>
            <FaPlus className="h-3 w-3 transition-transform group-hover:rotate-90" />
          </button>
        </form>
      </motion.div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Lista de tarefas
          </h2>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
            {tarefasDeHoje.length} total
          </span>
        </div>

        {tarefasDeHoje.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-800 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-700">
              <FaCheck className="h-6 w-6" />
            </div>
            <p className="text-slate-500">
              Tudo limpo por aqui! Nenhuma tarefa cadastrada.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {tarefasDeHoje.map(tarefa => (
                <motion.li
                  layout
                  key={tarefa.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4 transition-colors hover:border-slate-700 hover:bg-slate-900/50"
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-4">
                    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={tarefa.concluida}
                        onChange={() => alternarTarefa(tarefa.id)}
                        className="peer h-6 w-6 appearance-none rounded-full border-2 border-slate-700 bg-slate-950 transition-all checked:border-emerald-500 checked:bg-emerald-500 cursor-pointer"
                      />
                      <FaCheck className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                    </div>
                    <span
                      className={`text-lg transition-all ${
                        tarefa.concluida
                          ? 'text-slate-500 line-through'
                          : 'text-slate-200'
                      }`}
                    >
                      {tarefa.titulo}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removerTarefa(tarefa.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-500"
                    aria-label={`Excluir tarefa: ${tarefa.titulo}`}
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}

