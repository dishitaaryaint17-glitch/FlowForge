export const formatDate = (input) => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatPercent = (value) => `${Math.round(value)}%`;

export const classNames = (...classes) => classes.filter(Boolean).join(' ');
