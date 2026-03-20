'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiUserPlus, FiUserCheck, FiAlertCircle } from 'react-icons/fi';
import { login } from '@/app/actions/auth';
import { useActionState } from 'react';

const initialState = {
  error: null as string | null,
}

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, initialState);

  return (
    <div className="relative w-full max-w-md px-4 justify-center mt-20 justify-self-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-900/10 blur-[100px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm justify-center "
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-red-400 to-red-600 text-xl font-bold text-slate-950">
            TM
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mt-4">Bem-vindo de volta</h1>
          <p className="text-slate-400">Entre na sua conta para continuar</p>
        </div>

        {/* Error Message */}
        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 animate-in fade-in slide-in-from-top-1">
            <FiAlertCircle className="shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4" action={action}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">E-mail</label>
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-red-500" />
              <input
                type="email"
                name="email"
                required
                placeholder="exemplo@email.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3.5 pl-11 pr-4 text-slate-50 outline-none transition-all placeholder:text-slate-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 disabled:opacity-50"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-slate-300">Senha</label>
              <Link href="#" className="text-xs text-red-400 hover:text-red-300 transition-colors">Esqueceu a senha?</Link>
            </div>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-red-500" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3.5 pl-11 pr-4 text-slate-50 outline-none transition-all placeholder:text-slate-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 disabled:opacity-50"
                disabled={isPending}
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isPending}
            className="group mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-3.5 font-bold text-slate-50 transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Entrando...' : (
              <>
                Entrar
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">ou</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-slate-50"
          >
            <FiUserPlus className="text-red-500" />
            Criar Conta
          </Link>
          <Link
            href="/hoje"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-slate-50"
          >
            <FiUserCheck className="text-red-500" />
            Acessar como Visitante
          </Link>
        </div>
      </motion.div>

      {/* Footer Links */}
      <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300 transition-colors">Voltar para Início</Link>
        <Link href="#" className="hover:text-slate-300 transition-colors">Termos de Uso</Link>
        <Link href="#" className="hover:text-slate-300 transition-colors">Privacidade</Link>
      </div>
    </div>
  );
}
