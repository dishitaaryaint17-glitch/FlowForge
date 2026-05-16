import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

const AlertDialog = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-card w-full max-w-md rounded-[2rem] p-6 shadow-2xl shadow-black/30"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Confirmation</p>
            <h3 className="mt-2 text-xl font-bold text-[var(--foreground)]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AlertDialog;
