'use client';

import { FaFire, FaTasks, FaCheckCircle } from 'react-icons/fa';
import { FiRefreshCcw, FiTarget, FiCalendar, FiClock } from 'react-icons/fi';
import { BiTask } from 'react-icons/bi';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import { useEffect, useState, useMemo } from 'react';
import { useTaskmind } from '@/app/providers';
import { GiSun } from 'react-icons/gi';
import { IoPartlySunny } from 'react-icons/io5';

export default function HojePage() {
  const {
    hoje,
    tarefas,
    habitos,
    alternarTarefa,
    alternarHabitoNoDia,
    habitoConcluidoNoDia,
  } = useTaskmind();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const tarefasDeHoje = useMemo(() => tarefas.filter(t => t.data === hoje), [tarefas, hoje]);
  const habitosDeHoje = habitos || [];

  const tarefasConcluidas = tarefasDeHoje.filter(t => t.concluida).length;
  const habitosConcluidos = habitosDeHoje.filter(h => habitoConcluidoNoDia(h.id, hoje)).length;
  
  const totalItens = tarefasDeHoje.length + habitosDeHoje.length;
  const totalConcluidos = tarefasConcluidas + habitosConcluidos;
  const progressoTotal = totalItens > 0 ? Math.round((totalConcluidos / totalItens) * 100) : 0;

  const dataFormatada = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header com Boas-vindas e Progresso */}
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold tracking-tight text-white flex gap-2 items-center">
             <span className="text-slate-100 text-5xl"><IoPartlySunny /> </span>

              <div>
                <span className='text-3xl'>Bom dia!</span>
                <p className="flex items-center gap-2 text-1xl text-slate-400">
                  <span className="capitalize">{dataFormatada}</span>
                </p>
              </div>
          </h1>
          
        </div>

        <div className="flex flex-col gap-2 min-w-[240px]">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-300">Progresso do dia</span>
            <span className="text-red-400">{progressoTotal}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500 ease-out"
              style={{ width: `${progressoTotal}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coluna Principal: Tarefas e Hábitos */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          
          {/* Seção de Tarefas */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <BiTask className="text-red-500 text-xl" />
                Tarefas para hoje
                <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {tarefasDeHoje.length}
                </span>
              </h2>
            </div>

            {tarefasDeHoje.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-800/20 p-10 text-center ">
                <div className="mb-4 rounded-full bg-slate-800 p-4 text-slate-600">
                  <FaTasks className="text-3xl" />
                </div>
                <p className="text-slate-400">Nenhuma tarefa para hoje.</p>
                <p className="text-xs text-slate-500 mt-1">Foque em seus hábitos ou descanse!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {tarefasDeHoje.map(tarefa => (
                  <div
                    key={tarefa.id}
                    onClick={() => alternarTarefa(tarefa.id)}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-[#1B1B22] p-4 transition-all hover:border-red-500/30 hover:bg-[#22222a]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        {tarefa.concluida ? (
                          <FaCheckCircle className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-slate-600 transition-colors group-hover:border-red-500" />
                        )}
                      </div>
                      <span className={`text-lg transition-all ${tarefa.concluida ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {tarefa.titulo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Seção de Hábitos */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <FiRefreshCcw className="text-red-500 text-xl" />
              Hábitos diários
              <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                {habitosDeHoje.length}
              </span>
            </h2>

            {habitosDeHoje.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-800/20 p-6 text-center text-sm text-slate-400">
                Nenhum hábito configurado.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {habitosDeHoje.map(habito => {
                  const concluido = habitoConcluidoNoDia(habito.id, hoje);
                  return (
                    <div
                      key={habito.id}
                      onClick={() => alternarHabitoNoDia(habito.id, hoje)}
                      className={`group flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all ${
                        concluido 
                          ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' 
                          : 'border-slate-800 bg-[#1B1B22] hover:border-red-500/30 hover:bg-[#22222a]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          concluido ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-red-500/20 group-hover:text-red-400'
                        }`}>
                          {concluido ? <FaCheckCircle /> : <FiClock />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {habito.horario}
                        </span>
                      </div>
                      <span className={`font-medium transition-all ${concluido ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {habito.titulo}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Coluna Lateral: Resumo e Estatísticas */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800  p-6">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Resumo do Dia
            </h3>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-4 rounded-xl bg-slate-800/20 p-4 border border-slate-700/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 ">
                  <FaFire className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-slate-400">Dias de sequência</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-slate-800/20 p-4 border border-slate-700/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                  <FaTasks className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{tarefasConcluidas}/{tarefasDeHoje.length}</p>
                  <p className="text-xs text-slate-400">Tarefas concluídas</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-slate-800/20 p-4 border border-slate-700/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <FiRefreshCcw className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{habitosConcluidos}/{habitosDeHoje.length}</p>
                  <p className="text-xs text-slate-400">Hábitos realizados</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-slate-800/20 p-4 border border-slate-700/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <FiTarget className="text-xl" />
                </div>
                <div>
                  <p className="flex items-center gap-2 text-2xl font-bold text-white">
                    35 
                    <MdOutlineKeyboardDoubleArrowUp className="text-emerald-500 text-lg" />
                  </p>
                  <p className="text-xs text-slate-400">Pontos da semana</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-900 to-red-700 p-6 text-white shadow-lg shadow-red-500/10">
              <h4 className="font-bold">Dica do dia</h4>
              <p className="mt-2 text-sm text-red-50/90 leading-relaxed">
                Manter uma rotina consistente é a chave para o sucesso a longo prazo. Comece pequeno, cresça sempre.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

