import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../hooks/useToast';

const tones = {
  default: 'border-white/10 bg-slate-900/90 text-slate-100',
  success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100',
  error: 'border-rose-400/20 bg-rose-500/10 text-rose-100',
  info: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-100',
};

const Toaster = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`rounded-[1.5rem] border backdrop-blur-xl shadow-2xl shadow-black/30 ${tones[toast.variant] || tones.default}`}
          >
            <div className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && <p className="mt-1 text-sm/6 text-slate-300">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-full px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss toast"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;
