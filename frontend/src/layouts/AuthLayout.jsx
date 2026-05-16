import { motion } from 'framer-motion';

import BrandMark from '../components/BrandMark';

const AuthLayout = ({ eyebrow, title, subtitle, children }) => (
  <div className="noise-bg flex min-h-screen items-center justify-center p-4">
    <motion.div
      className="glass-panel relative w-full max-w-[920px] overflow-hidden rounded-[2rem] border border-white/10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="absolute right-3 top-3 z-10">
       
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-400/12 via-white/5 to-violet-400/12 p-7 lg:flex">
          <div>
            <BrandMark className="mb-8" />
            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-500/80">{eyebrow || 'Task management'}</p>
            <h1 className="mt-4 max-w-sm text-4xl font-extrabold tracking-tight text-[var(--foreground)]">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-[var(--surface-strong)] p-4 text-sm text-slate-500 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Workspace</p>
            <p className="mt-2 text-[var(--foreground)]">Compact, role-aware task operations for modern teams.</p>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          <div className="lg:hidden pr-16">
            <BrandMark compact className="mb-6" />
            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-500/80">{eyebrow || 'Task management'}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{title}</h1>
            <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="mt-6 lg:mt-0">{children}</div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default AuthLayout;
