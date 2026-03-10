'use client';

import { FormEvent, useState } from 'react';
import { useTaskmind } from '../providers';

export default function HabitosPage() {
  const { habitos, adicionarHabito, removerHabito } = useTaskmind();
  const [titulo, setTitulo] = useState('');
  const [horario, setHorario] = useState('07:00');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    adicionarHabito(titulo, horario);
    setTitulo('');
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">Hábitos diários</h1>
        <p className="text-sm text-slate-400">
          Cadastre hábitos que irão aparecer todos os dias para você marcar.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className=" gap-3 rounded-xl border border-red-900 bg-[#1B1B22] p-4  sm:flex-row sm:items-end"
      >
        <div className="flex">
          <div className="flex-1">
            <label className="mb-3 block text-lg font-medium text-slate-300">
              Novo hábito
            </label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Ler 10 páginas, beber água, meditar..."
              className="w-[90%] rounded-lg border border-slate-700 bg-[#1B1B22] px-3 py-2 text-lg text-slate-50 outline-none ring-red-500/40 focus:border-red-500 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 w-[10%] block text-xs font-medium text-slate-300">
              Horário
            </label>
            <input
              type="time"
              value={horario}
              onChange={e => setHorario(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-750 px-3 py-2 text-sm text-slate-50 outline-none ring-red-500/40 focus:border-red-500 focus:ring-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-10 mt-5 w-full rounded-lg bg-red-500 px-4 text-sm font-medium text-slate-750 transition hover:bg-red-400"
        >
          Adicionar
        </button>
        
      </form>

      <div>
        <h2 className="mb-3 text-lg font-medium text-slate-200">
          Hábitos cadastrados ({habitos.length})
        </h2>

        {habitos.length === 0 ? (
          <p className="text-sm text-slate-400">
            Nenhum hábito cadastrado ainda. Comece adicionando o primeiro acima.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 md:w-[50%]">
            {habitos.map(habito => (
              <li
                key={habito.id}
                className="flex items-center justify-between rounded-lg border-1 border-slate-800 bg-[#1B1B22] px-3 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg text-slate-100">{habito.titulo}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                    {habito.horario}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removerHabito(habito.id)}
                  className="rounded-lg border border-red-900/70 bg-transparent px-3 py-1.5 text-sm font-medium text-red-200 transition hover:bg-red-950/40 hover:text-red-100"
                  aria-label={`Excluir hábito: ${habito.titulo}`}
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

