'use client';

export default function EstudoPage() {
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">Estudo</h1>
        <p className="text-sm text-slate-400">
          Organize matérias, blocos de foco e revisões.
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-[#1B1B22] p-4 text-sm text-slate-300">
        Em versões futuras você poderá criar trilhas de estudo, revisar
        conteúdo e conectar com seus hábitos de leitura e foco.
      </div>
    </section>
  );
}

