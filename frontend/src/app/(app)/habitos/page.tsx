'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useTaskmind } from '@/app/providers';
import { FaRegTrashAlt } from 'react-icons/fa';

function toISODate(d: Date) {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function startOfWeekMonday(base: Date) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Dom, 1=Seg...
  const diff = (day + 6) % 7; // Seg=0 ... Dom=6
  d.setDate(d.getDate() - diff);
  return d;
}

export default function HabitosPage() {
  const {
    hoje,
    habitos,
    adicionarHabito,
    removerHabito,
    alternarHabitoNoDia,
    habitoConcluidoNoDia,
  } = useTaskmind();
  const [titulo, setTitulo] = useState('');
  const [horario, setHorario] = useState('07:00');
  const [semanaInicio, setSemanaInicio] = useState(() =>
    startOfWeekMonday(new Date()),
  );

  const diasDaSemana = useMemo(() => {
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(semanaInicio);
      d.setDate(d.getDate() + idx);
      return {
        label: labels[idx],
        date: d,
        iso: toISODate(d),
      };
    });
  }, [semanaInicio]);

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

      <div className="rounded-xl border border-slate-800 bg-[#1B1B22] p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-200">
              Calendário da semana
            </h2>
            <p className="text-sm text-slate-400">
              Marque os hábitos realizados em cada dia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const d = new Date(semanaInicio);
                d.setDate(d.getDate() - 7);
                setSemanaInicio(d);
              }}
              className="rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900"
            >
              Semana anterior
            </button>
            <button
              type="button"
              onClick={() => setSemanaInicio(startOfWeekMonday(new Date()))}
              className="rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900"
            >
              Esta semana
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date(semanaInicio);
                d.setDate(d.getDate() + 7);
                setSemanaInicio(d);
              }}
              className="rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900"
            >
              Próxima semana
            </button>
          </div>
        </div>

        {habitos.length === 0 ? (
          <p className="text-sm text-slate-400">
            Cadastre hábitos acima para visualizar o calendário semanal.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-[30px] border-b border-slate-800 bg-[#1B1B22] px-3 py-3 text-left text-sm font-medium text-slate-200">
                    Hábito
                  </th>
                  <th className='className="sticky left-0 z-10 w-[100px] border-b border-slate-800 bg-[#1B1B22] px-3 py-3 text-center text-sm font-medium text-slate-200'>Ação</th>
                  {diasDaSemana.map(dia => {
                    const isHoje = dia.iso === hoje;
                    return (
                      <th
                        key={dia.iso}
                        className={[
                          'border-b border-slate-800 px-3 py-3 text-center text-sm font-medium',
                          isHoje ? 'text-emerald-300' : 'text-slate-200',
                        ].join(' ')}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span>{dia.label}</span>
                          <span className="text-xs font-normal text-slate-400">
                            {dia.iso.slice(8, 10)}/{dia.iso.slice(5, 7)}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {habitos.map(habito => (
                  <tr key={habito.id}>
                    <td className="sticky left-0 z-10 border-b border-slate-800 bg-[#1B1B22] px-3 py-3 text-left">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-100">
                            {habito.titulo}
                          </p>
                          <p className="text-xs text-slate-400">
                            {habito.horario}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="sticky left-0 z-10 border-b border-slate-800 bg-[#1B1B22] px-3 py-3 text-center">
                      <button
                      type="button"
                      onClick={() => removerHabito(habito.id)}
                      className="cursor-pointer py-1.5 text-sm font-medium text-red-500 transition"
                      aria-label={`Excluir hábito: ${habito.titulo}`}
                    >
                      <FaRegTrashAlt />
                    </button>
                    </td>

                    {diasDaSemana.map(dia => {
                      const checked = habitoConcluidoNoDia(habito.id, dia.iso);
                      const isHoje = dia.iso === hoje;
                      return (
                        <td
                          key={`${habito.id}-${dia.iso}`}
                          className={[
                            'border-b border-slate-800 px-3 py-3 text-center',
                            isHoje ? 'bg-emerald-950/20' : '',
                          ].join(' ')}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              alternarHabitoNoDia(habito.id, dia.iso)
                            }
                            className="h-6 w-6 appearance-none rounded-full border-2 border-slate-500 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition"
                            
                            // className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                            aria-label={`Marcar ${habito.titulo} em ${dia.iso}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

