'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaCheck, FaTimes } from 'react-icons/fa';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function UpgradeModal({ isOpen, onClose, title, description }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#111117] p-8 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <FaTimes />
          </button>

          {/* Premium Icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-1 shadow-lg shadow-orange-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#111117]">
              <FaCrown className="text-4xl text-yellow-500" />
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-black tracking-tight text-white">
            {title || 'Desbloqueie o PRO'}
          </h2>
          <p className="mb-8 text-slate-400 leading-relaxed">
            {description || 'Você atingiu o limite do plano gratuito. Assine o plano PRO para criar tarefas e hábitos ilimitados, além de recursos exclusivos.'}
          </p>

          <div className="mb-8 space-y-4">
            {[
              'Tarefas e Hábitos ilimitados',
              'Relatórios semanais detalhados',
              'Personalização de temas',
              'Sincronização em tempo real'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 text-[10px]">
                  <FaCheck />
                </div>
                <span className="text-sm font-medium text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 font-bold text-white shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Assinar PRO por R$ 29,90/mês
            </button>
            <button
              onClick={onClose}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-white/5 font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white"
            >
              Talvez mais tarde
            </button>
          </div>

          {/* Decorative element */}
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-orange-600/10 blur-[80px]" />
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-red-600/10 blur-[80px]" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
