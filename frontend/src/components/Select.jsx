import { classNames } from '../utils/formatters';

const Select = ({ label, className, children, error, invalid, ...props }) => (
  <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
    {label}
    <select
      aria-invalid={invalid || undefined}
      className={classNames(
        'rounded-[1.15rem] border border-[var(--border)] bg-[var(--surface-input)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[color:var(--primary-soft)]',
        invalid && 'border-rose-400/80 ring-2 ring-rose-400/20 animate-[field-shake_0.32s_ease-in-out]',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-xs font-medium text-rose-500">{error}</span>}
  </label>
);

export default Select;
