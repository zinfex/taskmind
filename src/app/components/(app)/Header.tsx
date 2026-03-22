'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Hoje', href: '/hoje' },
  { label: 'Tarefas', href: '/tarefas' },
  { label: 'Hábitos', href: '/habitos' },
  { label: 'Bem-estar', href: '/bem-estar' },
  { label: 'Academia', href: '/academia' },
  { label: 'Estudo', href: '/estudo' },
  { label: 'Financeiro', href: '/financeiro' },
  { label: 'Configurações', href: '/configuracoes' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 backdrop-blur sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-red-400 to-red-500 text-md font-bold text-slate-950">
            TM
          </div>
          <div>
            <p className="text-md font-semibold text-slate-50">TaskMind</p>
            <p className="text-sm text-slate-400">
              Organize seu hoje, construa seus hábitos.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 text-sm">
          {tabs.map(tab => {
            const ativo =
              pathname === tab.href ||
              (tab.href === '/hoje' && pathname === '/');

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={[
                  'rounded-lg px-3 py-1 transition-colors',
                  ativo
                    ? 'bg-red-500 text-slate-50 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-50',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

