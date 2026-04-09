'use client';

import { FaFire, FaTasks, FaCheckCircle } from 'react-icons/fa';
import { FiRefreshCcw, FiTarget, FiCalendar, FiClock, FiBarChart2 } from 'react-icons/fi';
import { BiTask } from 'react-icons/bi';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTaskmind } from '@/app/providers';
import { IoPartlySunny } from 'react-icons/io5';
import { listTarefas, toggleTarefa } from '@/app/actions/tarefas';
import { listHabitos, toggleHabito } from '@/app/actions/habitos';
import LoadingSkeleton from '@/app/components/(app)/LoadingSkeleton';

export default function HojePage() {
  const {
    hoje,
    alternarHabitoNoDia,
    habitoConcluidoNoDia,
  } = useTaskmind();

  const [mounted, setMounted] = useState(false);
  const [tarefasDB, setTarefasDB] = useState<any[]>([]);
  const [habitosDB, setHabitosDB] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [resTarefas, resHabitos] = await Promise.all([
        listTarefas(),
        listHabitos()
      ]);
      
      if (resTarefas.success && resTarefas.data) {
        setTarefasDB(resTarefas.data);
      }
      if (resHabitos.success && resHabitos.data) {
        setHabitosDB(resHabitos.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    carregarDados();
  }, [carregarDados]);

  const handleToggleTarefa = async (id: number | string, statusAtual: any) => {
    const isFinalizada = statusAtual === true || statusAtual === "TRUE";
    const novoStatus = !isFinalizada;

    setTarefasDB(prev => prev.map(t => 
      t.id === id ? { ...t, finalizada: novoStatus } : t
    ));

    const res = await toggleTarefa(id, novoStatus);
    if (res.error) {
      alert("Erro ao atualizar tarefa: " + res.error);
      carregarDados();
    }
  };

  const handleToggleHabito = async (habito: any) => {
    const concluido = habitoConcluidoNoDia(habito.id, hoje);
    
    // Alterna localmente no provider (controle por dia)
    alternarHabitoNoDia(habito.id, hoje);

    // Sincroniza com o banco (status global do hábito)
    const res = await toggleHabito(habito.id, !concluido);
    if (res.error) {
      console.error("Erro ao sincronizar hábito no banco:", res.error);
    }
  };

  const tarefasDeHoje = tarefasDB;
  const habitosDeHoje = habitosDB;

  const tarefasConcluidas = tarefasDeHoje.filter(t => t.finalizada === true || t.finalizada === "TRUE").length;
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
    <div className="flex w-full flex-col gap-10 pb-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/20">
            <IoPartlySunny className="text-4xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-white">Bom dia!</h1>
            <p className="text-slate-400 capitalize">{dataFormatada}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[260px] bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between text-sm font-medium mb-1">
            <span className="text-slate-300">Progresso do dia</span>
            <span className="text-white font-bold">{progressoTotal}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ width: `${progressoTotal}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          {/* Tarefas Section */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <BiTask className="text-xl" />
                </div>
                Tarefas para hoje
                <span className="ml-1 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-white/5">
                  {tarefasDeHoje.length}
                </span>
              </h2>
            </div>

            {carregando ? (
              <LoadingSkeleton />
            ) : tarefasDeHoje.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center transition-all hover:bg-white/[0.07]">
                <div className="mb-4 rounded-full bg-white/5 p-5 text-slate-600">
                  <FaTasks className="text-4xl" />
                </div>
                <p className="text-lg font-medium text-slate-300">Nenhuma tarefa para hoje</p>
                <p className="text-sm text-slate-500 mt-2 max-w-[240px]">Foque em seus hábitos ou aproveite para descansar.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {tarefasDeHoje.map(tarefa => {
                  const isFinalizada = tarefa.finalizada === true || tarefa.finalizada === "TRUE";
                  const dataCriacao = new Date(tarefa.created_at);
                  const hojeDate = new Date();
                  dataCriacao.setHours(0, 0, 0, 0);
                  hojeDate.setHours(0, 0, 0, 0);
                  const diffTime = hojeDate.getTime() - dataCriacao.getTime();
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  const isAtrasada = !isFinalizada && diffDays > 0;

                  return (
                    <div
                      key={tarefa.id}
                      onClick={() => handleToggleTarefa(tarefa.id, tarefa.finalizada)}
                      className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                        isFinalizada 
                          ? 'border-white/5 bg-white/[0.02] opacity-60' 
                          : 'border-white/10 bg-white/5 hover:border-red-500/50 hover:bg-white/[0.08] hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          {isFinalizada ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                              <FaCheckCircle className="h-4 w-4" />
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
                            <span className="text-sm text-slate-500 line-clamp-1">
                              {tarefa.descricao}
                            </span>
                          )}
                          {isAtrasada && (
                            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md self-start">
                              Atrasada há {diffDays} {diffDays === 1 ? 'dia' : 'dias'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Habitos Section */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <FiRefreshCcw className="text-xl" />
                </div>
                Hábitos diários
                <span className="ml-1 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-white/5">
                  {habitosDeHoje.length}
                </span>
              </h2>
              
              <button className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white border border-white/10 transition-all hover:bg-white/10 active:scale-95">
                <FiBarChart2 className="text-red-500" />
                Obter relatório semanal
              </button>
            </div>

            {habitosDeHoje.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-sm text-slate-500">
                Nenhum hábito configurado para hoje.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {habitosDeHoje.map(habito => {
                  const concluido = habitoConcluidoNoDia(habito.id, hoje);
                  return (
                    <div
                      key={habito.id}
                      onClick={() => handleToggleHabito(habito)}
                      className={`group flex cursor-pointer flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 ${
                        concluido 
                          ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-white/[0.08] hover:-translate-y-1'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${
                          concluido ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400 group-hover:bg-red-500/20 group-hover:text-red-400'
                        }`}>
                          {concluido ? <FaCheckCircle className="text-xl" /> : <FiClock className="text-xl" />}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Meta</span>
                          <span className="text-xs font-bold text-white">
                            {habito.finalizar || '00:00'}
                          </span>
                        </div>
                      </div>
                      <span className={`text-lg font-bold transition-all ${concluido ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                        {habito.titulo}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Summary */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Resumo do Dia
            </h3>
            
            <div className="grid gap-5">
              {[
                { icon: <FaFire />, color: 'red', val: '0', label: 'Dias de sequência', bg: 'bg-red-500/10', text: 'text-red-500' },
                { icon: <FaTasks />, color: 'green', val: `${tarefasConcluidas}/${tarefasDeHoje.length}`, label: 'Tarefas concluídas', bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
                { icon: <FiRefreshCcw />, color: 'blue', val: `${habitosConcluidos}/${habitosDeHoje.length}`, label: 'Hábitos realizados', bg: 'bg-blue-500/10', text: 'text-blue-500' },
                { icon: <FiTarget />, color: 'orange', val: '35', label: 'Pontos da semana', bg: 'bg-orange-500/10', text: 'text-orange-500', trend: <MdOutlineKeyboardDoubleArrowUp className="text-emerald-500" /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 rounded-2xl bg-white/5 p-4 border border-white/5 transition-hover hover:bg-white/[0.08]">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.text}`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-black text-white">{item.val}</p>
                      {item.trend && <span className="text-xl">{item.trend}</span>}
                    </div>
                    <p className="text-xs font-medium text-slate-500">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 text-white shadow-xl shadow-purple-500/20 relative group">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h4 className="font-bold relative z-10">Dica do dia</h4>
              <p className="mt-2 text-sm text-white/90 leading-relaxed font-medium relative z-10">
                Manter uma rotina consistente é a chave para o sucesso a longo prazo. Comece pequeno, cresça sempre.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
