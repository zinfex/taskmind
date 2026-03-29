'use client';

import { useEffect, useState } from 'react';
import { getUser, logout } from '@/app/actions/auth';
import { FiUser, FiCalendar, FiCreditCard, FiLogOut } from 'react-icons/fi';
import LoadingSkeleton from '@/app/components/(app)/LoadingSkeleton';

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { user } = await getUser();
      setUser(user);
      setLoading(loading => false);
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <section className="flex w-full flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-slate-50">Configurações</h1>
          <p className="text-sm text-slate-400">Carregando suas informações...</p>
        </header>
        <LoadingSkeleton />
      </section>
    );
  }

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const accountType = user?.account_type || 'Grátis';

  return (
    <section className="flex w-full flex-col gap-8 pb-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">Configurações</h1>
        <p className="text-sm text-slate-400">
          Gerencie sua conta e preferências.
        </p>
      </header>

      <div className="grid gap-6">
        {/* Informações da Conta */}
        <div className="rounded-2xl border border-slate-800 bg-[#1B1B22] p-6">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FiUser className="text-red-500" /> Informações da Conta
          </h2>
          
          <div className="grid gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">E-mail</span>
              <span className="text-slate-200 font-medium">{user?.email}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Senha</span>
              <span className="text-slate-200">••••••••••••</span>
            </div>
          </div>
        </div>

        {/* Detalhes do Plano */}
        <div className="rounded-2xl border border-slate-800 bg-[#1B1B22] p-6">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FiCreditCard className="text-red-500" /> Assinatura e Plano
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Estilo de Conta</span>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  accountType === 'Pro' 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {accountType}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Iniciado em</span>
              <div className="flex items-center gap-2 text-slate-200">
                <FiCalendar className="text-slate-500" />
                <span>{createdDate}</span>
              </div>
            </div>
          </div>

          {accountType === 'Grátis' && (
            <div className="mt-6 rounded-xl bg-gradient-to-r from-red-900/20 to-orange-900/20 p-4 border border-red-500/10">
              <p className="text-sm text-slate-300">
                🚀 <span className="text-slate-100 font-semibold">Seja Pro!</span> Libere hábitos ilimitados e estatísticas avançadas.
              </p>
            </div>
          )}
        </div>

        {/* Ações da Conta */}
        <div className="rounded-2xl border border-slate-800 bg-[#1B1B22] p-6">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            Mais Opções
          </h2>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => logout()}
              className="flex items-center gap-2 w-fit px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 transition-all text-sm font-medium"
            >
              <FiLogOut /> Sair da conta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

