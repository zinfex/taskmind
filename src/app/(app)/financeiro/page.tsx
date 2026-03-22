'use client';

export default function FinanceiroPage() {
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">Financeiro</h1>
        <p className="text-sm text-slate-400">
          Acompanhe gastos, entradas e metas financeiras lado a lado com suas
          tarefas.
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-[#1B1B22] p-4 text-sm text-slate-300">
        Aqui você poderá, no futuro, registrar despesas rápidas do dia e metas
        de economia para manter o foco no que importa.
      </div>
    </section>
  );
}

