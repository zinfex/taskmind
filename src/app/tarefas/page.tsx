'use client';

import { FormEvent, useState } from 'react';
import { useTaskmind } from '../providers';

export default function TarefasPage() {
  const { hoje, tarefas, adicionarTarefa, alternarTarefa, removerTarefa } =
    useTaskmind();
  const [titulo, setTitulo] = useState('');

  const tarefasDeHoje = tarefas.filter(t => t.data === hoje);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    adicionarTarefa(titulo);
    setTitulo('');
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">
          Tarefas de hoje
        </h1>
        <p className="text-sm text-slate-400">
          Liste tudo o que você precisa resolver no dia.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-red-900 bg-[#1B1B22] p-4 sm:flex-row"
      >
        <div className="flex-1">
          <label className="mb-3 block text-lg font-medium text-slate-300">
            Nova tarefa para hoje ({hoje})
          </label>
          <input
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Ex: Revisar projeto, pagar contas, ligar para alguém..."
            className="w-full rounded-lg border border-slate-700 bg-[#1B1B22] px-3 py-2 text-lg text-slate-50 outline-none ring-red-500/40 focus:border-red-500 focus:ring-2"
          />
          <button
            type="submit"
            className="mt-1 h-10 rounded-lg w-full bg-red-500 px-4 text-sm font-medium text-slate-50 transition hover:bg-red-400 sm:mt-6"
          >
            Adicionar
          </button>
        </div>
      </form>

      <div>
        <h2 className="mb-3 text-sm font-medium text-slate-200">
          Lista de tarefas ({tarefasDeHoje.length})
        </h2>

        {tarefasDeHoje.length === 0 ? (
          <p className="text-sm text-slate-400 ">
            Nenhuma tarefa cadastrada para hoje. Comece adicionando a primeira
            acima.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tarefasDeHoje.map(tarefa => (
              <li
                key={tarefa.id}
                className="flex items-center justify-between rounded-lg border-1 border-slate-800 bg-[#1B1B22] px-3 py-4"
              >
                <label className="flex cursor-pointer items-center gap-3 text-lg">
                  <input
                    type="checkbox"
                    checked={tarefa.concluida}
                    onChange={() => alternarTarefa(tarefa.id)}
                    className="h-6 w-6 appearance-none rounded-full border-2 border-slate-500 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition"
                    />
                  <span
                    className={
                      tarefa.concluida
                        ? 'text-slate-400 line-through'
                        : 'text-slate-100'
                    }
                  >
                    {tarefa.titulo}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => removerTarefa(tarefa.id)}
                  className="rounded-lg border border-red-900/70 bg-transparent px-3 py-1.5 text-sm font-medium text-red-200 transition hover:bg-red-950/40 hover:text-red-100"
                  aria-label={`Excluir tarefa: ${tarefa.titulo}`}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

