import { classNames } from '../utils/formatters';

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  title, 
  className = '', 
  variant = 'ghost',
  disabled = false,
  ...props 
}) => (
  <button
    className={classNames(
      'rounded-lg p-2 transition duration-200 transform-gpu will-change-transform focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-soft)] hover:bg-[var(--surface-hover)]',
      variant === 'danger' && 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300',
      variant === 'ghost' && 'text-[var(--muted)] hover:text-[var(--foreground)]',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
    onClick={onClick}
    title={title}
    disabled={disabled}
    {...props}
  >
    <Icon className="h-4 w-4" />
  </button>
);

export default IconButton;
