'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useTaskmind } from '@/app/providers';
import { motion } from 'framer-motion';
import { FaRegTrashAlt, FaPlus, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';

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
    if (!titulo.trim()) return;
    adicionarHabito(titulo, horario);
    setTitulo('');
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">Hábitos Diários</h1>
        <p className="text-slate-400">
          Construa consistência marcando suas atividades recorrentes.
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl  lg:flex-row lg:items-end"
        >
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Nome do Hábito
            </label>
            <div className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 ring-1 ring-slate-800 focus-within:ring-red-500/50">
              <FaPlus className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ex: Ler 10 páginas, beber água..."
                className="flex-1 bg-transparent py-2.5 text-slate-100 outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:w-40">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Horário
            </label>
            <div className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 ring-1 ring-slate-800 focus-within:ring-red-500/50">
              <FaClock className="h-4 w-4 text-slate-500" />
              <input
                type="time"
                value={horario}
                onChange={e => setHorario(e.target.value)}
                className="flex-1 bg-transparent py-2.5 text-slate-100 outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!titulo.trim()}
            className="flex h-[46px] items-center justify-center gap-2 rounded-lg bg-red-600 px-6 font-semibold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-500 active:scale-95 disabled:opacity-50"
          >
            <FaPlus className="h-3 w-3" />
            <span>Criar Hábito</span>
          </button>
        </form>
      </motion.div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-800/20 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <FaCalendarAlt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Acompanhamento Semanal
              </h2>
              <p className="text-sm text-slate-500">
                Progresso dos seus hábitos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-800 p-1 ring-1 ring-slate-800">
            <button
              type="button"
              onClick={() => {
                const d = new Date(semanaInicio);
                d.setDate(d.getDate() - 7);
                setSemanaInicio(d);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setSemanaInicio(startOfWeekMonday(new Date()))}
              className="px-3 text-xs font-semibold uppercase tracking-tighter text-slate-400 hover:text-slate-100"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date(semanaInicio);
                d.setDate(d.getDate() + 7);
                setSemanaInicio(d);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {habitos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-800 py-12 text-center">
            <p className="text-slate-500 italic">
              Nenhum hábito cadastrado para esta visualização.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-slate-800">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="sticky left-0 z-10 w-[190px] border-b border-slate-800 bg-slate-800 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Hábito
                  </th>
                  {diasDaSemana.map(dia => {
                    const isHoje = dia.iso === hoje;
                    return (
                      <th
                        key={dia.iso}
                        className={`border-b border-slate-800 px-2 py-4 text-center ${
                          isHoje ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-[10px] font-bold uppercase ${isHoje ? 'text-emerald-500' : 'text-slate-500'}`}>
                            {dia.label}
                          </span>
                          <span className={`text-sm font-medium ${isHoje ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {dia.iso.slice(8, 10)}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="w-[60px] border-b border-slate-800 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                {habitos.map(habito => (
                  <tr key={habito.id} className="group hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-slate-850/50 px-4 py-4 group-hover:bg-slate-800/50">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">
                          {habito.titulo}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <FaClock className="h-2.5 w-2.5" />
                          {habito.horario}
                        </span>
                      </div>
                    </td>

                    {diasDaSemana.map(dia => {
                      const checked = habitoConcluidoNoDia(habito.id, dia.iso);
                      const isHoje = dia.iso === hoje;
                      return (
                        <td
                          key={`${habito.id}-${dia.iso}`}
                          className={`px-2 py-4 text-center ${
                            isHoje ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <label className="flex cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                alternarHabitoNoDia(habito.id, dia.iso)
                              }
                              className="h-6 w-6 appearance-none rounded-full border-2 border-slate-700 bg-slate-950/30 transition-all checked:border-emerald-500 checked:bg-emerald-500 cursor-pointer hover:border-slate-500"
                            />
                          </label>
                        </td>
                      );
                    })}

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => removerHabito(habito.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        aria-label={`Excluir hábito: ${habito.titulo}`}
                      >
                        <FaRegTrashAlt className="h-3.5 w-3.5" />
                      </button>
                    </td>
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

