import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Button from './Button';

const LogoutConfirmDialog = ({ open, onCancel, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="modal-card w-full max-w-md rounded-[2rem] p-8 shadow-2xl shadow-black/30"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                Logout
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[var(--foreground)]">
                Logout?
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Are you sure you want to logout from your workspace?
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={isLoading}
                className={isLoading ? 'opacity-75 cursor-not-allowed' : ''}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging out...
                  </span>
                ) : (
                  'Logout'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmDialog;
