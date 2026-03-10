'use client';

export default function AcademiaPage() {
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">Academia</h1>
        <p className="text-sm text-slate-400">
          Planeje e acompanhe seus treinos dentro do TaskMind.
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-[#1B1B22] p-4 text-sm text-slate-300">
        Esta seção está preparada para receber seus treinos, divisão de
        musculação, cardio e metas semanais.
      </div>
    </section>
  );
}

