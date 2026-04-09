'use client';

import { FormEvent, useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTaskmind } from '@/app/providers';
import { motion } from 'framer-motion';
import { FaRegTrashAlt, FaPlus, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaCheck } from 'react-icons/fa';
import { ActionState, createHabitos, deleteHabitosDB, listHabitos, toggleHabito } from '@/app/actions/habitos';
import { FiRefreshCcw } from 'react-icons/fi';
import LoadingSkeleton from '@/app/components/(app)/LoadingSkeleton';
import UpgradeModal from '@/app/components/(app)/UpgradeModal';

function toISODate(d: Date) {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function startOfWeekMonday(base: Date) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export default function HabitosPage() {
  const {
    hoje,
    adicionarHabito,
    alternarHabitoNoDia,
    habitoConcluidoNoDia,
  } = useTaskmind();
  const [titulo, setTitulo] = useState('');
  const [horario, setHorario] = useState('07:00');
  const [semanaInicio, setSemanaInicio] = useState(() =>
    startOfWeekMonday(new Date()),
  );

  const [habitosDB, setHabitosDB] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const initialState: ActionState = {
    error: null,
    success: null,
  };

  const [state, formAction, isPending] = useActionState(createHabitos, initialState);
  
  const carregarHabitos = useCallback(async () => {
    setCarregando(true);
    try {
      const resultado = await listHabitos();
      if (resultado.success && resultado.data) {
        setHabitosDB(resultado.data);
      }
    } catch (err) {
      console.error("Erro ao carregar hábitos:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    carregarHabitos();
  }, [carregarHabitos]);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setTitulo('');
      setHorario('07:00');
      carregarHabitos();
    }
    if (state?.limitReached) {
      setShowUpgradeModal(true);
    }
  }, [state, carregarHabitos]);

  const handleToggle = async (habitoId: any, dataIso: string) => {
    const concluido = habitoConcluidoNoDia(habitoId, dataIso);
    alternarHabitoNoDia(habitoId, dataIso);
    const res = await toggleHabito(habitoId, !concluido, dataIso);
    if (res.error) {
      console.error("Erro ao sincronizar toggle no banco:", res.error);
      carregarHabitos();
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Tem certeza que deseja excluir este hábito?")) return;
    setHabitosDB(prev => prev.filter(t => t.id !== id));
    const res = await deleteHabitosDB(id);
    if (res.error) {
      alert("Erro ao excluir hábito: " + res.error);
      carregarHabitos();
    }
  };

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

  if (!mounted) return null;

  return (
    <section className="flex w-full flex-col gap-10 pb-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <FiRefreshCcw className="text-4xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-white">Hábitos Diários</h1>
            <p className="text-slate-400">Construa consistência dia após dia</p>
          </div>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white/5 p-1 border border-white/10 backdrop-blur-md"
      >
        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end"
        >
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Nome do Hábito
            </label>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 ring-1 ring-white/10 focus-within:ring-emerald-500/50 transition-all">
              <FaPlus className="text-slate-500 text-xs" />
              <input
                type="text"
                value={titulo}
                name='titulo'
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ex: Ler 10 páginas, beber água..."
                className="flex-1 bg-transparent py-3 text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:w-40">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Horário
            </label>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 ring-1 ring-white/10 focus-within:ring-emerald-500/50 transition-all">
              <FaClock className="text-slate-500 text-xs" />
              <input
                type="time"
                name='finalizar'
                value={horario}
                onChange={e => setHorario(e.target.value)}
                className="flex-1 bg-transparent py-3 text-white outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!titulo.trim() || isPending}
            className="flex h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
          >
            <span>{isPending ? 'Criando...' : 'Criar Hábito'}</span>
          </button>
        </form>
        {state?.error && (
          <p className="p-2 text-xs text-red-500 ml-2">{state.error}</p>
        )}
      </motion.div>

      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Acompanhamento Semanal</h2>
              <p className="text-sm text-slate-500">Progresso dos seus hábitos</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => {
                const d = new Date(semanaInicio);
                d.setDate(d.getDate() - 7);
                setSemanaInicio(d);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setSemanaInicio(startOfWeekMonday(new Date()))}
              className="px-4 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {carregando ? (
          <LoadingSkeleton />
        ) : habitosDB.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <p className="text-slate-500 italic">Nenhum hábito cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-[220px] bg-[#111117] px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-white/10">
                    Hábito
                  </th>
                  {diasDaSemana.map(dia => {
                    const isHoje = dia.iso === hoje;
                    return (
                      <th
                        key={dia.iso}
                        className={`px-2 py-5 text-center border-b border-white/10 ${
                          isHoje ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-[10px] font-bold uppercase ${isHoje ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {dia.label}
                          </span>
                          <span className={`text-sm font-bold ${isHoje ? 'text-white scale-110 origin-center' : 'text-slate-300'}`}>
                            {dia.iso.slice(8, 10)}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="w-[80px] px-6 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-white/10">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {habitosDB.map(habito => (
                  <tr key={habito.id} className="group hover:bg-white/[0.03] transition-all">
                    <td className="sticky left-0 z-10 bg-[#111117]/95 backdrop-blur-md px-6 py-5 group-hover:bg-white/[0.05] transition-all">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100">{habito.titulo}</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mt-1">
                          <FaClock className="text-emerald-500/50" />
                          {habito.finalizar || '00:00'}
                        </span>
                      </div>
                    </td>

                    {diasDaSemana.map(dia => {
                      const checked = habitoConcluidoNoDia(habito.id, dia.iso);
                      const isHoje = dia.iso === hoje;
                      return (
                        <td
                          key={`${habito.id}-${dia.iso}`}
                          className={`px-2 py-5 text-center ${isHoje ? 'bg-emerald-500/5' : ''}`}
                        >
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleToggle(habito.id, dia.iso)}
                              className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                                checked
                                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                  : 'border-white/10 bg-white/5 text-transparent hover:border-emerald-500/50 hover:scale-110'
                              }`}
                            >
                              <FaCheck className={`h-3 w-3 transition-all ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                            </button>
                          </div>
                        </td>
                      );
                    })}

                    <td className="px-6 py-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(habito.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all hover:bg-red-500/10 hover:text-red-500"
                      >
                        <FaRegTrashAlt className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        title="Limite de Hábitos Atingido"
        description="No plano gratuito você pode criar até 4 hábitos diários. Assine o plano PRO para ter hábitos ilimitados e construir uma rotina de alta performance!"
      />
    </section>
  );
}

