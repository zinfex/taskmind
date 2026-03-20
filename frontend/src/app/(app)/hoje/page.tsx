'use client';

import { FaFire, FaTasks } from 'react-icons/fa';
import { FiRefreshCcw, FiTarget } from 'react-icons/fi';
import { BiTask } from 'react-icons/bi';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useTaskmind } from '@/app/providers';

export default function HojePage() {
  const {
    hoje,
    tarefas,
    habitos,
    alternarTarefa,
    alternarHabitoNoDia,
    habitoConcluidoNoDia,
  } = useTaskmind();

  const tarefasDeHoje = tarefas.filter(t => t.data === hoje);
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">Hoje</h1>
        <p className="text-sm text-slate-400">
          Veja em um só lugar suas tarefas e hábitos planejados para hoje (
          {hoje}).
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-1">
        <div className="round ed-xl border border-red-800 rounded-lg p-4">
          <h1 className="mb-3 text-lg font-medium text-slate-200">
          📋 Tarefas para concluir ({tarefasDeHoje.length})
          </h1>

          {tarefasDeHoje.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center">
              <FaTasks className='text-neutral-700 text-5xl text-center justify-self-center mb-2'/>
              Nenhuma tarefa cadastrada para hoje. Use a aba &quot;Tarefas&quot;
              para adicionar.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {tarefasDeHoje.map(tarefa => (
                <li
                  key={tarefa.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#1B1B22] px-3 py-4 checked:bg-es,m"
                >
                  <label className="flex cursor-pointer items-center gap-4 text-lg">
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
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='md:w-[100%] grid md:grid-cols-2 gap-5'>
          <div>
          <h2 className="mb-4 text-lg font-medium text-slate-200">
            🔁 Hábitos de hoje ({habitos?.length ?? 0})
          </h2>

            {habitos.length === 0 ? (
              <p className="text-sm text-slate-400">
                Nenhum hábito cadastrado ainda. Use a aba &quot;Hábitos&quot;.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 w-full">
                {habitos.map(habito => {
                  const concluido = habitoConcluidoNoDia(habito.id, hoje);

                  return (
                    <li
                      key={habito.id}
                      className="rounded-lg border border-slate-800 bg-[#1B1B22] px-3 py-3 transition hover:border-red-800 hover:bg-[#202028] active:scale-[0.99]"
                    >
                      <label className="flex w-full cursor-pointer items-center justify-between">
                        
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={concluido}
                            onChange={() => alternarHabitoNoDia(habito.id, hoje)}
                            className="h-6 w-6 appearance-none rounded-full border-2 border-slate-500 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition"
                          />
                  
                          <span
                            className={
                              concluido
                                ? "text-slate-400 line-through"
                                : "text-slate-100"
                            }
                          >
                            {habito.titulo}
                          </span>
                        </div>
                  
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                          {habito.horario}
                        </span>
                  
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-col">
            <span className="mb-4 text-lg font-medium text-slate-200">📊 Resumo</span>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1B1B22] border border-slate-800 hover:border-red-700 transition">
                <div className="p-3 rounded-lg bg-red-900/30 w-fit">
                  <FaFire className="text-red-500 text-xl" />
                </div>
                <span className="text-2xl font-semibold text-white">0</span>
                <p className="text-xs text-slate-400">Sequência total</p>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1B1B22] border border-slate-800 hover:border-red-700 transition">
                <div className="p-3 rounded-lg bg-green-900/30 w-fit">
                  <BiTask className="text-green-500 text-xl" />
                </div>
                <span className="text-2xl font-semibold text-white">0/{tarefas.length}</span>
                <p className="text-xs text-slate-400">Tarefas</p>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1B1B22] border border-slate-800 hover:border-red-700 transition">
                <div className="p-3 rounded-lg bg-yellow-900/30 w-fit">
                  <FiRefreshCcw className="text-yellow-500 text-xl" />
                </div>
                <span className="text-2xl font-semibold text-white">4/{habitos.length}</span>
                <p className="text-xs text-slate-400">Hábitos</p>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#1B1B22] border border-slate-800 hover:border-red-700 transition">
                <div className="p-3 rounded-lg bg-orange-900/30 w-fit">
                  <FiTarget className="text-orange-500 text-xl" />
                </div>
                <span className="flex items-center text-2xl font-semibold text-white">35 <MdOutlineKeyboardDoubleArrowUp color='#00C950'/></span> 
                <p className="text-xs text-slate-400">Pontos da semana</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

