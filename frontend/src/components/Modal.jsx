import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

const Modal = ({ open, title, children, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-card w-full max-w-lg rounded-[2rem] p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--foreground)]">{title}</h3>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
