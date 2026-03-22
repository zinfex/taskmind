'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiLogIn, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { signup } from '@/app/actions/auth';
import { useActionState } from 'react';


export default function SignupPage() {
  const [state, action, isPending] = useActionState(signup);

  return (
    <div className="relative w-full max-w-md px-4 justify-center mt-20 justify-self-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-900/10 blur-[100px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-red-500 to-red-600 text-xl font-bold text-slate-950">
            <img src={'logo.png'} width={20}/>
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mt-4">Criar sua conta</h1>
          <p className="text-slate-400">Junte-se ao TaskMind hoje mesmo</p>
        </div>

        {/* Feedback Messages */}
        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 animate-in fade-in slide-in-from-top-1">
            <FiAlertCircle className="shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {state?.success && (
          <div className="flex flex-col gap-3 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400 border border-emerald-500/20 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center flex-col gap-2">
              <FiCheckCircle className="shrink-0" />
              <p className="font-semibold">{state.success}</p>
            </div>
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
            >
              Confirme seu e-mail
            </Link>
          </div>
        )}

        {/* Form */}
        {!state?.success && (
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
              <label className="text-sm font-medium text-slate-300 ml-1">Senha</label>
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
              {isPending ? 'Criando conta...' : (
                <>
                  Criar Conta
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">ou</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-slate-50"
          >
            <FiLogIn className="text-red-500" />
            Já tenho uma conta
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
