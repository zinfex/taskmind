'use client';

export default function ConfiguracoesPage() {
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-50">
          Configurações
        </h1>
        <p className="text-sm text-slate-400">
          Personalize como o TaskMind funciona para você.
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-[#1B1B22] p-4 text-sm text-slate-300">
        Em breve você poderá ajustar preferências como tema, idioma, horários
        padrão e comportamento das notificações diárias.
      </div>
    </section>
  );
}

