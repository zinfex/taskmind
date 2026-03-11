'use client';

import { FaTasks } from 'react-icons/fa';
import { useTaskmind } from '../providers';

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
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#1B1B22] px-3 py-4"
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

        <div className='md:w-[100%] grid grid-cols-2'>
          <div>
            <h2 className="mb-3 text-lg font-medium text-slate-200">
            🔁 Hábitos de hoje ({habitos.length})
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
                    <div className="flex cursor-pointer items-center gap-4 text-lg">
                      <li
                        key={habito.id}
                        className="flex items-center justify-between rounded-lg border-1 border-slate-800 bg-[#1B1B22] px-3 py-4 transition hover:border-red-800 w-full"
                      >
                          <div className="flex gap-3 items-center">
                          <input
                            type="checkbox"
                            checked={concluido}
                            onChange={() => alternarHabitoNoDia(habito.id, hoje)}
                            className="h-6 w-6 appearance-none rounded-full border-2 border-slate-500  checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition"
                          />
                          <span
                            className={
                              concluido
                                ? 'text-slate-400 line-through'
                                : 'text-slate-100'
                            }
                          >
                            {habito.titulo}
                          </span>
                          </div>

                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                            {habito.horario}
                          </span>
                      </li>
                    </div>
                  );
                })}
              </ul>
            )}
          </div>

          
        </div>
      </div>
    </section>
  );
}

