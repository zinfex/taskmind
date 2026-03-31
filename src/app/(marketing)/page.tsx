'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiTarget, 
  FiTrendingUp, 
  FiHeart, 
  FiArrowRight,
  FiActivity,
  FiLayers,
  FiZap
} from 'react-icons/fi';
import { FaCrown, FaUser } from 'react-icons/fa';
import BorderGlow from '../components/(landing)/borderglow/BorderGlow';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const features = [
  {
    icon: <FiCheckCircle className="h-6 w-6" />,
    title: 'Gestão de Tarefas',
    description: 'Organize seu dia com clareza. Priorize o que realmente importa e nunca perca um prazo.',
    color: 'from-red-500/20 to-red-600/20',
  },
  {
    icon: <FiTarget className="h-6 w-6" />,
    title: 'Monitor de Hábitos',
    description: 'Construa consistência. Acompanhe sua evolução diária e transforme ações em rotina.',
    color: 'from-orange-500/20 to-red-500/20',
  },
  {
    icon: <FiHeart className="h-6 w-6" />,
    title: 'Bem-estar',
    description: 'Equilíbrio é fundamental. Monitore sua saúde mental e física enquanto produz.',
    color: 'from-red-600/20 to-rose-500/20',
  },
  {
    icon: <FiTrendingUp className="h-6 w-6" />,
    title: 'Estudos & Finanças',
    description: 'Tudo em um só lugar. Controle seu progresso acadêmico e financeiro com facilidade.',
    color: 'from-rose-600/20 to-red-700/20',
  },
];

export default function LandingPage() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const background = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, rgba(255, 255, 255, 0.1), transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full flex min-h-screen flex-col items-center justify-center">
    <div className="flex flex-col gap-20 py-10 w-full relative mx-auto w-full max-w-6xl px-4">
      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-900/10 blur-[120px] rounded-full -z-10" />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto px-4 mb-20">
      
        <div 
          style={{ perspective: "1200px" }}
          className="w-full max-w-4xl mx-auto"
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateY,
              rotateX,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full rounded-2xl bg-slate-800/50 p-1 cursor-pointer overflow-hidden border border-slate-500/50 shadow-2xl group"
          >
            {/* Glare effect overlay */}
            <motion.div
              style={{
                background,
                zIndex: 10,
              }}
              className="absolute inset-0 pointer-events-none"
            />

            <motion.img
              src="tabela.png"
              alt="Interface TaskMind"
              className="w-full rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                transform: "translateZ(50px)",
              }}
            />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-slate-50 sm:text-6xl"
        >
          Domine seu Tempo, <br />
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Conquiste sua Rotina
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg leading-8 text-slate-400 max-w-2xl"
        >
          O TaskMind é a central definitiva para organizar tarefas, monitorar hábitos e acompanhar sua evolução em uma interface moderna e pensada para sua produtividade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="group relative flex items-center gap-2 rounded-xl bg-red-500 px-8 py-4 font-semibold text-slate-50 transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
          >
            Começar Gratuitamente
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#features"
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-8 py-4 font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-slate-50"
          >
            Saiba Mais
          </Link>
        </motion.div>
      </section>

      {/* Preview Section - Stylized App Visual */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-8 lg:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-red-500/5 blur-[100px] rounded-full" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">
              Interface pensada para <span className="text-red-500">não atrapalhar</span> seu fluxo.
            </h2>
            <ul className="flex flex-col gap-4">
              {[
                { icon: <FiActivity />, text: 'Visualização rápida do seu progresso diário.' },
                { icon: <FiLayers />, text: 'Categorização inteligente por áreas da vida.' },
                { icon: <FiCheckCircle />, text: 'Checklist fluido e responsivo.' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="text-red-500">{item.icon}</div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full flex justify-center">
            {/* Mockup do App */}
            <img src="readme.png" alt="" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-red-500/30 hover:bg-slate-900"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-red-500`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-50 group-hover:text-red-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      

      <section className='w-full flex flex-col justify-center items-center my-20'>

        <div className="flex flex-col items-center text-center gap-6 py-10">
          <h2 className="text-3xl font-bold text-slate-50 sm:text-5xl">
            Pronto para elevar seu jogo?
          </h2>
          <p className="text-slate-400 text-lg max-w-xl">
            Junte-se a centenas de pessoas que já estão transformando sua produtividade com o TaskMind.
          </p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:w-[80%] justify-center align-center "
        >
          <motion.div className="group relative flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-red-500/30 hover:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/20 to-rose-500/20 flex items-center justify-center text-red-500">
              <FaUser/>
            </div>
            <h1 className='text-3xl font-bold text-slate-50 '>Começar</h1>
            <span className='text-4xl font-bold text-slate-50'>R$ 0 <span className='text-slate-400 text-sm'>/ Por mês</span></span> 

            <ul className="flex flex-col gap-3 mt-6 text-slate-300">
              <li className="flex items-center gap-2"><FiZap className="text-red-500" /> 4 tarefas liberadas</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-red-500" /> Hábitos limitados</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-red-500" /> Dashboard limitado</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-red-500" /> Calendário de check</li>
            </ul>


            <Link
              href="/login"
              className="rounded-xl bg-red-500 px-10 py-4 mt-10 font-bold text-slate-50 text-center transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
            >
              COMEÇAR AGORA
            </Link>
            
          </motion.div>
         
            <BorderGlow className="group relative flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-red-500/30 hover:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/20 to-rose-500/20 flex items-center justify-center text-red-500">
              <FaCrown size={20}/>
            </div>
            <h1 className='text-3xl font-bold text-slate-50 '>Foco Máximo</h1>
            <span className='text-4xl font-bold text-slate-50'>R$ 30 <span className='text-slate-400 text-sm'>/ Por mês</span></span>

            <ul className="flex flex-col gap-3 mt-6 text-slate-300">
              <li className="flex items-center gap-2"><FiCheckCircle className="text-red-500" /> Hábitos ilimitados</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-red-500" /> Estudos avançados</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-red-500" /> Controle financeiro</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-red-500" /> Personalização avançada</li>
            </ul>

            <Link
              href="/login"
              className="rounded-xl bg-red-500 px-10 py-4 mt-auto bg-gradient-to-r text-center from-red-600 to-rose-900 font-bold text-slate-50 transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
            >
              ASSINAR AGORA
            </Link>
       
          </BorderGlow>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 pt-8 pb-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© 2026 TaskMind. Todos os direitos reservados.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-slate-300">Termos</Link>
          <Link href="#" className="hover:text-slate-300">Privacidade</Link>
          <Link href="#" className="hover:text-slate-300">Contato</Link>
        </div>
      </footer>
    </div>
  </div>
  );
}