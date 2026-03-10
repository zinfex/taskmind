'use client';

export default function BemEstarPage() {
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">Bem-estar</h1>
        <p className="text-sm text-slate-400">
          Espaço para acompanhar sono, energia, humor e autocuidado.
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-[#1B1B22] p-4 text-sm text-slate-300">
        Em breve você poderá registrar indicadores de bem-estar aqui e conectar
        com seus hábitos e tarefas.
      </div>
    </section>
  );
}

