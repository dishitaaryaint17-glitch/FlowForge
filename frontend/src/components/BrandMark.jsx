import { APP_NAME } from '../utils/constants';

const BrandMark = ({ compact = false, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img
      src="/favicon.png"
      alt="FlowForge logo"
      className={compact ? 'h-9 w-9 rounded-2xl object-contain' : 'h-11 w-11 rounded-2xl object-contain'}
    />
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-500/80">Workspace</p>
      <h1 className="truncate text-lg font-extrabold tracking-tight text-[var(--foreground)]">{APP_NAME}</h1>
    </div>
  </div>
);

export default BrandMark;