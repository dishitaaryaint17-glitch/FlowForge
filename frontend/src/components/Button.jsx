import { classNames } from '../utils/formatters';

const variants = {
  primary:
    'bg-[linear-gradient(135deg,rgba(75,116,217,1),rgba(93,125,245,1))] text-white font-semibold border border-transparent shadow-[0_14px_32px_rgba(75,116,217,0.2)] hover:brightness-105 hover:shadow-[0_18px_40px_rgba(75,116,217,0.22)]',
  ghost:
    'bg-[var(--surface-soft)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[rgba(255,255,255,0.16)]',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
};

const Button = ({ variant = 'primary', className, children, ...props }) => (
  <button
    className={classNames(
      'rounded-[1.15rem] px-4 py-2.5 text-sm transition duration-300 transform-gpu will-change-transform focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-soft)]',
      variants[variant],
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
